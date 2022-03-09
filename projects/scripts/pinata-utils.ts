import {sleep} from "./utils";

require('dotenv').config();
import { Metadata } from 'rmrk-tools/dist/tools/types';
import pLimit from 'p-limit';
import { Readable } from 'stream';
import fs from 'fs';
// @ts-ignore
import pinataSDK, { PinataOptions, PinataPinOptions } from '@pinata/sdk';

const defaultOptions: Partial<PinataPinOptions> = {
  pinataOptions: {
    cidVersion: 1,
  },
};

export const pinata = pinataSDK(process.env.PINATA_KEY, process.env.PINATA_SECRET);

const fsPromises = fs.promises;
export type StreamPinata = Readable & {
  path?: string;
};
const limit = pLimit(1);

export const pinFileStreamToIpfs = async (file: StreamPinata, name?: string) => {
  const options = { ...defaultOptions, pinataMetadata: { name } };
  const result = await pinata.pinFileToIPFS(file, options);
  return result.IpfsHash;
};

export const uploadAndPinIpfsMetadata = async (metadataFields: Metadata): Promise<string> => {
  const options = {
    ...defaultOptions,
    pinataMetadata: { name: metadataFields.name },
  };
  try {
    const metadata = { ...metadataFields };
    const metadataHashResult = await pinata.pinJSONToIPFS(metadata, options);
    return `ipfs://ipfs/${metadataHashResult.IpfsHash}`;
  } catch (error) {
    return '';
  }
};

export const pinSingleMetadataFromDir = async (
  dir: string,
  path: string,
  name: string,
  metadataBase: Partial<Metadata>,
) => {
  try {
    const imageFile = await fsPromises.readFile(`${process.cwd()}${dir}/${path}`);
    if (!imageFile) {
      throw new Error('No image file');
    }

    const stream: StreamPinata = Readable.from(imageFile);
    stream.path = path;

    const imageCid = await pinFileStreamToIpfs(stream, name);
    console.log(`NFT ${path} IMAGE CID: `, imageCid);
    const metadata: Metadata = { ...metadataBase, name, mediaUri: `ipfs://ipfs/${imageCid}` };
    const metadataCid = await uploadAndPinIpfsMetadata(metadata);
    await sleep(500);
    console.log(`NFT ${name} METADATA: `, metadataCid);
    return metadataCid;
  } catch (error) {
    console.log(error);
    console.log(JSON.stringify(error));
    return '';
  }
};

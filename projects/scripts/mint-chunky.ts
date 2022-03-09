import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import {
  ASSETS_CID,
  CHUNKY_BASE_SYMBOL,
  CHUNKY_COLLECTION_SYMBOL,
  WS_URL,
} from "./constants";
import { Base, Collection, NFT } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { pinSingleMetadataFromDir } from "./pinata-utils";
import { nanoid } from "nanoid";

export const addBaseResource = async (
  chunkyBlock: number,
  baseBlock: number
) => {
  try {
    console.log("ADD BASE RESOURCE TO CHUNKY NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    const api = await getApi(ws);
    const serialNumbers = [1, 2, 3, 4];

    const baseEntity = new Base(
      baseBlock,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    const BASE_ID = baseEntity.getId();

    const resourceRemarks = [];

    serialNumbers.forEach((sn) => {
      const nft = new NFT({
        block: chunkyBlock,
        collection: collectionId,
        symbol: `chunky_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      const baseResId = nanoid(8);

      resourceRemarks.push(
        nft.resadd({
          base: BASE_ID,
          id: baseResId,
          parts: [
            `chunky_body_${sn}`,
            `chunky_head_${sn}`,
            `chunky_hand_${sn}`,
            "chunky_objectLeft",
            "chunky_objectRight",
          ],
          thumb: `ipfs://ipfs/${ASSETS_CID}/Chunky%20Preview.png`,
        })
      );

      if (sn === 4) {
        const secondaryArtResId = nanoid(8);
        resourceRemarks.push(
          nft.resadd({
            src: `ipfs://ipfs/${ASSETS_CID}/chunky_altresource.jpg`,
            thumb: `ipfs://ipfs/${ASSETS_CID}/chunky_altresource.jpg`,
            id: secondaryArtResId,
          })
        );

        resourceRemarks.push(nft.setpriority([secondaryArtResId, baseResId]));
      }
    });

    const txs = resourceRemarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Chunky base resources added at block: ", block);
  } catch (error: any) {
    console.error(error);
  }
};

export const createChunkyCollection = async () => {
  try {
    console.log("CREATE CHUNKY COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets/chunky",
      "Chunky Preview.png",
      "RMRK2 demo chunky collection",
      {
        description: "This is Chunky! RMRK2 demo nested NFT",
        external_url: "https://rmrk.app",
        properties: {},
      }
    );

    const ItemsCollection = new Collection(
      0,
      10000,
      encodeAddress(accounts[0].address, 2),
      CHUNKY_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.create()),
      kp
    );
    console.log("COLLECTION CREATION REMARK: ", ItemsCollection.create());
    console.log("Chunky collection created at block: ", block);

    return block;
  } catch (error: any) {
    console.error(error);
  }
};

export const mintChunky = async () => {
  try {
    console.log("CREATE CHUNKY NFT START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    await createChunkyCollection();

    const api = await getApi(ws);

    const serialNumbers = [1, 2, 3, 4];

    const promises = serialNumbers.map(async (sn) => {
      const metadataCid = await pinSingleMetadataFromDir(
        "/assets/chunky",
        "Chunky Preview.png",
        `RMRK2 demo chunky NFT #${sn}`,
        {
          description: `This is Chunky #${sn}! RMRK2 demo nested NFT`,
          external_url: "https://rmrk.app",
          properties: {
            rarity: {
              type: "string",
              value: sn === 4 ? "epic" : "common",
            },
          },
        }
      );

      const nft = new NFT({
        block: 0,
        collection: collectionId,
        symbol: `chunky_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: metadataCid,
      });

      return nft.mint();
    });

    const remarks = await Promise.all(promises);

    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batchAll(txs);
    const { block } = await sendAndFinalize(tx, kp);
    console.log("Chunky NFT minted at block: ", block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};

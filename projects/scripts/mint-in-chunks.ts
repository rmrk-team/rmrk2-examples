require("dotenv").config();

import { Resource } from "rmrk-tools/dist/classes/nft";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { isProd, WS_URL } from "./constants";
import {
    chunkArray,
    getApi,
    getKeyringFromUri,
    getKeys,
    sendAndFinalize, sleep,
} from "./utils";
import { Collection, NFT } from "rmrk-tools";
import { encodeAddress } from "@polkadot/keyring";
import { nanoid } from "nanoid";
import fs from "fs";
import {
  uploadAndPinIpfsMetadata,
  pinFileStreamToIpfs,
  StreamPinata,
} from "./pinata-utils";
import { IProperties } from "rmrk-tools/dist/tools/types";
import { Readable } from "stream";
import { u8aToHex } from "@polkadot/util";
const BASE_ID = isProd ? "CHANGEME" : "CHANGEME";

const fsPromises = fs.promises;

interface TomoMintingResource {
  description: string;
  base?: string;
  src: string;
  slot?: string;
  thumb?: string;
}

interface IMintingRoyalties {
  royaltyPercentFloat: string;
  reciever: string;
}

const BANNERVERSE_COLLECTION_ID = "e0b9bdcc456a36497a-RMRKBNNRS";
const BANNERVERSE_COLLECTION_SYMBOL = "RMRKBNNRS";
const COMMISSION_ADDRESS = "CHANGEME";
const MINTER_ADDRESS = "CHANGEME";

interface BatchMintingObject {
  collection: {
    id: string;
    symbol: string;
  };
  symbol: string;
  title: string;
  description: string;
  recipients: Record<string, string>;
  properties: { context?: string; type?: string }[];
  royalties: IMintingRoyalties[];
  resources: TomoMintingResource[];
}

const mintObject: Record<string, BatchMintingObject> = {
  1: {
    collection: {
      id: BANNERVERSE_COLLECTION_ID,
      symbol: BANNERVERSE_COLLECTION_SYMBOL,
    },
    symbol: "BNNRX",
    title: "X",
    description:
      "February '22 RMRK Banner. The search continues. Where is the treasure buried? X Marks the Spot.",
    properties: [],
    royalties: [
      {
        reciever: COMMISSION_ADDRESS,
        royaltyPercentFloat: "5",
      },
    ],
    resources: [
      {
        description:
          "February '22 RMRK Banner. The search continues. Where is the treasure buried? X Marks the Spot.",
        src: "banners_02_22/2022 Feb_Banner 01 - Multiresource.png",
        thumb: "banners_02_22/2022 Feb_Banner 01 - Multiresource.png",
      },
    ],
    recipients: {
      [MINTER_ADDRESS]: "30",
    },
  },
  2: {
    collection: {
      id: BANNERVERSE_COLLECTION_ID,
      symbol: BANNERVERSE_COLLECTION_SYMBOL,
    },
    symbol: "BNNRCND",
    title: "Candyland",
    description:
      "February '22 RMRK Banner. Sometimes all you need is candy and color.",
    properties: [],
    royalties: [
      {
        reciever: MINTER_ADDRESS,
        royaltyPercentFloat: "5",
      },
    ],
    resources: [
      {
        description:
          "February '22 RMRK Banner. Sometimes all you need is candy and color.",
        src: "banners_02_22/2022 Feb_Banner 02 - Candy.png",
        thumb: "banners_02_22/2022 Feb_Banner 02 - Candy.png",
      },
    ],
    recipients: {
      [MINTER_ADDRESS]: "47",
      DhvJ4ZEKr75kBtr3VSwem84jbZCfmjUCZ771sf33Z5mX8Ta: "1",
      H2SwfhnSStX91iGZGye9L3wetRKahk1BZMCuSk7aXU66aFQ: "1",
      CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp: "1",
    },
  },
  3: {
    collection: {
      id: BANNERVERSE_COLLECTION_ID,
      symbol: BANNERVERSE_COLLECTION_SYMBOL,
    },
    symbol: "BNNRDSTRT",
    title: "Distort",
    description:
      "February '22 RMRK Banner. Distortion. Disturbance. Deformity. What do you see?",
    properties: [],
    royalties: [
      {
        reciever: MINTER_ADDRESS,
        royaltyPercentFloat: "5",
      },
    ],
    resources: [
      {
        description:
          "February '22 RMRK Banner. Distortion. Disturbance. Deformity. What do you see?",
        src: "banners_02_22/2022 Feb_Banner 03 - RMRK 2.0.png",
        thumb: "banners_02_22/2022 Feb_Banner 03 - RMRK 2.0.png",
      },
    ],
    recipients: {
      [MINTER_ADDRESS]: "95",
      DhvJ4ZEKr75kBtr3VSwem84jbZCfmjUCZ771sf33Z5mX8Ta: "1",
      H2SwfhnSStX91iGZGye9L3wetRKahk1BZMCuSk7aXU66aFQ: "1",
      CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp: "1",
      DJiT2VbsbvA6EMiUjtoXLuBXNCscexS3GUx3fxR1JwK8KMr: "1",
      EDQwsrUJQbBRxc5K5p1xKb55jhsr18fngdHghQQeTxEZLoM: "1",
    },
  },
  4: {
    collection: {
      id: BANNERVERSE_COLLECTION_ID,
      symbol: BANNERVERSE_COLLECTION_SYMBOL,
    },
    symbol: "BNNRDRK2",
    title: "RMRK2 Dark",
    description:
      "February '22 RMRK Banner. Finally, it's here! Darkly commemorating the launch of RMRK2 on Singular. But what's that in the back?",
    properties: [],
    royalties: [
      {
        reciever: MINTER_ADDRESS,
        royaltyPercentFloat: "5",
      },
    ],
    resources: [
      {
        description:
          "February '22 RMRK Banner. Finally, it's here! Darkly commemorating the launch of RMRK2 on Singular. But what's that in the back?",
        src: "banners_02_22/2022 Feb_Banner 04 - On singular dark.png",
        thumb: "banners_02_22/2022 Feb_Banner 04 - On singular dark.png",
      },
    ],
    recipients: {
      [MINTER_ADDRESS]: "228",
      DhvJ4ZEKr75kBtr3VSwem84jbZCfmjUCZ771sf33Z5mX8Ta: "1",
      H2SwfhnSStX91iGZGye9L3wetRKahk1BZMCuSk7aXU66aFQ: "1",
      CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp: "1",
      DJiT2VbsbvA6EMiUjtoXLuBXNCscexS3GUx3fxR1JwK8KMr: "1",
      EDQwsrUJQbBRxc5K5p1xKb55jhsr18fngdHghQQeTxEZLoM: "1",
      EB1oqZ5MEnEwxhJ5DySCH3pyY55a2CUDfAbYKmLz2QcqWgx: "1",
      EuJAYheXvPywhDqB9YYG9RYbp2iENUqT261FPRhhTioPxSu: "1",
      ErU55Vp3AGFGEbrL5Tj1Kv47xYBDU1McBA1ALPewgVjRZDn: "1",
      CmkHUWRBZWp8vh3t9ZMyddx3DHjqfv2jErXrECtcizxoGc2: "1",
      GhQgLK4MAj564SUQgbV5EeQRva8L9AUEkqT28mZsmCS1egv: "1",
      HpbFHQjLCCuBpBwS2wJe8pB4ZrgVxD6w2SGEE1ckzT3Uxs4: "1",
      GbqtkjvQKWsgovW69Ga4WBnJxH3fSv3XkP7yLWC33j4yaQB: "1",
      G2e4YrQ8CQ4yw7iy5yu9yB5vHxJjfS3q4T46ojazqsYkKjV: "1",
      HZXYG4jYFXwqwBrhnbjMUSXH49zV2CW8T1pEuHeQTfBNfq5: "1",
      HnnwFDsJiyThghLCmkbbQ2mtVrwzxjF5pWFUJbzWngDTvzj: "1",
      Fr6ovaQd8ysmjXEF76gQVCErsU8UYzXjYVKV2cTw9myK7A3: "1",
      HydwuGTL6vbThMEyZq5ygYqMeHvmSpTLRsZdLx313rcPv6M: "1",
      FRqF9tyZmKdSGoULHZC16GTf9RVNDvjhquq8tNwuDRjAaic: "1",
      G28YgXSEHW4EE7uR9N7vi7ULF2NEEtgsMCJLARD5Yj5a1Y7: "1",
      F2toN3eA5EWiWhggt14wDrmAiercTJvF8ye1tqHorQPyEM6: "1",
      EZv3htNfDpYt6m42xBaEbLr2Y2ZcPjHvY9y6tvZEcWBmefJ: "1",
      Fys7d6gikP6rLDF9dvhCJcAMaPrrLuHbGZRVgqLPn26fWmr: "1",
    },
  },
  5: {
    collection: {
      id: BANNERVERSE_COLLECTION_ID,
      symbol: BANNERVERSE_COLLECTION_SYMBOL,
    },
    symbol: "BNNRLGHT2",
    title: "RMRK2 Light",
    description:
      "February '22 RMRK Banner. Finally, it's here! Brightly commemorating the launch of RMRK2 on Singular. But what's that in the back?",
    properties: [],
    royalties: [
      {
        reciever: MINTER_ADDRESS,
        royaltyPercentFloat: "5",
      },
    ],
    resources: [
      {
        description:
          "February '22 RMRK Banner. Finally, it's here! Brightly commemorating the launch of RMRK2 on Singular. But what's that in the back?",
        src: "banners_02_22/2022 Feb_Banner 05 - On singular light.png",
        thumb: "banners_02_22/2022 Feb_Banner 05 - On singular light.png",
      },
    ],
    recipients: {
      [MINTER_ADDRESS]: "228",
      DhvJ4ZEKr75kBtr3VSwem84jbZCfmjUCZ771sf33Z5mX8Ta: "1",
      H2SwfhnSStX91iGZGye9L3wetRKahk1BZMCuSk7aXU66aFQ: "1",
      CpjsLDC1JFyrhm3ftC9Gs4QoyrkHKhZKtK7YqGTRFtTafgp: "1",
      DJiT2VbsbvA6EMiUjtoXLuBXNCscexS3GUx3fxR1JwK8KMr: "1",
      EDQwsrUJQbBRxc5K5p1xKb55jhsr18fngdHghQQeTxEZLoM: "1",
      EB1oqZ5MEnEwxhJ5DySCH3pyY55a2CUDfAbYKmLz2QcqWgx: "1",
      EuJAYheXvPywhDqB9YYG9RYbp2iENUqT261FPRhhTioPxSu: "1",
      ErU55Vp3AGFGEbrL5Tj1Kv47xYBDU1McBA1ALPewgVjRZDn: "1",
      CmkHUWRBZWp8vh3t9ZMyddx3DHjqfv2jErXrECtcizxoGc2: "1",
      GhQgLK4MAj564SUQgbV5EeQRva8L9AUEkqT28mZsmCS1egv: "1",
      HpbFHQjLCCuBpBwS2wJe8pB4ZrgVxD6w2SGEE1ckzT3Uxs4: "1",
      GbqtkjvQKWsgovW69Ga4WBnJxH3fSv3XkP7yLWC33j4yaQB: "1",
      G2e4YrQ8CQ4yw7iy5yu9yB5vHxJjfS3q4T46ojazqsYkKjV: "1",
      HZXYG4jYFXwqwBrhnbjMUSXH49zV2CW8T1pEuHeQTfBNfq5: "1",
      HnnwFDsJiyThghLCmkbbQ2mtVrwzxjF5pWFUJbzWngDTvzj: "1",
      Fr6ovaQd8ysmjXEF76gQVCErsU8UYzXjYVKV2cTw9myK7A3: "1",
      HydwuGTL6vbThMEyZq5ygYqMeHvmSpTLRsZdLx313rcPv6M: "1",
      FRqF9tyZmKdSGoULHZC16GTf9RVNDvjhquq8tNwuDRjAaic: "1",
      G28YgXSEHW4EE7uR9N7vi7ULF2NEEtgsMCJLARD5Yj5a1Y7: "1",
      F2toN3eA5EWiWhggt14wDrmAiercTJvF8ye1tqHorQPyEM6: "1",
      EZv3htNfDpYt6m42xBaEbLr2Y2ZcPjHvY9y6tvZEcWBmefJ: "1",
      Fys7d6gikP6rLDF9dvhCJcAMaPrrLuHbGZRVgqLPn26fWmr: "1",
    },
  },
};

const CHUNK_SIZE = 70;

export const mintInChunksDemo = async () => {
  try {
    console.log("CREATE batched NFTs START -------");
    const mintedIds = [];
    await cryptoWaitReady();

    const ws = WS_URL;

    const chunksMintDemoMint: Record<string, BatchMintingObject> = mintObject;
    const chunksMintDemoMintArray = Object.values(chunksMintDemoMint);

    const accounts = getKeys();
    const kp = getKeyringFromUri(process.env.PRIVATE_KEY as string);

    for (const chunksMintDemoMintItem of chunksMintDemoMintArray) {
      const collectionId = Collection.generateId(
        u8aToHex(accounts[0].publicKey),
        chunksMintDemoMintItem.collection.symbol
      );
      const owner = encodeAddress(accounts[0].address, 2);
      const recipients = Object.keys(chunksMintDemoMintItem.recipients)
        .map((recipient) => {
          return Array(parseInt(chunksMintDemoMintItem.recipients[recipient])).fill(
            recipient
          );
        })
        .flat();

      const thumbFile = await fsPromises.readFile(
        `${process.cwd()}/data/${chunksMintDemoMintItem.resources[0].thumb}`
      );
      const thumbStream: StreamPinata = Readable.from(thumbFile);
      thumbStream.path = chunksMintDemoMintItem.resources[0].thumb;
      const thumbCid = await pinFileStreamToIpfs(
        thumbStream,
        chunksMintDemoMintItem.title
      );

      const properties: IProperties = {};

      const typeProperty = chunksMintDemoMintItem.properties.find((property) =>
        Boolean(property.type)
      );
      if (typeProperty) {
        properties.type = {
          value: typeProperty.type,
          type: "string",
        };
      }

      const contextProperty = chunksMintDemoMintItem.properties.find((property) =>
        Boolean(property.context)
      );
      if (contextProperty) {
        properties.context = {
          value: contextProperty.context,
          type: "string",
        };
      }

      const metadataCid = await uploadAndPinIpfsMetadata({
        image: `ipfs://ipfs/${thumbCid}`,
        thumbnailUri: `ipfs://ipfs/${thumbCid}`,
        description: chunksMintDemoMintItem.description,
        name: chunksMintDemoMintItem.title,
        properties,
      });

      let recipientsChunked = chunkArray(recipients, CHUNK_SIZE);
      let chunkIndex = 0;

      for (const recipientChunk of recipientsChunked) {
        await sleep(90000);
        const remarks = [];

        recipientChunk.forEach((recipient, index) => {
          const sn = `${chunkIndex * CHUNK_SIZE + index + 1}`.padStart(8, "0");

          const isOdd = index % 2;
          const multipleRoyaltyRecipients =
            chunksMintDemoMintItem.royalties.length > 1;
          const royalties = multipleRoyaltyRecipients
            ? isOdd
              ? chunksMintDemoMintItem.royalties[1]
              : chunksMintDemoMintItem.royalties[0]
            : chunksMintDemoMintItem.royalties[0];

          const nft = new NFT({
            block: 0,
            collection: collectionId,
            symbol: chunksMintDemoMintItem.symbol,
            transferable: 1,
            sn,
            owner,
            metadata: metadataCid,
            properties: {
              royaltyInfo: {
                type: "royalty",
                value: {
                  royaltyPercentFloat: parseFloat(
                    royalties.royaltyPercentFloat
                  ),
                  receiver: royalties.reciever,
                },
              },
            },
          });

          remarks.push(nft.mint());
        });

        const api = await getApi(ws);
        const txs = remarks.map((remark) => api.tx.system.remark(remark));

        const tx = api.tx.utility.batch(txs);
        const { block } = await sendAndFinalize(tx, kp);
        console.log("Chunks mint demo NFTs minted at block: ", block);

        const resourcesPinned: TomoMintingResource[] = [];
        for (const resource of chunksMintDemoMintItem.resources) {
          const thumbFile = await fsPromises.readFile(
            `${process.cwd()}/data/${resource.thumb}`
          );
          const thumbStream: StreamPinata = Readable.from(thumbFile);
          thumbStream.path = resource.thumb;
          const thumbCid = await pinFileStreamToIpfs(
            thumbStream,
            chunksMintDemoMintItem.title
          );

          const mediaFile = await fsPromises.readFile(
            `${process.cwd()}/data/${resource.src}`
          );
          const mediaStream: StreamPinata = Readable.from(mediaFile);
          mediaStream.path = resource.src;
          const mediaCid = await pinFileStreamToIpfs(
            mediaStream,
            chunksMintDemoMintItem.title
          );

          resourcesPinned.push({
            ...resource,
            src: `ipfs://ipfs/${mediaCid}`,
            thumb: `ipfs://ipfs/${thumbCid}`,
          });
        }

        const resaddAndSendRemarks = [];
        recipientChunk.forEach((recipient, index) => {
          const sn = `${chunkIndex * CHUNK_SIZE + index + 1}`.padStart(8, "0");
          const nft = new NFT({
            block,
            collection: collectionId,
            symbol: chunksMintDemoMintItem.symbol,
            transferable: 1,
            sn,
            owner,
            metadata: metadataCid,
          });

          mintedIds.push(nft.getId());

          resourcesPinned.forEach((resource) => {
            const res: Resource = {
              src: resource.src,
              thumb: resource.thumb,
              id: `${chunksMintDemoMintItem.symbol}_${nanoid(8)}`,
              metadata: metadataCid,
            };

            if (resource.slot) {
              res.slot = `${BASE_ID}.${resource.slot}`;
            }
            resaddAndSendRemarks.push(nft.resadd(res));
          });

          if (owner !== recipient) {
            resaddAndSendRemarks.push(nft.send(recipient));
          }
        });

        const resaddtxs = resaddAndSendRemarks.map((remark) =>
          api.tx.system.remark(remark)
        );
        let rmrksChunked = chunkArray(resaddtxs, 100);

        console.log(resaddAndSendRemarks);

        for (const rmrkChunk of rmrksChunked) {
          console.log(`Chunk size: ${rmrkChunk.length}`);
          const tx = api.tx.utility.batch(rmrkChunk);
          console.log("tx create");
          const { block } = await sendAndFinalize(tx, kp);
          console.log("Chunks mint demo resource added: ", block);
        }

        chunkIndex = chunkIndex + 1;
      }
    }

    console.log("ALL MINTED");
    fs.writeFileSync(
      `${process.cwd()}/data/minted-item-ids.json`,
      JSON.stringify(mintedIds)
    );

    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

mintInChunksDemo();

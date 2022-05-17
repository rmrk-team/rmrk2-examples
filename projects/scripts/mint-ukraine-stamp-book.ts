require("dotenv").config();
import { Base, Collection, NFT } from "rmrk-tools";
import {
  chunkArray,
  getKeyringFromUri,
  sleep,
} from "./utils";
import { u8aToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import getKeys from "./devaccs";
import { uploadAndPinIpfsMetadata } from "./pinata-utils";
import { WS_URL } from "./constants";
import { IBasePart } from "rmrk-tools/dist/classes/base";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { nanoid } from "nanoid";
import { Resource } from "rmrk-tools/dist/classes/nft";
import { signAndSendWithRetry } from './sign-and-send-with-retry';
import { getApi } from './get-polkadot-api';

const STAMPS_FOR_UKRAINE_ASSETS_CID =
  "QmW8kMq1rQEj7ayiPU3ii1fVhR2gN5MFTohVxwLENTCMv6";

const SYMBOL = "STAMPFRUKRN";
const SYMBOL_BOOK = "STMPBK";
const SYMBOL_STAMP = "STMP";

const slotParts = {
  "Slot 1": 100,
  "Slot 2": 100,
  "Slot 3": 100,
  "Slot 4": 100,
  "Slot 5": 100,
  "Slot 6": 100,
  "Slot 7": 100,
  "Slot 8": 100,
  "Slot 9": 100,
  "Slot 10": 100,
  "Slot 11 deluxe": 50,
  "Slot 12 deluxe": 25,
};

const stampMetadata = {
  "Slot 1": {
    name: "St. Andrews Church, Kyiv",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_1_preview_b_n.png", "Stamp_1_preview_b_y.png"],
  },
  "Slot 2": {
    name: "Monument of the Founders of KYIV",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_2_preview_b_n.png", "Stamp_2_preview_b_y.png"],
  },
  "Slot 3": {
    name: "Sofiyivka park, Uman",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_3_preview_b_n.png", "Stamp_3_preview_b_y.png"],
  },
  "Slot 4": {
    name: "Swallow's Nest, Gaspra",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_4_preview_b_n.png", "Stamp_4_preview_b_y.png"],
  },
  "Slot 5": {
    name: "Kamianets podilskyi castle",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_5_preview_b_n.png", "Stamp_5_preview_b_y.png"],
  },
  "Slot 6": {
    name: "Catherine's Church, Chernihiv",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_6_preview_b_n.png", "Stamp_6_preview_b_y.png"],
  },
  "Slot 7": {
    name: "Independence Square, Kyiv",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_7_preview_b_n.png", "Stamp_7_preview_b_y.png"],
  },
  "Slot 8": {
    name: "Lviv National Academic Opera",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_8_preview_b_n.png", "Stamp_8_preview_b_y.png"],
  },
  "Slot 9": {
    name: "Museum of Zaporizhian Cossacks",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_9_preview_b_n.png", "Stamp_9_preview_b_y.png"],
  },
  "Slot 10": {
    name: "Odessa National Academic Theater of Opera and Ballet",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_10_preview_y_b.png", "Stamp_10_preview_y_n.png"],
  },
  "Slot 11 deluxe": {
    name: "Ukraine!",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_11_preview.png"],
  },
  "Slot 12 deluxe": {
    name: "Ukraine!",
    description:
      "To support the Ukrainian people in these and future days.\n" +
      "Thank you",
    thumbs: ["Stamp_12_preview.png"],
  },
};

export const createBase = async () => {
  try {
    await cryptoWaitReady();

    const ws = WS_URL;
    const phrase = process.env.STAND_WITH_UKRAINE_SEED;

    const kp = getKeyringFromUri(phrase);
    const accounts = getKeys(phrase);
    const issuer = encodeAddress(accounts[0].address, 2);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SYMBOL
    );
    const collectionMetadataCid = await uploadAndPinIpfsMetadata({
      mediaUri: `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/PFP.png`,
      description:
        "Postage Stamp for Ukraine is a collection with the purpose of fundraising for the people of Ukraine who suffered from the war.\n" +
        "\n" +
        "The collection uses the RMRK2.0 standard, and consists of a book on which stamps can be collected. Each stamp is from a symbolic place of Ukraine and are limited edition. Other stamps can always be created for the purpose of the Ukrainian people.\n" +
        "\n" +
        "We must not stand still in front of the events of these days, supporting the Ukrainian people is a moral duty, even a small gesture is important. All the funds raised will be sent directly to Ukrainian associations which will use them to support the population.\n" +
        "\n" +
        "Support Ukraine too\n" +
        "Thank you",
      name: "Stamp For Ukraine",
    });

    const baseMetadataCid = await uploadAndPinIpfsMetadata({
      mediaUri: `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/PFP.png`,
      name: "Stamp For Ukraine",
    });

    const Cl = new Collection(
      0,
      0,
      issuer,
      SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const remarks = [Cl.create()];
    const baseParts: IBasePart[] = [
      {
        type: "fixed",
        id: "Book",
        src: `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/Book_empty.svg`,
        z: 0,
      },
      {
        type: "slot",
        id: "Stamp 1",
        equippable: [collectionId],
        z: 1,
      },
      {
        type: "slot",
        id: "Stamp 2",
        equippable: [collectionId],
        z: 2,
      },
      {
        type: "slot",
        id: "Stamp 3",
        equippable: [collectionId],
        z: 3,
      },
      {
        type: "slot",
        id: "Stamp 4",
        equippable: [collectionId],
        z: 4,
      },
      {
        type: "slot",
        id: "Stamp 5",
        equippable: [collectionId],
        z: 5,
      },
      {
        type: "slot",
        id: "Stamp 6",
        equippable: [collectionId],
        z: 6,
      },
    ];

    const base = new Base(
      0,
      SYMBOL,
      issuer,
      "svg",
      baseParts,
      undefined,
      baseMetadataCid
    );

    remarks.push(base.base());
    const api = await getApi();

    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const tx = api.tx.utility.batch(txs);
    const { block } = await signAndSendWithRetry(tx, kp);

    console.log("done at block:", block);

    return block;
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

const CHUNK_SIZE = 70;

export const mintBooks = async () => {
  try {
    const baseBlock = await createBase();
    await cryptoWaitReady();

    const ws = WS_URL;
    const phrase = process.env.STAND_WITH_UKRAINE_SEED;

    const kp = getKeyringFromUri(phrase);
    const accounts = getKeys(phrase);
    const issuer = encodeAddress(accounts[0].address, 2);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SYMBOL
    );
    const base = new Base(baseBlock, SYMBOL, issuer, "png", []);

    const metadataCid = await uploadAndPinIpfsMetadata({
      mediaUri: `ipfs://ipfs/QmQCTD9h9ejWtnPyR6tDNwJzhLHDFq8FtABM7NceBA5tpo`,
      description:
        "Create your stamp collection!\n" +
        "\n" +
        "To support the Ukrainian people in these and future days.\n" +
        "Thank you",
      name: "Collector's book",
    });

    const total = 200;

    const arrayForTheSakeOfIt = Array(total).fill(issuer);

    let recipientsChunked = chunkArray(arrayForTheSakeOfIt, CHUNK_SIZE);
    let chunkIndex = 0;

    for (const recipientChunk of recipientsChunked) {
      await sleep(1500);
      const remarks = [];

      recipientChunk.forEach((recipient, index) => {
        const sn = `${chunkIndex * CHUNK_SIZE + index + 1}`.padStart(8, "0");

        const nft = new NFT({
          block: 0,
          collection: collectionId,
          symbol: SYMBOL_BOOK,
          transferable: 1,
          sn,
          owner: issuer,
          metadata: metadataCid,
        });

        remarks.push(nft.mint());
      });

      const api = await getApi();
      const txs = remarks.map((remark) => api.tx.system.remark(remark));

      const tx = api.tx.utility.batch(txs);
      const { block } = await signAndSendWithRetry(tx, kp);

      const resaddAndSendRemarks = [];
      recipientChunk.forEach((recipient, index) => {
        const sn = `${chunkIndex * CHUNK_SIZE + index + 1}`.padStart(8, "0");
        const nft = new NFT({
          block,
          collection: collectionId,
          symbol: SYMBOL_BOOK,
          transferable: 1,
          sn,
          owner: issuer,
          metadata: metadataCid,
        });

        const res: Resource = {
          thumb: `ipfs://ipfs/QmQCTD9h9ejWtnPyR6tDNwJzhLHDFq8FtABM7NceBA5tpo`,
          base: base.getId(),
          parts: [
            "Book",
            "Stamp 1",
            "Stamp 2",
            "Stamp 3",
            "Stamp 4",
            "Stamp 5",
            "Stamp 6",
          ],
          id: `${SYMBOL}_${nanoid(8)}`,
          metadata: metadataCid,
        };

        resaddAndSendRemarks.push(nft.resadd(res));
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
        const { block } = await signAndSendWithRetry(tx, kp);
        console.log("Book base resource added: ", block);
      }

      chunkIndex = chunkIndex + 1;
    }

    console.log("ALL MINTED");
    return baseBlock;
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

export const mintStamps = async () => {
  try {
    const baseBlock = await mintBooks();
    await cryptoWaitReady();

    const ws = WS_URL;
    const phrase = process.env.STAND_WITH_UKRAINE_SEED;

    const kp = getKeyringFromUri(phrase);
    const accounts = getKeys(phrase);
    const issuer = encodeAddress(accounts[0].address, 2);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      SYMBOL
    );
    const base = new Base(baseBlock, SYMBOL, issuer, "png", []);

    for (const slotPartId of Object.keys(slotParts)) {
      await sleep(1500);
      const stampIndex = Object.keys(slotParts).indexOf(slotPartId);
      const total = slotParts[slotPartId];
      const metadata = stampMetadata[slotPartId];

      const metadataCidEven = await uploadAndPinIpfsMetadata({
        mediaUri: `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/${metadata.thumbs[0]}`,
        description: metadata.description,
        name: metadata.name,
      });

      const metadataCidOdd = await uploadAndPinIpfsMetadata({
        mediaUri: `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/${metadata.thumbs[1]}`,
        description: metadata.description,
        name: metadata.name,
      });

      const arrayForTheSakeOfIt = Array(total).fill(issuer);

      let recipientsChunked = chunkArray(arrayForTheSakeOfIt, CHUNK_SIZE);
      let chunkIndex = 0;

      for (const recipientChunk of recipientsChunked) {
        await sleep(1500);
        const remarks = [];

        recipientChunk.forEach((recipient, index) => {
          const sn = `${chunkIndex * CHUNK_SIZE + index + 1}`.padStart(8, "0");
          const isOdd = index % 2;
          const nft = new NFT({
            block: 0,
            collection: collectionId,
            symbol: SYMBOL_STAMP,
            transferable: 1,
            sn,
            owner: issuer,
            metadata: isOdd ? metadataCidOdd : metadataCidEven,
          });

          remarks.push(nft.mint());
        });

        const api = await getApi();
        const txs = remarks.map((remark) => api.tx.system.remark(remark));

        const tx = api.tx.utility.batch(txs);
        const { block } = await signAndSendWithRetry(tx, kp);

        const resaddAndSendRemarks = [];
        recipientChunk.forEach((recipient, index) => {
          const sn = `${chunkIndex * CHUNK_SIZE + index + 1}`.padStart(8, "0");
          const isOdd = index % 2;
          const nft = new NFT({
            block,
            collection: collectionId,
            symbol: SYMBOL_STAMP,
            transferable: 1,
            sn,
            owner: issuer,
            metadata: isOdd ? metadataCidOdd : metadataCidEven,
          });

          for (let i = 0; i < 6; i++) {
            const res: Resource = {
              thumb: isOdd
                ? `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/${metadata.thumbs[0]}`
                : `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/${metadata.thumbs[1]}`,
              src: `ipfs://ipfs/${STAMPS_FOR_UKRAINE_ASSETS_CID}/Stamp_${
                stampIndex + 1
              }_slot_position_${i + 1}.svg`,
              id: `${SYMBOL_STAMP}_${nanoid(8)}`,
              metadata: isOdd ? metadataCidOdd : metadataCidEven,
              slot: `${base.getId()}.Stamp ${i + 1}`,
            };

            resaddAndSendRemarks.push(nft.resadd(res));
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
          const { block } = await signAndSendWithRetry(tx, kp);
          console.log("Stamp base resource added: ", block);
        }

        chunkIndex = chunkIndex + 1;
      }
    }

    console.log("ALL MINTED");
    process.exit(0);
  } catch (error: any) {
    console.error(error);
    process.exit(1);
  }
};

mintStamps();

// createBase();

import {
  ASSETS_CID,
  CHUNKY_COLLECTION_SYMBOL,
  CHUNKY_ITEMS_COLLECTION_SYMBOL,
  WS_URL,
  CHUNKY_BASE_SYMBOL
} from "./constants";
import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import { Collection, NFT, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";
import { encodeAddress } from "@polkadot/keyring";
import { nanoid } from "nanoid";
import {pinSingleMetadataFromDir} from "./pinata-utils";

const chunkyItems = [
  {
    symbol: "chunky_bone",
    thumb: "Chunky_bone_thumb.png",
    resources: ["Chunky_bone_left.svg", "Chunky_bone_right.svg"],
    name: "The Bone",
    description: "Chunky likes his bone!",
  },
  {
    symbol: "chunky_flag",
    thumb: "Chunky_flag_thumb.png",
    resources: ["Chunky_flag_left.svg", "Chunky_flag_right.svg"],
    name: "The Flag",
    description: "Chunky likes his flag!",
  },
  {
    symbol: "chunky_pencil",
    thumb: "Chunky_pencil_thumb.png",
    resources: ["Chunky_pencil_left.svg", "Chunky_pencil_right.svg"],
    name: "The Pencil",
    description: "Chunky likes his pencil!",
  },
  {
    symbol: "chunky_spear",
    thumb: "Chunky_spear_thumb.png",
    resources: ["Chunky_spear_left.svg", "Chunky_spear_right.svg"],
    name: "The Spear",
    description: "Chunky likes his spear!",
  },
];

export const mintItems = async (chunkyBlock: number, baseBlock: number) => {
  try {
    console.log("CREATE CHUNKY ITEMS START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_ITEMS_COLLECTION_SYMBOL
    );

    const chunkyCollectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_COLLECTION_SYMBOL
    );

    const baseEntity = new Base(
      baseBlock,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg"
    );

    await createItemsCollection();

    const promises = chunkyItems.map(async (item, index) => {
      const sn = index + 1;

      const metadataCid = await pinSingleMetadataFromDir(
        "/assets/chunky/Chunky Items",
        item.thumb,
        item.name,
        {
          description: item.description,
          external_url: "https://rmrk.app",
        }
      );

      const nft = new NFT({
        block: 0,
        sn: sn.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: metadataCid,
        collection: collectionId,
        symbol: item.symbol,
      });

      return nft.mint();
    });

    const remarks = await Promise.all(promises);

    const txs = remarks.map((remark) => api.tx.system.remark(remark));
    const batch = api.tx.utility.batch(txs);
    const { block } = await sendAndFinalize(batch, kp);
    console.log("CHUNKY ITEMS MINTED AT BLOCK: ", block);

    const resaddSendRemarks = [];

    chunkyItems.forEach((item, index) => {
      const sn = index + 1;
      const nft = new NFT({
        block,
        sn: sn.toString().padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        transferable: 1,
        metadata: `ipfs://ipfs/trololo`,
        collection: collectionId,
        symbol: item.symbol,
      });

      item.resources.forEach((resource) => {
        resaddSendRemarks.push(
          nft.resadd({
            src: `ipfs://ipfs/${ASSETS_CID}/Chunky Items/${resource}`,
            thumb: `ipfs://ipfs/${ASSETS_CID}/Chunky Items/${item.thumb}`,
            id: nanoid(8),
            slot: resource.includes("left")
              ? `${baseEntity.getId()}.chunky_objectLeft`
              : `${baseEntity.getId()}.chunky_objectRight`,
          })
        );
      });

      const chunkyNft = new NFT({
        block: chunkyBlock,
        collection: chunkyCollectionId,
        symbol: `chunky_${sn}`,
        transferable: 1,
        sn: `${sn}`.padStart(8, "0"),
        owner: encodeAddress(accounts[0].address, 2),
        metadata: "",
      });

      resaddSendRemarks.push(nft.send(chunkyNft.getId()));
      resaddSendRemarks.push(
        nft.equip(
          `${baseEntity.getId()}.${
            index % 2 ? "chunky_objectLeft" : "chunky_objectRight"
          }`
        )
      );
    });

    const restxs = resaddSendRemarks.map((remark) =>
      api.tx.system.remark(remark)
    );
    const resbatch = api.tx.utility.batch(restxs);
    const { block: resaddSendBlock } = await sendAndFinalize(resbatch, kp);
    console.log("CHUNKY ITEMS RESOURCE ADDED AND SENT: ", resaddSendBlock);
    return true;
  } catch (error: any) {
    console.error(error);
  }
};

export const createItemsCollection = async () => {
  try {
    console.log("CREATE CHUNKY ITEMS COLLECTION START -------");
    await cryptoWaitReady();
    const accounts = getKeys();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const api = await getApi(ws);
    const kp = getKeyringFromUri(phrase);

    const collectionId = Collection.generateId(
      u8aToHex(accounts[0].publicKey),
      CHUNKY_ITEMS_COLLECTION_SYMBOL
    );

    const collectionMetadataCid = await pinSingleMetadataFromDir(
      "/assets/chunky",
      "Chunky Preview.png",
      "RMRK2 demo chunky items collection",
      {
        description: "This is Chunky items! RMRK2 demo nested NFTs",
        external_url: "https://rmrk.app",
        properties: {},
      }
    );

    const ItemsCollection = new Collection(
      0,
      0,
      encodeAddress(accounts[0].address, 2),
      CHUNKY_ITEMS_COLLECTION_SYMBOL,
      collectionId,
      collectionMetadataCid
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(ItemsCollection.create()),
      kp
    );
    console.log("Chunky items collection created at block: ", block);

    return block;
  } catch (error: any) {
    console.error(error);
  }
};

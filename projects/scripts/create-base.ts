import { IBasePart } from "rmrk-tools/dist/classes/base";
import {
  ASSETS_CID,
  CHUNKY_BASE_SYMBOL,
  CHUNKY_ITEMS_COLLECTION_SYMBOL,
  WS_URL,
} from "./constants";
import { cryptoWaitReady, encodeAddress } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, getKeys, sendAndFinalize } from "./utils";
import { Collection, Base } from "rmrk-tools";
import { u8aToHex } from "@polkadot/util";

export const fixedParts: IBasePart[] = [
  {
    type: "fixed",
    id: "chunky_body_1",
    src: `ipfs://ipfs/${ASSETS_CID}/v1/Chunky_body_v1.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_body_2",
    src: `ipfs://ipfs/${ASSETS_CID}/v2/Chunky_body_v2.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_body_3",
    src: `ipfs://ipfs/${ASSETS_CID}/v3/Chunky_body_v3.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_body_4",
    src: `ipfs://ipfs/${ASSETS_CID}/v4/Chunky_body_v4.svg`,
    z: 0,
  },
  {
    type: "fixed",
    id: "chunky_head_1",
    src: `ipfs://ipfs/${ASSETS_CID}/v1/Chunky_head_v1.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_head_2",
    src: `ipfs://ipfs/${ASSETS_CID}/v2/Chunky_head_v2.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_head_3",
    src: `ipfs://ipfs/${ASSETS_CID}/v3/Chunky_head_v3.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_head_4",
    src: `ipfs://ipfs/${ASSETS_CID}/v4/Chunky_head_v4.svg`,
    z: 4,
  },
  {
    type: "fixed",
    id: "chunky_hand_1",
    src: `ipfs://ipfs/${ASSETS_CID}/v1/Chunky_hand_v1.svg`,
    z: 3,
  },
  {
    type: "fixed",
    id: "chunky_hand_2",
    src: `ipfs://ipfs/${ASSETS_CID}/v2/Chunky_hand_v2.svg`,
    z: 3,
  },
  {
    type: "fixed",
    id: "chunky_hand_3",
    src: `ipfs://ipfs/${ASSETS_CID}/v3/Chunky_hand_v3.svg`,
    z: 3,
  },
  {
    type: "fixed",
    id: "chunky_hand_4",
    src: `ipfs://ipfs/${ASSETS_CID}/v4/Chunky_hand_v4.svg`,
    z: 3,
  },
];

const getSlotKanariaParts = (equippable: string[] | "*" = []): IBasePart[] => {
  return [
    {
      type: "slot",
      id: "chunky_objectLeft",
      equippable,
      z: 1,
    },
    {
      type: "slot",
      id: "chunky_objectRight",
      equippable,
      z: 2,
    },
  ];
};

export const createBase = async () => {
  try {
    console.log("CREATE CHUNKY BASE START -------");
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
    console.log("collectionId", collectionId);

    const baseParts = [...fixedParts, ...getSlotKanariaParts([collectionId])];

    const baseEntity = new Base(
      0,
      CHUNKY_BASE_SYMBOL,
      encodeAddress(kp.address, 2),
      "svg",
      baseParts
    );

    const { block } = await sendAndFinalize(
      api.tx.system.remark(baseEntity.base()),
      kp
    );
    console.log("Chunky Base created at block: ", block);
    return block;
    return block;
  } catch (error: any) {
    console.error(error);
  }
};

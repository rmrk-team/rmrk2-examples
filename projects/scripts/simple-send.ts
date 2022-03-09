import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getApi, getKeyringFromUri, sendAndFinalize } from "./utils";
import { WS_URL } from "./constants";

export const simpleSend = async () => {
  try {
    console.log("SIMPLE SEND NFT START -------");

    const nftId = process.argv[2];
    if (!nftId) {
      throw new Error("NFT ID NOT PASSED");
    }

    const recipient = process.argv[3];
    if (!recipient) {
      throw new Error("RECIPIENT NOT PASSED");
    }
    await cryptoWaitReady();
    const ws = WS_URL;
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);

    const api = await getApi(ws);

    const remark = api.tx.system.remark(
      `RMRK::SEND::2.0.0::${nftId}::${recipient}`
    );

    const tx = api.tx.utility.batchAll([remark]);
    const { block } = await sendAndFinalize(tx, kp);
    console.log(`Sent NFT ${nftId} at block: `, block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};

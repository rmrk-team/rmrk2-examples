import { cryptoWaitReady } from "@polkadot/util-crypto";
import { getKeyringFromUri } from "./utils";
import { getApi } from "./get-polkadot-api";
import { signAndSendWithRetry } from "./sign-and-send-with-retry";

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
    const phrase = process.env.PRIVAKE_KEY;
    const kp = getKeyringFromUri(phrase);

    const api = await getApi();

    const remark = api.tx.system.remark(
      `RMRK::SEND::2.0.0::${nftId}::${recipient}`
    );

    const tx = api.tx.utility.batchAll([remark]);
    const { block } = await signAndSendWithRetry(tx, kp);
    console.log(`Sent NFT ${nftId} at block: `, block);
    return block;
  } catch (error: any) {
    console.error(error);
  }
};

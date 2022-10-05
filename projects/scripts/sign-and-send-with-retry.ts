import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ISubmittableResult } from '@polkadot/types/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { getApi } from './get-polkadot-api';
import { sleep } from './utils';
import { CodecHash, EventRecord } from '@polkadot/types/interfaces';

const MAX_RETRIES = 5;
const RETRY_DELAY_SECONDS = 4;

interface ISendTxReturnType {
  success: boolean;
  hash?: CodecHash;
  included: EventRecord[];
  finalized: EventRecord[];
  block: number;
}

/**
 *
 * @param tx - polkadot.js api tx
 * @param account - Account keypair
 * @param resolvedOnFinalizedOnly - If you don't want to wait for promise to resolve only when the block is finalized,
 * it can resolve as soon as tx is added to a block. This doesn't guarantee that transaction block will be included in finalised chain.
 * true by default
 * @param retry - retry count in case of failure.
 */
export const signAndSendWithRetry = async (
    tx: SubmittableExtrinsic<'promise', ISubmittableResult>,
    account: KeyringPair,
    resolvedOnFinalizedOnly = true,
    retry = 0,
): Promise<ISendTxReturnType> => {
  return new Promise(async (resolve, reject) => {
    const api = await getApi();

    const returnObject: ISendTxReturnType = { success: false, hash: undefined, included: [], finalized: [], block: 0 }

    try {
      const unsubscribe = await tx.signAndSend(
          account,
          { nonce: -1 },
          async ({ events = [], status, dispatchError }) => {
            returnObject.success = !dispatchError;
            returnObject.included = [...events];
            returnObject.hash = status.hash;

            const rejectPromise = (error: any) => {
              console.error(`Error sending tx`, error);
              console.log(`tx for the error above`, tx.toHuman());
              unsubscribe();
              reject(error);
            }

            if (status.isInBlock) {
              console.log(
                  `📀 Transaction ${tx.meta.name} included at blockHash ${status.asInBlock} [success = ${!dispatchError}]`,
              );

              // Get block number that this tx got into, to return back to user
              const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
              returnObject.block = signedBlock.block.header.number.toNumber();

              // If we don't care about waiting for this tx to get into a finalized block, we can return early.
              if (!resolvedOnFinalizedOnly && !dispatchError) {
                unsubscribe();
                resolve(returnObject);
              }
            } else if (status.isBroadcast) {
              console.log(`🚀 Transaction broadcasted.`);
            } else if (status.isFinalized) {
              console.log(
                  `💯 Transaction ${tx.meta.name}(..) Finalized at blockHash ${status.asFinalized}`,
              );
              if (returnObject.block === 0) {
                const signedBlock = await api.rpc.chain.getBlock(status.asInBlock);
                returnObject.block = signedBlock.block.header.number.toNumber();
              }

              unsubscribe();
              resolve(returnObject);
            } else if (status.isReady) {
              // let's not be too noisy..
            } else if (status.isInvalid) {
              rejectPromise(new Error(`Extrinsic isInvalid`))
            } else {
              console.log(`🤷 Other status ${status}`);
            }
          },
      );
    } catch (error: any) {
      console.log(
          `Error sending tx. Error: "${error.message}". TX: ${JSON.stringify(tx.toHuman())}`,
      );
      if (retry < MAX_RETRIES) {
        console.log(`sendAndFinalize Retry #${retry} of ${MAX_RETRIES}`);
        await sleep(RETRY_DELAY_SECONDS * 1000);
        const result = await signAndSendWithRetry(tx, account, resolvedOnFinalizedOnly, retry + 1);
        resolve(result);
      } else {
        console.error(`Error initiating tx signAndSend`, error);
        reject(error);
      }
    }
  });
};

import SafeAppsSDK, { TransactionStatus } from "@safe-global/safe-apps-sdk";
import type { Hash } from "viem";

const sdk = new SafeAppsSDK();

const POLLING_INTERVAL = 5000;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const waitForSafeTransaction = async (
  safeTxHash: Hash
): Promise<Hash> => {
  const details = await sdk.txs
    .getBySafeTxHash(safeTxHash)
    .catch(() => undefined);

  if (details?.txHash) {
    return details.txHash as Hash;
  }

  if (details?.txStatus === TransactionStatus.CANCELLED) {
    throw new Error("Safe transaction was cancelled");
  }

  await wait(POLLING_INTERVAL);
  return waitForSafeTransaction(safeTxHash);
};

require('dotenv').config();
import { Keyring } from "@polkadot/keyring";
import { KeyringPair } from "@polkadot/keyring/types";

export default (seed?: string): KeyringPair[] => {
  const k = [];
  const keyring = new Keyring({ type: "sr25519" });
  k.push(keyring.addFromUri(seed || process.env.MNEMONIC_PHRASE));
  return k;
};

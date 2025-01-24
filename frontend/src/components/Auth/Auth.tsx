import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";
import { storeEphemeralKeyPair } from "./storeEmpheralKeyPair";

export default function useEphemeralKeyPair() {
  const ephemeralKeyPair = EphemeralKeyPair.generate();
  storeEphemeralKeyPair(ephemeralKeyPair);

  return ephemeralKeyPair;
}

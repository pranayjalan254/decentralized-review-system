import { EphemeralKeyPair } from "@aptos-labs/ts-sdk";
/**
 * Store the ephemeral key pair in localStorage.
 */
export declare const storeEphemeralKeyPair: (ekp: EphemeralKeyPair) => void;
/**
 * Retrieve the ephemeral key pair from localStorage if it exists.
 */
export declare const getLocalEphemeralKeyPair: () => EphemeralKeyPair | undefined;
/**
 * Stringify the ephemeral key pairs to be stored in localStorage
 */
export declare const encodeEphemeralKeyPair: (ekp: EphemeralKeyPair) => string;
/**
 * Parse the ephemeral key pairs from a string
 */
export declare const decodeEphemeralKeyPair: (encodedEkp: string) => EphemeralKeyPair;

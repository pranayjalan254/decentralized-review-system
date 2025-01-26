import { KeylessAccount } from "@aptos-labs/ts-sdk";
export declare const storeKeylessAccount: (account: KeylessAccount) => void;
export declare const encodeKeylessAccount: (account: KeylessAccount) => string;
export declare const getLocalKeylessAccount: () => KeylessAccount | undefined;
export declare const decodeKeylessAccount: (encodedAccount: string) => KeylessAccount;

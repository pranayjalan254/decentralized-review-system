export interface JWTPayload {
    nonce: string;
    email: string;
    name: string;
    picture: string;
}
export declare const parseJWTFromURL: (url: string) => string | null;
export declare const initializeAptosKeyless: (jwt: string) => Promise<{
    keylessAccount: import("@aptos-labs/ts-sdk").KeylessAccount;
    userInfo: JWTPayload;
}>;

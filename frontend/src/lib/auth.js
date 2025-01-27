import { jwtDecode } from "jwt-decode";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { getLocalEphemeralKeyPair } from "../components/Auth/storeEmpheralKeyPair";
import { storeKeylessAccount } from "./keyless";
export const parseJWTFromURL = (url) => {
    const urlObject = new URL(url);
    const fragment = urlObject.hash.substring(1);
    const params = new URLSearchParams(fragment);
    return params.get("id_token");
};
export const initializeAptosKeyless = async (jwt) => {
    try {
        const payload = jwtDecode(jwt);
        const ekp = getLocalEphemeralKeyPair();
        if (!ekp || ekp.nonce !== payload.nonce || ekp.isExpired()) {
            throw new Error("Ephemeral key pair not found or expired");
        }
        const aptos = new Aptos(new AptosConfig({ network: Network.TESTNET }));
        const keylessAccount = await aptos.deriveKeylessAccount({
            jwt,
            ephemeralKeyPair: ekp,
        });
        // Store the keyless account
        storeKeylessAccount(keylessAccount);
        return { keylessAccount, userInfo: payload };
    }
    catch (error) {
        console.error("Aptos initialization error:", error);
        throw error;
    }
};

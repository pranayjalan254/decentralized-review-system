import { Account, Aptos, AptosConfig, Network, Ed25519PrivateKey, } from "@aptos-labs/ts-sdk";
const moduleaddress = "0x82e8de6554ba7ed96be0529a866bbb68f66404b465bda125a5cb6a4d10737c3e";
const modulecode = "fungible_asset";
const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: "https://fullnode.devnet.aptoslabs.com/v1",
});
export const burnTransaction = async (aptos, sender, from, amount) => {
    // Build transaction
    const transaction = await aptos.transaction.build.simple({
        sender: sender.accountAddress,
        data: {
            function: `${moduleaddress}::${modulecode}::burn`,
            functionArguments: [from, amount.toString()],
            typeArguments: [],
        },
    });
    console.log(transaction);
    const committedTxn = await aptos.signAndSubmitTransaction({
        signer: sender,
        transaction: transaction,
    });
    await aptos.waitForTransaction({ transactionHash: committedTxn.hash });
    console.log(`Committed transaction: ${committedTxn.hash}`);
};
export const burn = async (burnAddress, burnAmount) => {
    try {
        const aptos = new Aptos(config);
        const privateKey = new Ed25519PrivateKey(import.meta.env.VITE_PRIVATE_KEY_MINT);
        const sender = Account.fromPrivateKey({ privateKey });
        const txHash = await burnTransaction(aptos, sender, burnAddress, burnAmount);
        console.log("Transaction Hash:", txHash);
    }
    catch (error) {
        console.error("Minting failed:", error.message || error);
    }
};

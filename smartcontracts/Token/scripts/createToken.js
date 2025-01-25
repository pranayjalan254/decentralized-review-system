require("dotenv").config();
const fs = require("node:fs");
const yaml = require("js-yaml");
const { AptosClient, AptosAccount, HexString, Types } = require("@aptos-labs/ts-sdk");

const config = yaml.load(fs.readFileSync("./.aptos/config.yaml", "utf8"));
const accountAddress = config["profiles"][`${process.env.PROJECT_NAME}-${process.env.VITE_APP_NETWORK}`]["account"];

async function createToken({
    maxSupply,
    mintLimit,
    privateKey
}) {
    let name = "Review Token";
    let symbol = "RT";
    let decimals = 8;
    try {
        const client = new AptosClient(process.env.VITE_APP_NETWORK_URL);
        
        // Create account from private key
        const account = new AptosAccount(
            new HexString(privateKey).toUint8Array()
        );

        const payload = {
            type: "entry_function_payload",
            function: `${accountAddress}::create_token::create_new_token`,
            type_arguments: [],
            arguments: [
                maxSupply.toString(),
                Array.from(Buffer.from(name)),
                Array.from(Buffer.from(symbol)),
                decimals,
                Array.from(Buffer.from("icon_url")),
                Array.from(Buffer.from("project_url")),
                1,
                mintLimit
            ]
        };

        const txnRequest = await client.generateTransaction(account.address(), payload);
        const signedTxn = await client.signTransaction(account, txnRequest);
        const transactionRes = await client.submitTransaction(signedTxn);
        
        console.log("Transaction submitted. Hash:", transactionRes.hash);
        
        const result = await client.waitForTransaction(transactionRes.hash);
        console.log("Transaction completed:", result.success ? "SUCCESS" : "FAILED");
        
        return result;
    } catch (error) {
        console.error("Error creating token:", error);
        throw error;
    }
}

// Example usage
async function main() {
    const tokenParams = {
        maxSupply: 1000000, 
        mintLimit: 1000,
        privateKey: process.env.PRIVATE_KEY
    };

    try {
        await createToken(tokenParams);
    } catch (error) {
        console.error("Failed to create token:", error);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { createToken };

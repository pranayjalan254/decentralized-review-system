import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
const moduleaddress = "0x82e8de6554ba7ed96be0529a866bbb68f66404b465bda125a5cb6a4d10737c3e";
const modulecode = "fungible_asset";
const config = new AptosConfig({
    network: Network.DEVNET,
    fullnode: "https://fullnode.devnet.aptoslabs.com/v1",
});
const aptos = new Aptos(config);
export async function getBalance(address) {
    try {
        const response = await aptos.view({
            payload: {
                function: `${moduleaddress}::${modulecode}::get_balance`,
                typeArguments: [],
                functionArguments: [address],
            },
        });
        return Number(response[0]);
    }
    catch (error) {
        console.error("Error getting review count:", error);
        throw error;
    }
}

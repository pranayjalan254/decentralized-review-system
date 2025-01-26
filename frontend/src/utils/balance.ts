import {
  Aptos,
  AptosConfig,
  Network,
} from "@aptos-labs/ts-sdk";

const moduleaddress =
  "0x82e8de6554ba7ed96be0529a866bbb68f66404b465bda125a5cb6a4d10737c3e";
const modulecode = "fungible_asset";
const config = new AptosConfig({
  network: Network.DEVNET,
  fullnode: "https://fullnode.devnet.aptoslabs.com/v1",
});
const aptos = new Aptos(config);


export async function getBalance(address: string) {
  try {
    const response = await aptos.view({
      payload: {
        function:
          `${moduleaddress}::${modulecode}::get_balance`,
        typeArguments: [],
        functionArguments: [address],
      },
    });

    return Number(response[0]);
  } catch (error) {
    console.error("Error getting review count:", error);
    throw error;
  }
}

export const balance = async (Address: string) => {
  try {
    // Initialize Aptos client

    const txHash = await getBalance(Address);
console.log(txHash);

  } catch (error: any) {
    console.error("Minting failed:", error.message || error);
  }
};


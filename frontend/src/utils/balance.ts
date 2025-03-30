import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const moduleaddress =
  "0x3951e8b47f090bd24e04dde87b27cee5f45d021639fe5546feb9998022f9e4bb";
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
        function: `${moduleaddress}::${modulecode}::get_balance`,
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

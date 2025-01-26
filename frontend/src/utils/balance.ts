import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";

const config = new AptosConfig({
  network: Network.DEVNET,
  fullnode: "https://fullnode.devnet.aptoslabs.com/v1",
});

export const balance = async (address: string) => {
  const aptos = new Aptos(config);

  const coinType = "0x1::fungible_asset::FungibleStore";
  const [balanceStr] = await aptos.view<[string]>({
    payload: {
      function: "0x1::primary_fungible_store::balance",
      typeArguments: [coinType],
      functionArguments: [address],
    },
  });
  let balance = parseInt(balanceStr, 8);
  console.log(balance);
  return balance;
};

balance("0x82e8de6554ba7ed96be0529a866bbb68f66404b465bda125a5cb6a4d10737c3e");

import {
  Account,
  Aptos,
  AptosConfig,
  Network,
  Ed25519PrivateKey,
} from "@aptos-labs/ts-sdk";

const moduleaddress =
  "0x3951e8b47f090bd24e04dde87b27cee5f45d021639fe5546feb9998022f9e4bb";
const modulecode = "fungible_asset";
const config = new AptosConfig({
  network: Network.DEVNET,
  fullnode: "https://fullnode.devnet.aptoslabs.com/v1",
});

export const burnTransaction = async (
  aptos: Aptos,
  sender: Account,
  from: string,
  amount: number
) => {
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

export const burn = async (burnAddress: string, burnAmount: number) => {
  try {
    const aptos = new Aptos(config);

    const privateKey = new Ed25519PrivateKey(
      import.meta.env.VITE_PRIVATE_KEY_MINT as string
    );
    const sender = Account.fromPrivateKey({ privateKey });
    const txHash = await burnTransaction(
      aptos,
      sender,
      burnAddress,
      burnAmount
    );

    console.log("Transaction Hash:", txHash);
  } catch (error: any) {
    console.error("Minting failed:", error.message || error);
  }
};

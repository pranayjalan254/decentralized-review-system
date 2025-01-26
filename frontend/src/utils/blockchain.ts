import {
  Aptos,
  Network,
  AptosConfig,
  Ed25519PrivateKey,
  Account,
} from "@aptos-labs/ts-sdk";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const CONTRACT_ADDRESS =
  "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485";

const privateKey = new Ed25519PrivateKey(import.meta.env.VITE_PRIVATE_KEY);
const account = Account.fromPrivateKey({ privateKey });

export interface SubmitReviewParams {
  reviewerAddress: string;
  establishmentName: string;
  establishmentType: string;
  rating: number;
  comment: string;
}

export async function submitReview({
  reviewerAddress,
  establishmentName,
  establishmentType,
  rating,
  comment,
}: SubmitReviewParams) {
  try {
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function:
          "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485::review2::submit_review",
        functionArguments: [
          reviewerAddress,
          establishmentName,
          establishmentType,
          rating,
          comment,
        ],
      },
    });
    console.log("Review transaction built:", transaction);

    const response = aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    });
    console.log("Review submitted:", response);
    return response;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}

export async function getReviewCount(establishmentName: string) {
  try {
    const response = await aptos.view({
      payload: {
        function:
          "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485::review2::get_review_count",
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS, establishmentName],
      },
    });

    return Number(response[0]);
  } catch (error) {
    console.error("Error getting review count:", error);
    throw error;
  }
}

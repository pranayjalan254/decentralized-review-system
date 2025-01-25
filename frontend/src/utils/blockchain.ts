import { Aptos, Network, AptosConfig } from "@aptos-labs/ts-sdk";

// Initialize Aptos client
const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const CONTRACT_ADDRESS =
  "f42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485";

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
      sender: reviewerAddress,
      data: {
        function: `${CONTRACT_ADDRESS}::review2::submit_review`,
        functionArguments: [
          reviewerAddress,
          establishmentName,
          establishmentType,
          rating,
          comment,
        ],
      },
    });

    const response = await aptos.transaction.sign({
      // @ts-ignore
      signer: 0x48c883c8db8577c1a67a0d02686495d142d82120b05bc7aad17ccc0bf04319fa,
      transaction,
    });

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
        function: `${CONTRACT_ADDRESS}::review2::get_review_count`,
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

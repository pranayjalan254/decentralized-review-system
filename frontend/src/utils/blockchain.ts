import {
  Aptos,
  Network,
  AptosConfig,
  Ed25519PrivateKey,
  Account,
} from "@aptos-labs/ts-sdk";
import { main } from "./mint";

const config = new AptosConfig({ network: Network.TESTNET });
export const aptos = new Aptos(config);

export const CONTRACT_ADDRESS =
  "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485";

const privateKey = new Ed25519PrivateKey(import.meta.env.VITE_PRIVATE_KEY);
const account = Account.fromPrivateKey({ privateKey });

export interface SubmitReviewParams {
  reviewerAddress: string;
  establishmentName: string;
  rating: number;
  comment: string;
}

export async function submitReview({
  reviewerAddress,
  establishmentName,
  rating,
  comment,
}: SubmitReviewParams) {
  try {
    // Submit review transaction
    const transaction = await aptos.transaction.build.simple({
      sender: account.accountAddress,
      data: {
        function: `${CONTRACT_ADDRESS}::review4::submit_review`,
        functionArguments: [
          reviewerAddress,
          establishmentName,
          rating,
          comment,
        ],
      },
    });

    const response = await aptos.signAndSubmitTransaction({
      signer: account,
      transaction,
    });
    await aptos.waitForTransaction({ transactionHash: response.hash });
    console.log(reviewerAddress);
    // Mint tokens for the reviewer
    await main(reviewerAddress, 20);
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
          "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485::review4::get_review_count",
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

export async function getAverageRating(
  establishmentName: string
): Promise<number> {
  try {
    const result = await aptos.view({
      payload: {
        function:
          "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485::review4::get_average_rating",
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS, establishmentName],
      },
    });
    return Number(result[0]);
  } catch (error) {
    console.error("Error getting average rating:", error);
    return 0;
  }
}

export async function getAllReviews(establishmentName: string) {
  try {
    const result = await aptos.view({
      payload: {
        function: `${CONTRACT_ADDRESS}::review4::get_all_reviews`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS, establishmentName],
      },
    });
    if (!Array.isArray(result[0])) {
      return [];
    }

    return result[0].map((review: any) => ({
      id: `${review.reviewer}-${review.timestamp}-${review.establishment_name}`,
      reviewer: review.reviewer,
      establishmentName: review.establishment_name,
      rating: Number(review.rating),
      comment: review.comment,
      timestamp: Number(review.timestamp),
    }));
  } catch (error: any) {
    if (error.message?.includes("E_REVIEW_ALREADY_EXISTS")) {
      throw new Error("You have already reviewed this establishment");
    }
    console.error("Error getting reviews:", error);
    throw error;
  }
}

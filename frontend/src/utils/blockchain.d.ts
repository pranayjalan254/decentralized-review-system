import { Aptos } from "@aptos-labs/ts-sdk";
export declare const aptos: Aptos;
export declare const CONTRACT_ADDRESS = "0xf42b36821c33c1fe60d1cb08a7e386cff3b5d5332b24824e676648baa554e485";
export interface SubmitReviewParams {
    reviewerAddress: string;
    establishmentName: string;
    rating: number;
    comment: string;
}
export declare function submitReview({ reviewerAddress, establishmentName, rating, comment, }: SubmitReviewParams): Promise<import("@aptos-labs/ts-sdk").PendingTransactionResponse>;
export declare function getReviewCount(establishmentName: string): Promise<number>;
export declare function getAverageRating(establishmentName: string): Promise<number>;
export declare function getAllReviews(establishmentName: string): Promise<{
    id: string;
    reviewer: any;
    establishmentName: any;
    rating: number;
    comment: any;
    timestamp: number;
}[]>;

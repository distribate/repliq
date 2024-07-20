import { ThreadsRating } from "./ThreadsRating";

 export type PostThreadsRatingQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsRatingHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsRatingHeaderParamsPrefer = (typeof postThreadsRatingHeaderParamsPrefer)[keyof typeof postThreadsRatingHeaderParamsPrefer];
export type PostThreadsRatingHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsRatingHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreadsRating201 = any;
/**
 * @description threads_rating
*/
export type PostThreadsRatingMutationRequest = ThreadsRating;
export type PostThreadsRatingMutationResponse = any;
export type PostThreadsRatingMutation = {
    Response: PostThreadsRatingMutationResponse;
    Request: PostThreadsRatingMutationRequest;
    QueryParams: PostThreadsRatingQueryParams;
    HeaderParams: PostThreadsRatingHeaderParams;
};
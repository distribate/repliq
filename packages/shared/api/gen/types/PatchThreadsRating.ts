import { ThreadsRating } from "./ThreadsRating";

 export type PatchThreadsRatingQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, public.thread_rating_type
    */
    type?: string;
};
export const patchThreadsRatingHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsRatingHeaderParamsPrefer = (typeof patchThreadsRatingHeaderParamsPrefer)[keyof typeof patchThreadsRatingHeaderParamsPrefer];
export type PatchThreadsRatingHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsRatingHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreadsRating204 = any;
/**
 * @description threads_rating
*/
export type PatchThreadsRatingMutationRequest = ThreadsRating;
export type PatchThreadsRatingMutationResponse = any;
export type PatchThreadsRatingMutation = {
    Response: PatchThreadsRatingMutationResponse;
    Request: PatchThreadsRatingMutationRequest;
    QueryParams: PatchThreadsRatingQueryParams;
    HeaderParams: PatchThreadsRatingHeaderParams;
};
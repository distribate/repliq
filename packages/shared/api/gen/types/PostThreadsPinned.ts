import { ThreadsPinned } from "./ThreadsPinned";

 export type PostThreadsPinnedQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsPinnedHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsPinnedHeaderParamsPrefer = (typeof postThreadsPinnedHeaderParamsPrefer)[keyof typeof postThreadsPinnedHeaderParamsPrefer];
export type PostThreadsPinnedHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsPinnedHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreadsPinned201 = any;
/**
 * @description threads_pinned
*/
export type PostThreadsPinnedMutationRequest = ThreadsPinned;
export type PostThreadsPinnedMutationResponse = any;
export type PostThreadsPinnedMutation = {
    Response: PostThreadsPinnedMutationResponse;
    Request: PostThreadsPinnedMutationRequest;
    QueryParams: PostThreadsPinnedQueryParams;
    HeaderParams: PostThreadsPinnedHeaderParams;
};
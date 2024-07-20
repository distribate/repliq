import { ThreadsTags } from "./ThreadsTags";

 export type PostThreadsTagsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsTagsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsTagsHeaderParamsPrefer = (typeof postThreadsTagsHeaderParamsPrefer)[keyof typeof postThreadsTagsHeaderParamsPrefer];
export type PostThreadsTagsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsTagsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreadsTags201 = any;
/**
 * @description threads_tags
*/
export type PostThreadsTagsMutationRequest = ThreadsTags;
export type PostThreadsTagsMutationResponse = any;
export type PostThreadsTagsMutation = {
    Response: PostThreadsTagsMutationResponse;
    Request: PostThreadsTagsMutationRequest;
    QueryParams: PostThreadsTagsQueryParams;
    HeaderParams: PostThreadsTagsHeaderParams;
};
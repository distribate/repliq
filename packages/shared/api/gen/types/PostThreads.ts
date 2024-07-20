import { Threads } from "./Threads";

 export type PostThreadsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsHeaderParamsPrefer = (typeof postThreadsHeaderParamsPrefer)[keyof typeof postThreadsHeaderParamsPrefer];
export type PostThreadsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreads201 = any;
/**
 * @description threads
*/
export type PostThreadsMutationRequest = Threads;
export type PostThreadsMutationResponse = any;
export type PostThreadsMutation = {
    Response: PostThreadsMutationResponse;
    Request: PostThreadsMutationRequest;
    QueryParams: PostThreadsQueryParams;
    HeaderParams: PostThreadsHeaderParams;
};
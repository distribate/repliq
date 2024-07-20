import { Status } from "./Status";

 export type PostStatusQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postStatusHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostStatusHeaderParamsPrefer = (typeof postStatusHeaderParamsPrefer)[keyof typeof postStatusHeaderParamsPrefer];
export type PostStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostStatusHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostStatus201 = any;
/**
 * @description status
*/
export type PostStatusMutationRequest = Status;
export type PostStatusMutationResponse = any;
export type PostStatusMutation = {
    Response: PostStatusMutationResponse;
    Request: PostStatusMutationRequest;
    QueryParams: PostStatusQueryParams;
    HeaderParams: PostStatusHeaderParams;
};
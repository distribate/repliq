import { InfoFindout } from "./InfoFindout";

 export type PostInfoFindoutQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postInfoFindoutHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostInfoFindoutHeaderParamsPrefer = (typeof postInfoFindoutHeaderParamsPrefer)[keyof typeof postInfoFindoutHeaderParamsPrefer];
export type PostInfoFindoutHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostInfoFindoutHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostInfoFindout201 = any;
/**
 * @description info_findout
*/
export type PostInfoFindoutMutationRequest = InfoFindout;
export type PostInfoFindoutMutationResponse = any;
export type PostInfoFindoutMutation = {
    Response: PostInfoFindoutMutationResponse;
    Request: PostInfoFindoutMutationRequest;
    QueryParams: PostInfoFindoutQueryParams;
    HeaderParams: PostInfoFindoutHeaderParams;
};
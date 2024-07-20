import { Auth } from "./Auth";

 export type PostAuthQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postAuthHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostAuthHeaderParamsPrefer = (typeof postAuthHeaderParamsPrefer)[keyof typeof postAuthHeaderParamsPrefer];
export type PostAuthHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostAuthHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostAuth201 = any;
/**
 * @description AUTH
*/
export type PostAuthMutationRequest = Auth;
export type PostAuthMutationResponse = any;
export type PostAuthMutation = {
    Response: PostAuthMutationResponse;
    Request: PostAuthMutationRequest;
    QueryParams: PostAuthQueryParams;
    HeaderParams: PostAuthHeaderParams;
};
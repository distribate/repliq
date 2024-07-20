import { Social } from "./Social";

 export type PostSocialQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postSocialHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostSocialHeaderParamsPrefer = (typeof postSocialHeaderParamsPrefer)[keyof typeof postSocialHeaderParamsPrefer];
export type PostSocialHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostSocialHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostSocial201 = any;
/**
 * @description SOCIAL
*/
export type PostSocialMutationRequest = Social;
export type PostSocialMutationResponse = any;
export type PostSocialMutation = {
    Response: PostSocialMutationResponse;
    Request: PostSocialMutationRequest;
    QueryParams: PostSocialQueryParams;
    HeaderParams: PostSocialHeaderParams;
};
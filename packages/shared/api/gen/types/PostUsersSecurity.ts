import { UsersSecurity } from "./UsersSecurity";

 export type PostUsersSecurityQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersSecurityHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersSecurityHeaderParamsPrefer = (typeof postUsersSecurityHeaderParamsPrefer)[keyof typeof postUsersSecurityHeaderParamsPrefer];
export type PostUsersSecurityHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersSecurityHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsersSecurity201 = any;
/**
 * @description users_security
*/
export type PostUsersSecurityMutationRequest = UsersSecurity;
export type PostUsersSecurityMutationResponse = any;
export type PostUsersSecurityMutation = {
    Response: PostUsersSecurityMutationResponse;
    Request: PostUsersSecurityMutationRequest;
    QueryParams: PostUsersSecurityQueryParams;
    HeaderParams: PostUsersSecurityHeaderParams;
};
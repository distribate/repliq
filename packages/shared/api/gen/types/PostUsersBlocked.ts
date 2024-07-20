import { UsersBlocked } from "./UsersBlocked";

 export type PostUsersBlockedQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersBlockedHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersBlockedHeaderParamsPrefer = (typeof postUsersBlockedHeaderParamsPrefer)[keyof typeof postUsersBlockedHeaderParamsPrefer];
export type PostUsersBlockedHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersBlockedHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsersBlocked201 = any;
/**
 * @description users_blocked
*/
export type PostUsersBlockedMutationRequest = UsersBlocked;
export type PostUsersBlockedMutationResponse = any;
export type PostUsersBlockedMutation = {
    Response: PostUsersBlockedMutationResponse;
    Request: PostUsersBlockedMutationRequest;
    QueryParams: PostUsersBlockedQueryParams;
    HeaderParams: PostUsersBlockedHeaderParams;
};
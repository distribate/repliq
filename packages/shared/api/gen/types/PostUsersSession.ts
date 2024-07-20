import { UsersSession } from "./UsersSession";

 export type PostUsersSessionQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersSessionHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersSessionHeaderParamsPrefer = (typeof postUsersSessionHeaderParamsPrefer)[keyof typeof postUsersSessionHeaderParamsPrefer];
export type PostUsersSessionHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersSessionHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsersSession201 = any;
/**
 * @description users_session
*/
export type PostUsersSessionMutationRequest = UsersSession;
export type PostUsersSessionMutationResponse = any;
export type PostUsersSessionMutation = {
    Response: PostUsersSessionMutationResponse;
    Request: PostUsersSessionMutationRequest;
    QueryParams: PostUsersSessionQueryParams;
    HeaderParams: PostUsersSessionHeaderParams;
};
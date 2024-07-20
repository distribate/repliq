import { ThreadsUsers } from "./ThreadsUsers";

 export type PostThreadsUsersQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsUsersHeaderParamsPrefer = (typeof postThreadsUsersHeaderParamsPrefer)[keyof typeof postThreadsUsersHeaderParamsPrefer];
export type PostThreadsUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsUsersHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreadsUsers201 = any;
/**
 * @description threads_users
*/
export type PostThreadsUsersMutationRequest = ThreadsUsers;
export type PostThreadsUsersMutationResponse = any;
export type PostThreadsUsersMutation = {
    Response: PostThreadsUsersMutationResponse;
    Request: PostThreadsUsersMutationRequest;
    QueryParams: PostThreadsUsersQueryParams;
    HeaderParams: PostThreadsUsersHeaderParams;
};
import { UsersStatus } from "./UsersStatus";

 export type PostUsersStatusQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersStatusHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersStatusHeaderParamsPrefer = (typeof postUsersStatusHeaderParamsPrefer)[keyof typeof postUsersStatusHeaderParamsPrefer];
export type PostUsersStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersStatusHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsersStatus201 = any;
/**
 * @description users_status
*/
export type PostUsersStatusMutationRequest = UsersStatus;
export type PostUsersStatusMutationResponse = any;
export type PostUsersStatusMutation = {
    Response: PostUsersStatusMutationResponse;
    Request: PostUsersStatusMutationRequest;
    QueryParams: PostUsersStatusQueryParams;
    HeaderParams: PostUsersStatusHeaderParams;
};
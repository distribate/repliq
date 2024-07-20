import { Users } from "./Users";

 export type PostUsersQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersHeaderParamsPrefer = (typeof postUsersHeaderParamsPrefer)[keyof typeof postUsersHeaderParamsPrefer];
export type PostUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsers201 = any;
/**
 * @description users
*/
export type PostUsersMutationRequest = Users;
export type PostUsersMutationResponse = any;
export type PostUsersMutation = {
    Response: PostUsersMutationResponse;
    Request: PostUsersMutationRequest;
    QueryParams: PostUsersQueryParams;
    HeaderParams: PostUsersHeaderParams;
};
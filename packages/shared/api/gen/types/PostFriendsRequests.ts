import { FriendsRequests } from "./FriendsRequests";

 export type PostFriendsRequestsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postFriendsRequestsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostFriendsRequestsHeaderParamsPrefer = (typeof postFriendsRequestsHeaderParamsPrefer)[keyof typeof postFriendsRequestsHeaderParamsPrefer];
export type PostFriendsRequestsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostFriendsRequestsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostFriendsRequests201 = any;
/**
 * @description friends_requests
*/
export type PostFriendsRequestsMutationRequest = FriendsRequests;
export type PostFriendsRequestsMutationResponse = any;
export type PostFriendsRequestsMutation = {
    Response: PostFriendsRequestsMutationResponse;
    Request: PostFriendsRequestsMutationRequest;
    QueryParams: PostFriendsRequestsQueryParams;
    HeaderParams: PostFriendsRequestsHeaderParams;
};
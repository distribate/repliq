import { UsersFriends } from "./UsersFriends";

 export type PostUsersFriendsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersFriendsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersFriendsHeaderParamsPrefer = (typeof postUsersFriendsHeaderParamsPrefer)[keyof typeof postUsersFriendsHeaderParamsPrefer];
export type PostUsersFriendsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersFriendsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsersFriends201 = any;
/**
 * @description users_friends
*/
export type PostUsersFriendsMutationRequest = UsersFriends;
export type PostUsersFriendsMutationResponse = any;
export type PostUsersFriendsMutation = {
    Response: PostUsersFriendsMutationResponse;
    Request: PostUsersFriendsMutationRequest;
    QueryParams: PostUsersFriendsQueryParams;
    HeaderParams: PostUsersFriendsHeaderParams;
};
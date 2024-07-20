import { UsersFriends } from "./UsersFriends";

 export type PatchUsersFriendsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    user_1?: string;
    /**
     * @type string | undefined, text
    */
    user_2?: string;
};
export const patchUsersFriendsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersFriendsHeaderParamsPrefer = (typeof patchUsersFriendsHeaderParamsPrefer)[keyof typeof patchUsersFriendsHeaderParamsPrefer];
export type PatchUsersFriendsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersFriendsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsersFriends204 = any;
/**
 * @description users_friends
*/
export type PatchUsersFriendsMutationRequest = UsersFriends;
export type PatchUsersFriendsMutationResponse = any;
export type PatchUsersFriendsMutation = {
    Response: PatchUsersFriendsMutationResponse;
    Request: PatchUsersFriendsMutationRequest;
    QueryParams: PatchUsersFriendsQueryParams;
    HeaderParams: PatchUsersFriendsHeaderParams;
};
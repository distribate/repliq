export type DeleteUsersFriendsQueryParams = {
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
export const deleteUsersFriendsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersFriendsHeaderParamsPrefer = (typeof deleteUsersFriendsHeaderParamsPrefer)[keyof typeof deleteUsersFriendsHeaderParamsPrefer];
export type DeleteUsersFriendsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersFriendsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsersFriends204 = any;
export type DeleteUsersFriendsMutationResponse = any;
export type DeleteUsersFriendsMutation = {
    Response: DeleteUsersFriendsMutationResponse;
    QueryParams: DeleteUsersFriendsQueryParams;
    HeaderParams: DeleteUsersFriendsHeaderParams;
};
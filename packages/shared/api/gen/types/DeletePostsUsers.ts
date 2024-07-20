export type DeletePostsUsersQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    post_id?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
};
export const deletePostsUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeletePostsUsersHeaderParamsPrefer = (typeof deletePostsUsersHeaderParamsPrefer)[keyof typeof deletePostsUsersHeaderParamsPrefer];
export type DeletePostsUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeletePostsUsersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeletePostsUsers204 = any;
export type DeletePostsUsersMutationResponse = any;
export type DeletePostsUsersMutation = {
    Response: DeletePostsUsersMutationResponse;
    QueryParams: DeletePostsUsersQueryParams;
    HeaderParams: DeletePostsUsersHeaderParams;
};
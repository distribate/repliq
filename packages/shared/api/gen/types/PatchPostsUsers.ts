import { PostsUsers } from "./PostsUsers";

 export type PatchPostsUsersQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    post_id?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
};
export const patchPostsUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchPostsUsersHeaderParamsPrefer = (typeof patchPostsUsersHeaderParamsPrefer)[keyof typeof patchPostsUsersHeaderParamsPrefer];
export type PatchPostsUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchPostsUsersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchPostsUsers204 = any;
/**
 * @description posts_users
*/
export type PatchPostsUsersMutationRequest = PostsUsers;
export type PatchPostsUsersMutationResponse = any;
export type PatchPostsUsersMutation = {
    Response: PatchPostsUsersMutationResponse;
    Request: PatchPostsUsersMutationRequest;
    QueryParams: PatchPostsUsersQueryParams;
    HeaderParams: PatchPostsUsersHeaderParams;
};
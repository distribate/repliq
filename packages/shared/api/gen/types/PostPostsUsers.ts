import { PostsUsers } from "./PostsUsers";

 export type PostPostsUsersQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postPostsUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostPostsUsersHeaderParamsPrefer = (typeof postPostsUsersHeaderParamsPrefer)[keyof typeof postPostsUsersHeaderParamsPrefer];
export type PostPostsUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostPostsUsersHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostPostsUsers201 = any;
/**
 * @description posts_users
*/
export type PostPostsUsersMutationRequest = PostsUsers;
export type PostPostsUsersMutationResponse = any;
export type PostPostsUsersMutation = {
    Response: PostPostsUsersMutationResponse;
    Request: PostPostsUsersMutationRequest;
    QueryParams: PostPostsUsersQueryParams;
    HeaderParams: PostPostsUsersHeaderParams;
};
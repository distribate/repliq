import { Posts } from "./Posts";

 export type PostPostsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postPostsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostPostsHeaderParamsPrefer = (typeof postPostsHeaderParamsPrefer)[keyof typeof postPostsHeaderParamsPrefer];
export type PostPostsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostPostsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostPosts201 = any;
/**
 * @description posts
*/
export type PostPostsMutationRequest = Posts;
export type PostPostsMutationResponse = any;
export type PostPostsMutation = {
    Response: PostPostsMutationResponse;
    Request: PostPostsMutationRequest;
    QueryParams: PostPostsQueryParams;
    HeaderParams: PostPostsHeaderParams;
};
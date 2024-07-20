import { PostsComments } from "./PostsComments";

 export type PostPostsCommentsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postPostsCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostPostsCommentsHeaderParamsPrefer = (typeof postPostsCommentsHeaderParamsPrefer)[keyof typeof postPostsCommentsHeaderParamsPrefer];
export type PostPostsCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostPostsCommentsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostPostsComments201 = any;
/**
 * @description posts_comments
*/
export type PostPostsCommentsMutationRequest = PostsComments;
export type PostPostsCommentsMutationResponse = any;
export type PostPostsCommentsMutation = {
    Response: PostPostsCommentsMutationResponse;
    Request: PostPostsCommentsMutationRequest;
    QueryParams: PostPostsCommentsQueryParams;
    HeaderParams: PostPostsCommentsHeaderParams;
};
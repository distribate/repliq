import { PostsComments } from "./PostsComments";

 export type PatchPostsCommentsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    post_id?: string;
    /**
     * @type string | undefined, uuid
    */
    comment_id?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
};
export const patchPostsCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchPostsCommentsHeaderParamsPrefer = (typeof patchPostsCommentsHeaderParamsPrefer)[keyof typeof patchPostsCommentsHeaderParamsPrefer];
export type PatchPostsCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchPostsCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchPostsComments204 = any;
/**
 * @description posts_comments
*/
export type PatchPostsCommentsMutationRequest = PostsComments;
export type PatchPostsCommentsMutationResponse = any;
export type PatchPostsCommentsMutation = {
    Response: PatchPostsCommentsMutationResponse;
    Request: PatchPostsCommentsMutationRequest;
    QueryParams: PatchPostsCommentsQueryParams;
    HeaderParams: PatchPostsCommentsHeaderParams;
};
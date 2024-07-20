export type DeletePostsCommentsQueryParams = {
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
export const deletePostsCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeletePostsCommentsHeaderParamsPrefer = (typeof deletePostsCommentsHeaderParamsPrefer)[keyof typeof deletePostsCommentsHeaderParamsPrefer];
export type DeletePostsCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeletePostsCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeletePostsComments204 = any;
export type DeletePostsCommentsMutationResponse = any;
export type DeletePostsCommentsMutation = {
    Response: DeletePostsCommentsMutationResponse;
    QueryParams: DeletePostsCommentsQueryParams;
    HeaderParams: DeletePostsCommentsHeaderParams;
};
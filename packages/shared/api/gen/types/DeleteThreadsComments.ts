export type DeleteThreadsCommentsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, uuid
    */
    comment_id?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
};
export const deleteThreadsCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsCommentsHeaderParamsPrefer = (typeof deleteThreadsCommentsHeaderParamsPrefer)[keyof typeof deleteThreadsCommentsHeaderParamsPrefer];
export type DeleteThreadsCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreadsComments204 = any;
export type DeleteThreadsCommentsMutationResponse = any;
export type DeleteThreadsCommentsMutation = {
    Response: DeleteThreadsCommentsMutationResponse;
    QueryParams: DeleteThreadsCommentsQueryParams;
    HeaderParams: DeleteThreadsCommentsHeaderParams;
};
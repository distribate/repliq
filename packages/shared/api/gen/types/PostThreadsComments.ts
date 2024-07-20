import { ThreadsComments } from "./ThreadsComments";

 export type PostThreadsCommentsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsCommentsHeaderParamsPrefer = (typeof postThreadsCommentsHeaderParamsPrefer)[keyof typeof postThreadsCommentsHeaderParamsPrefer];
export type PostThreadsCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsCommentsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreadsComments201 = any;
/**
 * @description threads_comments
*/
export type PostThreadsCommentsMutationRequest = ThreadsComments;
export type PostThreadsCommentsMutationResponse = any;
export type PostThreadsCommentsMutation = {
    Response: PostThreadsCommentsMutationResponse;
    Request: PostThreadsCommentsMutationRequest;
    QueryParams: PostThreadsCommentsQueryParams;
    HeaderParams: PostThreadsCommentsHeaderParams;
};
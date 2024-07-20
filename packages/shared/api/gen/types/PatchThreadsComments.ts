import { ThreadsComments } from "./ThreadsComments";

 export type PatchThreadsCommentsQueryParams = {
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
export const patchThreadsCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsCommentsHeaderParamsPrefer = (typeof patchThreadsCommentsHeaderParamsPrefer)[keyof typeof patchThreadsCommentsHeaderParamsPrefer];
export type PatchThreadsCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreadsComments204 = any;
/**
 * @description threads_comments
*/
export type PatchThreadsCommentsMutationRequest = ThreadsComments;
export type PatchThreadsCommentsMutationResponse = any;
export type PatchThreadsCommentsMutation = {
    Response: PatchThreadsCommentsMutationResponse;
    Request: PatchThreadsCommentsMutationRequest;
    QueryParams: PatchThreadsCommentsQueryParams;
    HeaderParams: PatchThreadsCommentsHeaderParams;
};
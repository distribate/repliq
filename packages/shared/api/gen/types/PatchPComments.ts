import { PComments } from "./PComments";

 export type PatchPCommentsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    content?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
};
export const patchPCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchPCommentsHeaderParamsPrefer = (typeof patchPCommentsHeaderParamsPrefer)[keyof typeof patchPCommentsHeaderParamsPrefer];
export type PatchPCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchPCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchPComments204 = any;
/**
 * @description p_comments
*/
export type PatchPCommentsMutationRequest = PComments;
export type PatchPCommentsMutationResponse = any;
export type PatchPCommentsMutation = {
    Response: PatchPCommentsMutationResponse;
    Request: PatchPCommentsMutationRequest;
    QueryParams: PatchPCommentsQueryParams;
    HeaderParams: PatchPCommentsHeaderParams;
};
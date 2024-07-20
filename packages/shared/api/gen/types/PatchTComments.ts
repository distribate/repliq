import { TComments } from "./TComments";

 export type PatchTCommentsQueryParams = {
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    content?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
};
export const patchTCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchTCommentsHeaderParamsPrefer = (typeof patchTCommentsHeaderParamsPrefer)[keyof typeof patchTCommentsHeaderParamsPrefer];
export type PatchTCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchTCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchTComments204 = any;
/**
 * @description t_comments
*/
export type PatchTCommentsMutationRequest = TComments;
export type PatchTCommentsMutationResponse = any;
export type PatchTCommentsMutation = {
    Response: PatchTCommentsMutationResponse;
    Request: PatchTCommentsMutationRequest;
    QueryParams: PatchTCommentsQueryParams;
    HeaderParams: PatchTCommentsHeaderParams;
};
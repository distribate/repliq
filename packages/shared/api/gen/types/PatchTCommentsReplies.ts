import { TCommentsReplies } from "./TCommentsReplies";

 export type PatchTCommentsRepliesQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, uuid
    */
    initiator_comment_id?: string;
    /**
     * @type string | undefined, uuid
    */
    recipient_comment_id?: string;
};
export const patchTCommentsRepliesHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchTCommentsRepliesHeaderParamsPrefer = (typeof patchTCommentsRepliesHeaderParamsPrefer)[keyof typeof patchTCommentsRepliesHeaderParamsPrefer];
export type PatchTCommentsRepliesHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchTCommentsRepliesHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchTCommentsReplies204 = any;
/**
 * @description t_comments_replies
*/
export type PatchTCommentsRepliesMutationRequest = TCommentsReplies;
export type PatchTCommentsRepliesMutationResponse = any;
export type PatchTCommentsRepliesMutation = {
    Response: PatchTCommentsRepliesMutationResponse;
    Request: PatchTCommentsRepliesMutationRequest;
    QueryParams: PatchTCommentsRepliesQueryParams;
    HeaderParams: PatchTCommentsRepliesHeaderParams;
};
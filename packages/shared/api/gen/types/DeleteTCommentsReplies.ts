export type DeleteTCommentsRepliesQueryParams = {
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
export const deleteTCommentsRepliesHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteTCommentsRepliesHeaderParamsPrefer = (typeof deleteTCommentsRepliesHeaderParamsPrefer)[keyof typeof deleteTCommentsRepliesHeaderParamsPrefer];
export type DeleteTCommentsRepliesHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteTCommentsRepliesHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteTCommentsReplies204 = any;
export type DeleteTCommentsRepliesMutationResponse = any;
export type DeleteTCommentsRepliesMutation = {
    Response: DeleteTCommentsRepliesMutationResponse;
    QueryParams: DeleteTCommentsRepliesQueryParams;
    HeaderParams: DeleteTCommentsRepliesHeaderParams;
};
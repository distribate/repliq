export type DeleteTCommentsQueryParams = {
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
export const deleteTCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteTCommentsHeaderParamsPrefer = (typeof deleteTCommentsHeaderParamsPrefer)[keyof typeof deleteTCommentsHeaderParamsPrefer];
export type DeleteTCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteTCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteTComments204 = any;
export type DeleteTCommentsMutationResponse = any;
export type DeleteTCommentsMutation = {
    Response: DeleteTCommentsMutationResponse;
    QueryParams: DeleteTCommentsQueryParams;
    HeaderParams: DeleteTCommentsHeaderParams;
};
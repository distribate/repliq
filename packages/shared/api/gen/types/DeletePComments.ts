export type DeletePCommentsQueryParams = {
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
export const deletePCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeletePCommentsHeaderParamsPrefer = (typeof deletePCommentsHeaderParamsPrefer)[keyof typeof deletePCommentsHeaderParamsPrefer];
export type DeletePCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeletePCommentsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeletePComments204 = any;
export type DeletePCommentsMutationResponse = any;
export type DeletePCommentsMutation = {
    Response: DeletePCommentsMutationResponse;
    QueryParams: DeletePCommentsQueryParams;
    HeaderParams: DeletePCommentsHeaderParams;
};
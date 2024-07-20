export type DeleteThreadsPinnedQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    threads_id?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
};
export const deleteThreadsPinnedHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsPinnedHeaderParamsPrefer = (typeof deleteThreadsPinnedHeaderParamsPrefer)[keyof typeof deleteThreadsPinnedHeaderParamsPrefer];
export type DeleteThreadsPinnedHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsPinnedHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreadsPinned204 = any;
export type DeleteThreadsPinnedMutationResponse = any;
export type DeleteThreadsPinnedMutation = {
    Response: DeleteThreadsPinnedMutationResponse;
    QueryParams: DeleteThreadsPinnedQueryParams;
    HeaderParams: DeleteThreadsPinnedHeaderParams;
};
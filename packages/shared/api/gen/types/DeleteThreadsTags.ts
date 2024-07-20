export type DeleteThreadsTagsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, jsonb[]
    */
    tags?: string;
};
export const deleteThreadsTagsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsTagsHeaderParamsPrefer = (typeof deleteThreadsTagsHeaderParamsPrefer)[keyof typeof deleteThreadsTagsHeaderParamsPrefer];
export type DeleteThreadsTagsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsTagsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreadsTags204 = any;
export type DeleteThreadsTagsMutationResponse = any;
export type DeleteThreadsTagsMutation = {
    Response: DeleteThreadsTagsMutationResponse;
    QueryParams: DeleteThreadsTagsQueryParams;
    HeaderParams: DeleteThreadsTagsHeaderParams;
};
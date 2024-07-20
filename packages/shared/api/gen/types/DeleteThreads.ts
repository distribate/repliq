export type DeleteThreadsQueryParams = {
    /**
     * @type string | undefined, timestamp without time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, boolean
    */
    comments?: string;
    /**
     * @type string | undefined, boolean
    */
    permission?: string;
    /**
     * @type string | undefined, boolean
    */
    auto_remove?: string;
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, jsonb
    */
    content?: string;
};
export const deleteThreadsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsHeaderParamsPrefer = (typeof deleteThreadsHeaderParamsPrefer)[keyof typeof deleteThreadsHeaderParamsPrefer];
export type DeleteThreadsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreads204 = any;
export type DeleteThreadsMutationResponse = any;
export type DeleteThreadsMutation = {
    Response: DeleteThreadsMutationResponse;
    QueryParams: DeleteThreadsQueryParams;
    HeaderParams: DeleteThreadsHeaderParams;
};
export type DeleteThreadsImagesQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, text[]
    */
    images?: string;
};
export const deleteThreadsImagesHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsImagesHeaderParamsPrefer = (typeof deleteThreadsImagesHeaderParamsPrefer)[keyof typeof deleteThreadsImagesHeaderParamsPrefer];
export type DeleteThreadsImagesHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsImagesHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreadsImages204 = any;
export type DeleteThreadsImagesMutationResponse = any;
export type DeleteThreadsImagesMutation = {
    Response: DeleteThreadsImagesMutationResponse;
    QueryParams: DeleteThreadsImagesQueryParams;
    HeaderParams: DeleteThreadsImagesHeaderParams;
};
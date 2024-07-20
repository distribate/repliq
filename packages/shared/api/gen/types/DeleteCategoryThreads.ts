export type DeleteCategoryThreadsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    category_id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
};
export const deleteCategoryThreadsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteCategoryThreadsHeaderParamsPrefer = (typeof deleteCategoryThreadsHeaderParamsPrefer)[keyof typeof deleteCategoryThreadsHeaderParamsPrefer];
export type DeleteCategoryThreadsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteCategoryThreadsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteCategoryThreads204 = any;
export type DeleteCategoryThreadsMutationResponse = any;
export type DeleteCategoryThreadsMutation = {
    Response: DeleteCategoryThreadsMutationResponse;
    QueryParams: DeleteCategoryThreadsQueryParams;
    HeaderParams: DeleteCategoryThreadsHeaderParams;
};
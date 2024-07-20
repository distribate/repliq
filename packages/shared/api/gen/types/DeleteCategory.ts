export type DeleteCategoryQueryParams = {
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, boolean
    */
    available?: string;
};
export const deleteCategoryHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteCategoryHeaderParamsPrefer = (typeof deleteCategoryHeaderParamsPrefer)[keyof typeof deleteCategoryHeaderParamsPrefer];
export type DeleteCategoryHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteCategoryHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteCategory204 = any;
export type DeleteCategoryMutationResponse = any;
export type DeleteCategoryMutation = {
    Response: DeleteCategoryMutationResponse;
    QueryParams: DeleteCategoryQueryParams;
    HeaderParams: DeleteCategoryHeaderParams;
};
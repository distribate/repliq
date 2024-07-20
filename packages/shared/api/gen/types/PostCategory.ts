import { Category } from "./Category";

 export type PostCategoryQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postCategoryHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostCategoryHeaderParamsPrefer = (typeof postCategoryHeaderParamsPrefer)[keyof typeof postCategoryHeaderParamsPrefer];
export type PostCategoryHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostCategoryHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostCategory201 = any;
/**
 * @description category
*/
export type PostCategoryMutationRequest = Category;
export type PostCategoryMutationResponse = any;
export type PostCategoryMutation = {
    Response: PostCategoryMutationResponse;
    Request: PostCategoryMutationRequest;
    QueryParams: PostCategoryQueryParams;
    HeaderParams: PostCategoryHeaderParams;
};
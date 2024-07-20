import { CategoryThreads } from "./CategoryThreads";

 export type PostCategoryThreadsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postCategoryThreadsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostCategoryThreadsHeaderParamsPrefer = (typeof postCategoryThreadsHeaderParamsPrefer)[keyof typeof postCategoryThreadsHeaderParamsPrefer];
export type PostCategoryThreadsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostCategoryThreadsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostCategoryThreads201 = any;
/**
 * @description category_threads
*/
export type PostCategoryThreadsMutationRequest = CategoryThreads;
export type PostCategoryThreadsMutationResponse = any;
export type PostCategoryThreadsMutation = {
    Response: PostCategoryThreadsMutationResponse;
    Request: PostCategoryThreadsMutationRequest;
    QueryParams: PostCategoryThreadsQueryParams;
    HeaderParams: PostCategoryThreadsHeaderParams;
};
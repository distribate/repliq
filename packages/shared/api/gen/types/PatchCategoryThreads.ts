import { CategoryThreads } from "./CategoryThreads";

 export type PatchCategoryThreadsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    category_id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
};
export const patchCategoryThreadsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchCategoryThreadsHeaderParamsPrefer = (typeof patchCategoryThreadsHeaderParamsPrefer)[keyof typeof patchCategoryThreadsHeaderParamsPrefer];
export type PatchCategoryThreadsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchCategoryThreadsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchCategoryThreads204 = any;
/**
 * @description category_threads
*/
export type PatchCategoryThreadsMutationRequest = CategoryThreads;
export type PatchCategoryThreadsMutationResponse = any;
export type PatchCategoryThreadsMutation = {
    Response: PatchCategoryThreadsMutationResponse;
    Request: PatchCategoryThreadsMutationRequest;
    QueryParams: PatchCategoryThreadsQueryParams;
    HeaderParams: PatchCategoryThreadsHeaderParams;
};
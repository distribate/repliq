import { Category } from "./Category";

 export type PatchCategoryQueryParams = {
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
export const patchCategoryHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchCategoryHeaderParamsPrefer = (typeof patchCategoryHeaderParamsPrefer)[keyof typeof patchCategoryHeaderParamsPrefer];
export type PatchCategoryHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchCategoryHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchCategory204 = any;
/**
 * @description category
*/
export type PatchCategoryMutationRequest = Category;
export type PatchCategoryMutationResponse = any;
export type PatchCategoryMutation = {
    Response: PatchCategoryMutationResponse;
    Request: PatchCategoryMutationRequest;
    QueryParams: PatchCategoryQueryParams;
    HeaderParams: PatchCategoryHeaderParams;
};
import type { Category } from "./Category";

 export type GetCategoryQueryParams = {
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
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
    /**
     * @description Ordering
     * @type string | undefined
    */
    order?: string;
    /**
     * @description Limiting and Pagination
     * @type string | undefined
    */
    offset?: string;
    /**
     * @description Limiting and Pagination
     * @type string | undefined
    */
    limit?: string;
};
export const getCategoryHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetCategoryHeaderParamsPrefer = (typeof getCategoryHeaderParamsPrefer)[keyof typeof getCategoryHeaderParamsPrefer];
export type GetCategoryHeaderParams = {
    /**
     * @description Limiting and Pagination
     * @type string | undefined
    */
    Range?: string;
    /**
     * @description Limiting and Pagination
     * @default "items"
     * @type string | undefined
    */
    "Range-Unit"?: string;
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: GetCategoryHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetCategory200 = Category[];
/**
 * @description Partial Content
*/
export type GetCategory206 = any;
/**
 * @description OK
*/
export type GetCategoryQueryResponse = Category[];
export type GetCategoryQuery = {
    Response: GetCategoryQueryResponse;
    QueryParams: GetCategoryQueryParams;
    HeaderParams: GetCategoryHeaderParams;
};
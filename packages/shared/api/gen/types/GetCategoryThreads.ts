import type { CategoryThreads } from "./CategoryThreads";

 export type GetCategoryThreadsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    category_id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
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
export const getCategoryThreadsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetCategoryThreadsHeaderParamsPrefer = (typeof getCategoryThreadsHeaderParamsPrefer)[keyof typeof getCategoryThreadsHeaderParamsPrefer];
export type GetCategoryThreadsHeaderParams = {
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
    Prefer?: GetCategoryThreadsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetCategoryThreads200 = CategoryThreads[];
/**
 * @description Partial Content
*/
export type GetCategoryThreads206 = any;
/**
 * @description OK
*/
export type GetCategoryThreadsQueryResponse = CategoryThreads[];
export type GetCategoryThreadsQuery = {
    Response: GetCategoryThreadsQueryResponse;
    QueryParams: GetCategoryThreadsQueryParams;
    HeaderParams: GetCategoryThreadsHeaderParams;
};
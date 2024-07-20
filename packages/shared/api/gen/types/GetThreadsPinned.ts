import type { ThreadsPinned } from "./ThreadsPinned";

 export type GetThreadsPinnedQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    threads_id?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
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
export const getThreadsPinnedHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsPinnedHeaderParamsPrefer = (typeof getThreadsPinnedHeaderParamsPrefer)[keyof typeof getThreadsPinnedHeaderParamsPrefer];
export type GetThreadsPinnedHeaderParams = {
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
    Prefer?: GetThreadsPinnedHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreadsPinned200 = ThreadsPinned[];
/**
 * @description Partial Content
*/
export type GetThreadsPinned206 = any;
/**
 * @description OK
*/
export type GetThreadsPinnedQueryResponse = ThreadsPinned[];
export type GetThreadsPinnedQuery = {
    Response: GetThreadsPinnedQueryResponse;
    QueryParams: GetThreadsPinnedQueryParams;
    HeaderParams: GetThreadsPinnedHeaderParams;
};
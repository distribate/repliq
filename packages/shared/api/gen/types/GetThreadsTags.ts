import type { ThreadsTags } from "./ThreadsTags";

 export type GetThreadsTagsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, jsonb[]
    */
    tags?: string;
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
export const getThreadsTagsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsTagsHeaderParamsPrefer = (typeof getThreadsTagsHeaderParamsPrefer)[keyof typeof getThreadsTagsHeaderParamsPrefer];
export type GetThreadsTagsHeaderParams = {
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
    Prefer?: GetThreadsTagsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreadsTags200 = ThreadsTags[];
/**
 * @description Partial Content
*/
export type GetThreadsTags206 = any;
/**
 * @description OK
*/
export type GetThreadsTagsQueryResponse = ThreadsTags[];
export type GetThreadsTagsQuery = {
    Response: GetThreadsTagsQueryResponse;
    QueryParams: GetThreadsTagsQueryParams;
    HeaderParams: GetThreadsTagsHeaderParams;
};
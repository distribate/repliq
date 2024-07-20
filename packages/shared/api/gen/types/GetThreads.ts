import type { Threads } from "./Threads";

 export type GetThreadsQueryParams = {
    /**
     * @type string | undefined, timestamp without time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, boolean
    */
    comments?: string;
    /**
     * @type string | undefined, boolean
    */
    permission?: string;
    /**
     * @type string | undefined, boolean
    */
    auto_remove?: string;
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, jsonb
    */
    content?: string;
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
export const getThreadsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsHeaderParamsPrefer = (typeof getThreadsHeaderParamsPrefer)[keyof typeof getThreadsHeaderParamsPrefer];
export type GetThreadsHeaderParams = {
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
    Prefer?: GetThreadsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreads200 = Threads[];
/**
 * @description Partial Content
*/
export type GetThreads206 = any;
/**
 * @description OK
*/
export type GetThreadsQueryResponse = Threads[];
export type GetThreadsQuery = {
    Response: GetThreadsQueryResponse;
    QueryParams: GetThreadsQueryParams;
    HeaderParams: GetThreadsHeaderParams;
};
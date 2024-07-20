import type { ThreadsComments } from "./ThreadsComments";

 export type GetThreadsCommentsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, uuid
    */
    comment_id?: string;
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
export const getThreadsCommentsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsCommentsHeaderParamsPrefer = (typeof getThreadsCommentsHeaderParamsPrefer)[keyof typeof getThreadsCommentsHeaderParamsPrefer];
export type GetThreadsCommentsHeaderParams = {
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
    Prefer?: GetThreadsCommentsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreadsComments200 = ThreadsComments[];
/**
 * @description Partial Content
*/
export type GetThreadsComments206 = any;
/**
 * @description OK
*/
export type GetThreadsCommentsQueryResponse = ThreadsComments[];
export type GetThreadsCommentsQuery = {
    Response: GetThreadsCommentsQueryResponse;
    QueryParams: GetThreadsCommentsQueryParams;
    HeaderParams: GetThreadsCommentsHeaderParams;
};
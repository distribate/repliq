import type { ThreadsRating } from "./ThreadsRating";

 export type GetThreadsRatingQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, public.thread_rating_type
    */
    type?: string;
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
export const getThreadsRatingHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsRatingHeaderParamsPrefer = (typeof getThreadsRatingHeaderParamsPrefer)[keyof typeof getThreadsRatingHeaderParamsPrefer];
export type GetThreadsRatingHeaderParams = {
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
    Prefer?: GetThreadsRatingHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreadsRating200 = ThreadsRating[];
/**
 * @description Partial Content
*/
export type GetThreadsRating206 = any;
/**
 * @description OK
*/
export type GetThreadsRatingQueryResponse = ThreadsRating[];
export type GetThreadsRatingQuery = {
    Response: GetThreadsRatingQueryResponse;
    QueryParams: GetThreadsRatingQueryParams;
    HeaderParams: GetThreadsRatingHeaderParams;
};
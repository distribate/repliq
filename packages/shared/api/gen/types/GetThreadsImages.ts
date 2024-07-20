import type { ThreadsImages } from "./ThreadsImages";

 export type GetThreadsImagesQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, text[]
    */
    images?: string;
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
export const getThreadsImagesHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsImagesHeaderParamsPrefer = (typeof getThreadsImagesHeaderParamsPrefer)[keyof typeof getThreadsImagesHeaderParamsPrefer];
export type GetThreadsImagesHeaderParams = {
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
    Prefer?: GetThreadsImagesHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreadsImages200 = ThreadsImages[];
/**
 * @description Partial Content
*/
export type GetThreadsImages206 = any;
/**
 * @description OK
*/
export type GetThreadsImagesQueryResponse = ThreadsImages[];
export type GetThreadsImagesQuery = {
    Response: GetThreadsImagesQueryResponse;
    QueryParams: GetThreadsImagesQueryParams;
    HeaderParams: GetThreadsImagesHeaderParams;
};
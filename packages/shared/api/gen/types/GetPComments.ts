import type { PComments } from "./PComments";

 export type GetPCommentsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    content?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
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
export const getPCommentsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetPCommentsHeaderParamsPrefer = (typeof getPCommentsHeaderParamsPrefer)[keyof typeof getPCommentsHeaderParamsPrefer];
export type GetPCommentsHeaderParams = {
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
    Prefer?: GetPCommentsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetPComments200 = PComments[];
/**
 * @description Partial Content
*/
export type GetPComments206 = any;
/**
 * @description OK
*/
export type GetPCommentsQueryResponse = PComments[];
export type GetPCommentsQuery = {
    Response: GetPCommentsQueryResponse;
    QueryParams: GetPCommentsQueryParams;
    HeaderParams: GetPCommentsHeaderParams;
};
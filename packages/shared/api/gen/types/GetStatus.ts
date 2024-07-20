import type { Status } from "./Status";

 export type GetStatusQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, boolean
    */
    value?: string;
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
export const getStatusHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetStatusHeaderParamsPrefer = (typeof getStatusHeaderParamsPrefer)[keyof typeof getStatusHeaderParamsPrefer];
export type GetStatusHeaderParams = {
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
    Prefer?: GetStatusHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetStatus200 = Status[];
/**
 * @description Partial Content
*/
export type GetStatus206 = any;
/**
 * @description OK
*/
export type GetStatusQueryResponse = Status[];
export type GetStatusQuery = {
    Response: GetStatusQueryResponse;
    QueryParams: GetStatusQueryParams;
    HeaderParams: GetStatusHeaderParams;
};
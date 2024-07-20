import type { Reports } from "./Reports";

 export type GetReportsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type string | undefined, json
    */
    reported_item?: string;
    /**
     * @type string | undefined, public.report_reason
    */
    reason?: string;
    /**
     * @type string | undefined, text
    */
    target_user_nickname?: string;
    /**
     * @type string | undefined, public.report_type
    */
    report_type?: string;
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
export const getReportsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetReportsHeaderParamsPrefer = (typeof getReportsHeaderParamsPrefer)[keyof typeof getReportsHeaderParamsPrefer];
export type GetReportsHeaderParams = {
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
    Prefer?: GetReportsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetReports200 = Reports[];
/**
 * @description Partial Content
*/
export type GetReports206 = any;
/**
 * @description OK
*/
export type GetReportsQueryResponse = Reports[];
export type GetReportsQuery = {
    Response: GetReportsQueryResponse;
    QueryParams: GetReportsQueryParams;
    HeaderParams: GetReportsHeaderParams;
};
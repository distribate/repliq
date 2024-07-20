import type { ConfigAlerts } from "./ConfigAlerts";

 export type GetConfigAlertsQueryParams = {
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
    title?: string;
    /**
     * @type string | undefined, text
    */
    link?: string;
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
export const getConfigAlertsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetConfigAlertsHeaderParamsPrefer = (typeof getConfigAlertsHeaderParamsPrefer)[keyof typeof getConfigAlertsHeaderParamsPrefer];
export type GetConfigAlertsHeaderParams = {
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
    Prefer?: GetConfigAlertsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetConfigAlerts200 = ConfigAlerts[];
/**
 * @description Partial Content
*/
export type GetConfigAlerts206 = any;
/**
 * @description OK
*/
export type GetConfigAlertsQueryResponse = ConfigAlerts[];
export type GetConfigAlertsQuery = {
    Response: GetConfigAlertsQueryResponse;
    QueryParams: GetConfigAlertsQueryParams;
    HeaderParams: GetConfigAlertsHeaderParams;
};
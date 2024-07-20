import type { ConfigAdvertisement } from "./ConfigAdvertisement";

 export type GetConfigAdvertisementQueryParams = {
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
    description?: string;
    /**
     * @type string | undefined, text
    */
    link?: string;
    /**
     * @type string | undefined, text
    */
    owner?: string;
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
export const getConfigAdvertisementHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetConfigAdvertisementHeaderParamsPrefer = (typeof getConfigAdvertisementHeaderParamsPrefer)[keyof typeof getConfigAdvertisementHeaderParamsPrefer];
export type GetConfigAdvertisementHeaderParams = {
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
    Prefer?: GetConfigAdvertisementHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetConfigAdvertisement200 = ConfigAdvertisement[];
/**
 * @description Partial Content
*/
export type GetConfigAdvertisement206 = any;
/**
 * @description OK
*/
export type GetConfigAdvertisementQueryResponse = ConfigAdvertisement[];
export type GetConfigAdvertisementQuery = {
    Response: GetConfigAdvertisementQueryResponse;
    QueryParams: GetConfigAdvertisementQueryParams;
    HeaderParams: GetConfigAdvertisementHeaderParams;
};
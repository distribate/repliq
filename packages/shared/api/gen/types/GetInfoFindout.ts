import type { InfoFindout } from "./InfoFindout";

 export type GetInfoFindoutQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type string | undefined, text
    */
    findout?: string;
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
export const getInfoFindoutHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetInfoFindoutHeaderParamsPrefer = (typeof getInfoFindoutHeaderParamsPrefer)[keyof typeof getInfoFindoutHeaderParamsPrefer];
export type GetInfoFindoutHeaderParams = {
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
    Prefer?: GetInfoFindoutHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetInfoFindout200 = InfoFindout[];
/**
 * @description Partial Content
*/
export type GetInfoFindout206 = any;
/**
 * @description OK
*/
export type GetInfoFindoutQueryResponse = InfoFindout[];
export type GetInfoFindoutQuery = {
    Response: GetInfoFindoutQueryResponse;
    QueryParams: GetInfoFindoutQueryParams;
    HeaderParams: GetInfoFindoutHeaderParams;
};
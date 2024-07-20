import type { Admins } from "./Admins";

 export type GetAdminsQueryParams = {
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
    admin_id?: string;
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
export const getAdminsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetAdminsHeaderParamsPrefer = (typeof getAdminsHeaderParamsPrefer)[keyof typeof getAdminsHeaderParamsPrefer];
export type GetAdminsHeaderParams = {
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
    Prefer?: GetAdminsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetAdmins200 = Admins[];
/**
 * @description Partial Content
*/
export type GetAdmins206 = any;
/**
 * @description OK
*/
export type GetAdminsQueryResponse = Admins[];
export type GetAdminsQuery = {
    Response: GetAdminsQueryResponse;
    QueryParams: GetAdminsQueryParams;
    HeaderParams: GetAdminsHeaderParams;
};
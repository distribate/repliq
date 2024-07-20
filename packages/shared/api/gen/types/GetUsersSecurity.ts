import type { UsersSecurity } from "./UsersSecurity";

 export type GetUsersSecurityQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type string | undefined, text
    */
    email?: string;
    /**
     * @type string | undefined, text
    */
    token?: string;
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
export const getUsersSecurityHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersSecurityHeaderParamsPrefer = (typeof getUsersSecurityHeaderParamsPrefer)[keyof typeof getUsersSecurityHeaderParamsPrefer];
export type GetUsersSecurityHeaderParams = {
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
    Prefer?: GetUsersSecurityHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsersSecurity200 = UsersSecurity[];
/**
 * @description Partial Content
*/
export type GetUsersSecurity206 = any;
/**
 * @description OK
*/
export type GetUsersSecurityQueryResponse = UsersSecurity[];
export type GetUsersSecurityQuery = {
    Response: GetUsersSecurityQueryResponse;
    QueryParams: GetUsersSecurityQueryParams;
    HeaderParams: GetUsersSecurityHeaderParams;
};
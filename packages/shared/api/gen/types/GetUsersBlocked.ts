import type { UsersBlocked } from "./UsersBlocked";

 export type GetUsersBlockedQueryParams = {
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
    user_1?: string;
    /**
     * @type string | undefined, text
    */
    user_2?: string;
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
export const getUsersBlockedHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersBlockedHeaderParamsPrefer = (typeof getUsersBlockedHeaderParamsPrefer)[keyof typeof getUsersBlockedHeaderParamsPrefer];
export type GetUsersBlockedHeaderParams = {
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
    Prefer?: GetUsersBlockedHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsersBlocked200 = UsersBlocked[];
/**
 * @description Partial Content
*/
export type GetUsersBlocked206 = any;
/**
 * @description OK
*/
export type GetUsersBlockedQueryResponse = UsersBlocked[];
export type GetUsersBlockedQuery = {
    Response: GetUsersBlockedQueryResponse;
    QueryParams: GetUsersBlockedQueryParams;
    HeaderParams: GetUsersBlockedHeaderParams;
};
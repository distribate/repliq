import type { UsersStatus } from "./UsersStatus";

 export type GetUsersStatusQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, boolean
    */
    status?: string;
    /**
     * @type string | undefined, text
    */
    user?: string;
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
export const getUsersStatusHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersStatusHeaderParamsPrefer = (typeof getUsersStatusHeaderParamsPrefer)[keyof typeof getUsersStatusHeaderParamsPrefer];
export type GetUsersStatusHeaderParams = {
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
    Prefer?: GetUsersStatusHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsersStatus200 = UsersStatus[];
/**
 * @description Partial Content
*/
export type GetUsersStatus206 = any;
/**
 * @description OK
*/
export type GetUsersStatusQueryResponse = UsersStatus[];
export type GetUsersStatusQuery = {
    Response: GetUsersStatusQueryResponse;
    QueryParams: GetUsersStatusQueryParams;
    HeaderParams: GetUsersStatusHeaderParams;
};
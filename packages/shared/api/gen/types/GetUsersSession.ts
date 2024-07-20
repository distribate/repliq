import type { UsersSession } from "./UsersSession";

 export type GetUsersSessionQueryParams = {
    /**
     * @type string | undefined, timestamp without time zone
    */
    expires_at?: string;
    /**
     * @type string | undefined, text
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, text
    */
    ua?: string;
    /**
     * @type string | undefined, text
    */
    browser?: string;
    /**
     * @type string | undefined, text
    */
    os?: string;
    /**
     * @type string | undefined, text
    */
    cpu?: string;
    /**
     * @type string | undefined, boolean
    */
    isBot?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    ip?: string;
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
export const getUsersSessionHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersSessionHeaderParamsPrefer = (typeof getUsersSessionHeaderParamsPrefer)[keyof typeof getUsersSessionHeaderParamsPrefer];
export type GetUsersSessionHeaderParams = {
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
    Prefer?: GetUsersSessionHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsersSession200 = UsersSession[];
/**
 * @description Partial Content
*/
export type GetUsersSession206 = any;
/**
 * @description OK
*/
export type GetUsersSessionQueryResponse = UsersSession[];
export type GetUsersSessionQuery = {
    Response: GetUsersSessionQueryResponse;
    QueryParams: GetUsersSessionQueryParams;
    HeaderParams: GetUsersSessionHeaderParams;
};
import type { ThreadsUsers } from "./ThreadsUsers";

 export type GetThreadsUsersQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
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
export const getThreadsUsersHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetThreadsUsersHeaderParamsPrefer = (typeof getThreadsUsersHeaderParamsPrefer)[keyof typeof getThreadsUsersHeaderParamsPrefer];
export type GetThreadsUsersHeaderParams = {
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
    Prefer?: GetThreadsUsersHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetThreadsUsers200 = ThreadsUsers[];
/**
 * @description Partial Content
*/
export type GetThreadsUsers206 = any;
/**
 * @description OK
*/
export type GetThreadsUsersQueryResponse = ThreadsUsers[];
export type GetThreadsUsersQuery = {
    Response: GetThreadsUsersQueryResponse;
    QueryParams: GetThreadsUsersQueryParams;
    HeaderParams: GetThreadsUsersHeaderParams;
};
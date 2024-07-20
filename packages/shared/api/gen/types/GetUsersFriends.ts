import type { UsersFriends } from "./UsersFriends";

 export type GetUsersFriendsQueryParams = {
    /**
     * @type string | undefined, uuid
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
export const getUsersFriendsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersFriendsHeaderParamsPrefer = (typeof getUsersFriendsHeaderParamsPrefer)[keyof typeof getUsersFriendsHeaderParamsPrefer];
export type GetUsersFriendsHeaderParams = {
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
    Prefer?: GetUsersFriendsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsersFriends200 = UsersFriends[];
/**
 * @description Partial Content
*/
export type GetUsersFriends206 = any;
/**
 * @description OK
*/
export type GetUsersFriendsQueryResponse = UsersFriends[];
export type GetUsersFriendsQuery = {
    Response: GetUsersFriendsQueryResponse;
    QueryParams: GetUsersFriendsQueryParams;
    HeaderParams: GetUsersFriendsHeaderParams;
};
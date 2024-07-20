import type { Users } from "./Users";

 export type GetUsersQueryParams = {
    /**
     * @type string | undefined, boolean
    */
    acceptrules?: string;
    /**
     * @type string | undefined, date
    */
    birthday?: string;
    /**
     * @type string | undefined, timestamp without time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, text
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    nickname?: string;
    /**
     * @type string | undefined, text
    */
    status?: string;
    /**
     * @type string | undefined, text
    */
    uuid?: string;
    /**
     * @type string | undefined, text
    */
    cover_image?: string;
    /**
     * @type string | undefined, text
    */
    name_color?: string;
    /**
     * @type string | undefined, public.profile_visibility
    */
    visibility?: string;
    /**
     * @type string | undefined, text
    */
    real_name?: string;
    /**
     * @type string | undefined, jsonb
    */
    preferences?: string;
    /**
     * @type string | undefined, text
    */
    favorite_item?: string;
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
export const getUsersHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersHeaderParamsPrefer = (typeof getUsersHeaderParamsPrefer)[keyof typeof getUsersHeaderParamsPrefer];
export type GetUsersHeaderParams = {
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
    Prefer?: GetUsersHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsers200 = Users[];
/**
 * @description Partial Content
*/
export type GetUsers206 = any;
/**
 * @description OK
*/
export type GetUsersQueryResponse = Users[];
export type GetUsersQuery = {
    Response: GetUsersQueryResponse;
    QueryParams: GetUsersQueryParams;
    HeaderParams: GetUsersHeaderParams;
};
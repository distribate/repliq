import type { UsersSettings } from "./UsersSettings";

 export type GetUsersSettingsQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_id?: string;
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
export const getUsersSettingsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetUsersSettingsHeaderParamsPrefer = (typeof getUsersSettingsHeaderParamsPrefer)[keyof typeof getUsersSettingsHeaderParamsPrefer];
export type GetUsersSettingsHeaderParams = {
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
    Prefer?: GetUsersSettingsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetUsersSettings200 = UsersSettings[];
/**
 * @description Partial Content
*/
export type GetUsersSettings206 = any;
/**
 * @description OK
*/
export type GetUsersSettingsQueryResponse = UsersSettings[];
export type GetUsersSettingsQuery = {
    Response: GetUsersSettingsQueryResponse;
    QueryParams: GetUsersSettingsQueryParams;
    HeaderParams: GetUsersSettingsHeaderParams;
};
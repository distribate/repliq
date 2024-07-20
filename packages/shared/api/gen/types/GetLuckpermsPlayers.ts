import type { LuckpermsPlayers } from "./LuckpermsPlayers";

 export type GetLuckpermsPlayersQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    uuid?: string;
    /**
     * @type string | undefined, character varying
    */
    username?: string;
    /**
     * @type string | undefined, character varying
    */
    primary_group?: string;
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
export const getLuckpermsPlayersHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetLuckpermsPlayersHeaderParamsPrefer = (typeof getLuckpermsPlayersHeaderParamsPrefer)[keyof typeof getLuckpermsPlayersHeaderParamsPrefer];
export type GetLuckpermsPlayersHeaderParams = {
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
    Prefer?: GetLuckpermsPlayersHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetLuckpermsPlayers200 = LuckpermsPlayers[];
/**
 * @description Partial Content
*/
export type GetLuckpermsPlayers206 = any;
/**
 * @description OK
*/
export type GetLuckpermsPlayersQueryResponse = LuckpermsPlayers[];
export type GetLuckpermsPlayersQuery = {
    Response: GetLuckpermsPlayersQueryResponse;
    QueryParams: GetLuckpermsPlayersQueryParams;
    HeaderParams: GetLuckpermsPlayersHeaderParams;
};
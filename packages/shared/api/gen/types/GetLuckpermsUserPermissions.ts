import type { LuckpermsUserPermissions } from "./LuckpermsUserPermissions";

 export type GetLuckpermsUserPermissionsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    id?: string;
    /**
     * @type string | undefined, character varying
    */
    uuid?: string;
    /**
     * @type string | undefined, character varying
    */
    permission?: string;
    /**
     * @type string | undefined, boolean
    */
    value?: string;
    /**
     * @type string | undefined, character varying
    */
    server?: string;
    /**
     * @type string | undefined, character varying
    */
    world?: string;
    /**
     * @type string | undefined, bigint
    */
    expiry?: string;
    /**
     * @type string | undefined, character varying
    */
    contexts?: string;
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
export const getLuckpermsUserPermissionsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetLuckpermsUserPermissionsHeaderParamsPrefer = (typeof getLuckpermsUserPermissionsHeaderParamsPrefer)[keyof typeof getLuckpermsUserPermissionsHeaderParamsPrefer];
export type GetLuckpermsUserPermissionsHeaderParams = {
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
    Prefer?: GetLuckpermsUserPermissionsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetLuckpermsUserPermissions200 = LuckpermsUserPermissions[];
/**
 * @description Partial Content
*/
export type GetLuckpermsUserPermissions206 = any;
/**
 * @description OK
*/
export type GetLuckpermsUserPermissionsQueryResponse = LuckpermsUserPermissions[];
export type GetLuckpermsUserPermissionsQuery = {
    Response: GetLuckpermsUserPermissionsQueryResponse;
    QueryParams: GetLuckpermsUserPermissionsQueryParams;
    HeaderParams: GetLuckpermsUserPermissionsHeaderParams;
};
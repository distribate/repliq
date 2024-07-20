import type { LuckpermsGroupPermissions } from "./LuckpermsGroupPermissions";

 export type GetLuckpermsGroupPermissionsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    id?: string;
    /**
     * @type string | undefined, character varying
    */
    name?: string;
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
export const getLuckpermsGroupPermissionsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetLuckpermsGroupPermissionsHeaderParamsPrefer = (typeof getLuckpermsGroupPermissionsHeaderParamsPrefer)[keyof typeof getLuckpermsGroupPermissionsHeaderParamsPrefer];
export type GetLuckpermsGroupPermissionsHeaderParams = {
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
    Prefer?: GetLuckpermsGroupPermissionsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetLuckpermsGroupPermissions200 = LuckpermsGroupPermissions[];
/**
 * @description Partial Content
*/
export type GetLuckpermsGroupPermissions206 = any;
/**
 * @description OK
*/
export type GetLuckpermsGroupPermissionsQueryResponse = LuckpermsGroupPermissions[];
export type GetLuckpermsGroupPermissionsQuery = {
    Response: GetLuckpermsGroupPermissionsQueryResponse;
    QueryParams: GetLuckpermsGroupPermissionsQueryParams;
    HeaderParams: GetLuckpermsGroupPermissionsHeaderParams;
};
import type { ConfigMinecraftItems } from "./ConfigMinecraftItems";

 export type GetConfigMinecraftItemsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, text
    */
    image?: string;
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
export const getConfigMinecraftItemsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetConfigMinecraftItemsHeaderParamsPrefer = (typeof getConfigMinecraftItemsHeaderParamsPrefer)[keyof typeof getConfigMinecraftItemsHeaderParamsPrefer];
export type GetConfigMinecraftItemsHeaderParams = {
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
    Prefer?: GetConfigMinecraftItemsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetConfigMinecraftItems200 = ConfigMinecraftItems[];
/**
 * @description Partial Content
*/
export type GetConfigMinecraftItems206 = any;
/**
 * @description OK
*/
export type GetConfigMinecraftItemsQueryResponse = ConfigMinecraftItems[];
export type GetConfigMinecraftItemsQuery = {
    Response: GetConfigMinecraftItemsQueryResponse;
    QueryParams: GetConfigMinecraftItemsQueryParams;
    HeaderParams: GetConfigMinecraftItemsHeaderParams;
};
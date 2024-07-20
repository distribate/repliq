import type { ConfigMinecraftFacts } from "./ConfigMinecraftFacts";

 export type GetConfigMinecraftFactsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    fact?: string;
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
export const getConfigMinecraftFactsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetConfigMinecraftFactsHeaderParamsPrefer = (typeof getConfigMinecraftFactsHeaderParamsPrefer)[keyof typeof getConfigMinecraftFactsHeaderParamsPrefer];
export type GetConfigMinecraftFactsHeaderParams = {
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
    Prefer?: GetConfigMinecraftFactsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetConfigMinecraftFacts200 = ConfigMinecraftFacts[];
/**
 * @description Partial Content
*/
export type GetConfigMinecraftFacts206 = any;
/**
 * @description OK
*/
export type GetConfigMinecraftFactsQueryResponse = ConfigMinecraftFacts[];
export type GetConfigMinecraftFactsQuery = {
    Response: GetConfigMinecraftFactsQueryResponse;
    QueryParams: GetConfigMinecraftFactsQueryParams;
    HeaderParams: GetConfigMinecraftFactsHeaderParams;
};
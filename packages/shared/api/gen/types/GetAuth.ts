import type { Auth } from "./Auth";

 export type GetAuthQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    NICKNAME?: string;
    /**
     * @type string | undefined, character varying
    */
    LOWERCASENICKNAME?: string;
    /**
     * @type string | undefined, character varying
    */
    HASH?: string;
    /**
     * @type string | undefined, character varying
    */
    IP?: string;
    /**
     * @type string | undefined, character varying
    */
    TOTPTOKEN?: string;
    /**
     * @type string | undefined, bigint
    */
    REGDATE?: string;
    /**
     * @type string | undefined, character varying
    */
    UUID?: string;
    /**
     * @type string | undefined, character varying
    */
    PREMIUMUUID?: string;
    /**
     * @type string | undefined, character varying
    */
    LOGINIP?: string;
    /**
     * @type string | undefined, bigint
    */
    LOGINDATE?: string;
    /**
     * @type string | undefined, bigint
    */
    ISSUEDTIME?: string;
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
export const getAuthHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetAuthHeaderParamsPrefer = (typeof getAuthHeaderParamsPrefer)[keyof typeof getAuthHeaderParamsPrefer];
export type GetAuthHeaderParams = {
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
    Prefer?: GetAuthHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetAuth200 = Auth[];
/**
 * @description Partial Content
*/
export type GetAuth206 = any;
/**
 * @description OK
*/
export type GetAuthQueryResponse = Auth[];
export type GetAuthQuery = {
    Response: GetAuthQueryResponse;
    QueryParams: GetAuthQueryParams;
    HeaderParams: GetAuthHeaderParams;
};
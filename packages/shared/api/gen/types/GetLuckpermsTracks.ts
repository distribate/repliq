import type { LuckpermsTracks } from "./LuckpermsTracks";

 export type GetLuckpermsTracksQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    name?: string;
    /**
     * @type string | undefined, text
    */
    groups?: string;
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
export const getLuckpermsTracksHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetLuckpermsTracksHeaderParamsPrefer = (typeof getLuckpermsTracksHeaderParamsPrefer)[keyof typeof getLuckpermsTracksHeaderParamsPrefer];
export type GetLuckpermsTracksHeaderParams = {
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
    Prefer?: GetLuckpermsTracksHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetLuckpermsTracks200 = LuckpermsTracks[];
/**
 * @description Partial Content
*/
export type GetLuckpermsTracks206 = any;
/**
 * @description OK
*/
export type GetLuckpermsTracksQueryResponse = LuckpermsTracks[];
export type GetLuckpermsTracksQuery = {
    Response: GetLuckpermsTracksQueryResponse;
    QueryParams: GetLuckpermsTracksQueryParams;
    HeaderParams: GetLuckpermsTracksHeaderParams;
};
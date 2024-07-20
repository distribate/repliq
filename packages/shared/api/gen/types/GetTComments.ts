import type { TComments } from "./TComments";

 export type GetTCommentsQueryParams = {
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    content?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
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
export const getTCommentsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetTCommentsHeaderParamsPrefer = (typeof getTCommentsHeaderParamsPrefer)[keyof typeof getTCommentsHeaderParamsPrefer];
export type GetTCommentsHeaderParams = {
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
    Prefer?: GetTCommentsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetTComments200 = TComments[];
/**
 * @description Partial Content
*/
export type GetTComments206 = any;
/**
 * @description OK
*/
export type GetTCommentsQueryResponse = TComments[];
export type GetTCommentsQuery = {
    Response: GetTCommentsQueryResponse;
    QueryParams: GetTCommentsQueryParams;
    HeaderParams: GetTCommentsHeaderParams;
};
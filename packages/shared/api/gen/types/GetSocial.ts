import type { Social } from "./Social";

 export type GetSocialQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    LOWERCASENICKNAME?: string;
    /**
     * @type string | undefined, bigint
    */
    VK_ID?: string;
    /**
     * @type string | undefined, bigint
    */
    TELEGRAM_ID?: string;
    /**
     * @type string | undefined, bigint
    */
    DISCORD_ID?: string;
    /**
     * @type string | undefined, boolean
    */
    BLOCKED?: string;
    /**
     * @type string | undefined, boolean
    */
    TOTP_ENABLED?: string;
    /**
     * @type string | undefined, boolean
    */
    NOTIFY_ENABLED?: string;
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
export const getSocialHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetSocialHeaderParamsPrefer = (typeof getSocialHeaderParamsPrefer)[keyof typeof getSocialHeaderParamsPrefer];
export type GetSocialHeaderParams = {
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
    Prefer?: GetSocialHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetSocial200 = Social[];
/**
 * @description Partial Content
*/
export type GetSocial206 = any;
/**
 * @description OK
*/
export type GetSocialQueryResponse = Social[];
export type GetSocialQuery = {
    Response: GetSocialQueryResponse;
    QueryParams: GetSocialQueryParams;
    HeaderParams: GetSocialHeaderParams;
};
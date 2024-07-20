export type DeleteAuthQueryParams = {
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
};
export const deleteAuthHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteAuthHeaderParamsPrefer = (typeof deleteAuthHeaderParamsPrefer)[keyof typeof deleteAuthHeaderParamsPrefer];
export type DeleteAuthHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteAuthHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteAuth204 = any;
export type DeleteAuthMutationResponse = any;
export type DeleteAuthMutation = {
    Response: DeleteAuthMutationResponse;
    QueryParams: DeleteAuthQueryParams;
    HeaderParams: DeleteAuthHeaderParams;
};
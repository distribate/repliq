import { Auth } from "./Auth";

 export type PatchAuthQueryParams = {
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
export const patchAuthHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchAuthHeaderParamsPrefer = (typeof patchAuthHeaderParamsPrefer)[keyof typeof patchAuthHeaderParamsPrefer];
export type PatchAuthHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchAuthHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchAuth204 = any;
/**
 * @description AUTH
*/
export type PatchAuthMutationRequest = Auth;
export type PatchAuthMutationResponse = any;
export type PatchAuthMutation = {
    Response: PatchAuthMutationResponse;
    Request: PatchAuthMutationRequest;
    QueryParams: PatchAuthQueryParams;
    HeaderParams: PatchAuthHeaderParams;
};
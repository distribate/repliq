import { Social } from "./Social";

 export type PatchSocialQueryParams = {
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
};
export const patchSocialHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchSocialHeaderParamsPrefer = (typeof patchSocialHeaderParamsPrefer)[keyof typeof patchSocialHeaderParamsPrefer];
export type PatchSocialHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchSocialHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchSocial204 = any;
/**
 * @description SOCIAL
*/
export type PatchSocialMutationRequest = Social;
export type PatchSocialMutationResponse = any;
export type PatchSocialMutation = {
    Response: PatchSocialMutationResponse;
    Request: PatchSocialMutationRequest;
    QueryParams: PatchSocialQueryParams;
    HeaderParams: PatchSocialHeaderParams;
};
export type DeleteSocialQueryParams = {
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
export const deleteSocialHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteSocialHeaderParamsPrefer = (typeof deleteSocialHeaderParamsPrefer)[keyof typeof deleteSocialHeaderParamsPrefer];
export type DeleteSocialHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteSocialHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteSocial204 = any;
export type DeleteSocialMutationResponse = any;
export type DeleteSocialMutation = {
    Response: DeleteSocialMutationResponse;
    QueryParams: DeleteSocialQueryParams;
    HeaderParams: DeleteSocialHeaderParams;
};
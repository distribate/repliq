import { ConfigAdvertisement } from "./ConfigAdvertisement";

 export type PatchConfigAdvertisementQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, text
    */
    link?: string;
    /**
     * @type string | undefined, text
    */
    owner?: string;
};
export const patchConfigAdvertisementHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchConfigAdvertisementHeaderParamsPrefer = (typeof patchConfigAdvertisementHeaderParamsPrefer)[keyof typeof patchConfigAdvertisementHeaderParamsPrefer];
export type PatchConfigAdvertisementHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchConfigAdvertisementHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchConfigAdvertisement204 = any;
/**
 * @description config_advertisement
*/
export type PatchConfigAdvertisementMutationRequest = ConfigAdvertisement;
export type PatchConfigAdvertisementMutationResponse = any;
export type PatchConfigAdvertisementMutation = {
    Response: PatchConfigAdvertisementMutationResponse;
    Request: PatchConfigAdvertisementMutationRequest;
    QueryParams: PatchConfigAdvertisementQueryParams;
    HeaderParams: PatchConfigAdvertisementHeaderParams;
};
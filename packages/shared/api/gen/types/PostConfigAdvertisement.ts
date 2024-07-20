import { ConfigAdvertisement } from "./ConfigAdvertisement";

 export type PostConfigAdvertisementQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postConfigAdvertisementHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostConfigAdvertisementHeaderParamsPrefer = (typeof postConfigAdvertisementHeaderParamsPrefer)[keyof typeof postConfigAdvertisementHeaderParamsPrefer];
export type PostConfigAdvertisementHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostConfigAdvertisementHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostConfigAdvertisement201 = any;
/**
 * @description config_advertisement
*/
export type PostConfigAdvertisementMutationRequest = ConfigAdvertisement;
export type PostConfigAdvertisementMutationResponse = any;
export type PostConfigAdvertisementMutation = {
    Response: PostConfigAdvertisementMutationResponse;
    Request: PostConfigAdvertisementMutationRequest;
    QueryParams: PostConfigAdvertisementQueryParams;
    HeaderParams: PostConfigAdvertisementHeaderParams;
};
export type DeleteConfigAdvertisementQueryParams = {
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
export const deleteConfigAdvertisementHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteConfigAdvertisementHeaderParamsPrefer = (typeof deleteConfigAdvertisementHeaderParamsPrefer)[keyof typeof deleteConfigAdvertisementHeaderParamsPrefer];
export type DeleteConfigAdvertisementHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteConfigAdvertisementHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteConfigAdvertisement204 = any;
export type DeleteConfigAdvertisementMutationResponse = any;
export type DeleteConfigAdvertisementMutation = {
    Response: DeleteConfigAdvertisementMutationResponse;
    QueryParams: DeleteConfigAdvertisementQueryParams;
    HeaderParams: DeleteConfigAdvertisementHeaderParams;
};
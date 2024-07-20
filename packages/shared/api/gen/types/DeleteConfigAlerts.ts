export type DeleteConfigAlertsQueryParams = {
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
    link?: string;
};
export const deleteConfigAlertsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteConfigAlertsHeaderParamsPrefer = (typeof deleteConfigAlertsHeaderParamsPrefer)[keyof typeof deleteConfigAlertsHeaderParamsPrefer];
export type DeleteConfigAlertsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteConfigAlertsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteConfigAlerts204 = any;
export type DeleteConfigAlertsMutationResponse = any;
export type DeleteConfigAlertsMutation = {
    Response: DeleteConfigAlertsMutationResponse;
    QueryParams: DeleteConfigAlertsQueryParams;
    HeaderParams: DeleteConfigAlertsHeaderParams;
};
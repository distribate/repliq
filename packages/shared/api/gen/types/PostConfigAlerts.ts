import { ConfigAlerts } from "./ConfigAlerts";

 export type PostConfigAlertsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postConfigAlertsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostConfigAlertsHeaderParamsPrefer = (typeof postConfigAlertsHeaderParamsPrefer)[keyof typeof postConfigAlertsHeaderParamsPrefer];
export type PostConfigAlertsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostConfigAlertsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostConfigAlerts201 = any;
/**
 * @description config_alerts
*/
export type PostConfigAlertsMutationRequest = ConfigAlerts;
export type PostConfigAlertsMutationResponse = any;
export type PostConfigAlertsMutation = {
    Response: PostConfigAlertsMutationResponse;
    Request: PostConfigAlertsMutationRequest;
    QueryParams: PostConfigAlertsQueryParams;
    HeaderParams: PostConfigAlertsHeaderParams;
};
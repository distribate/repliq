import { ConfigAlerts } from "./ConfigAlerts";

 export type PatchConfigAlertsQueryParams = {
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
export const patchConfigAlertsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchConfigAlertsHeaderParamsPrefer = (typeof patchConfigAlertsHeaderParamsPrefer)[keyof typeof patchConfigAlertsHeaderParamsPrefer];
export type PatchConfigAlertsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchConfigAlertsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchConfigAlerts204 = any;
/**
 * @description config_alerts
*/
export type PatchConfigAlertsMutationRequest = ConfigAlerts;
export type PatchConfigAlertsMutationResponse = any;
export type PatchConfigAlertsMutation = {
    Response: PatchConfigAlertsMutationResponse;
    Request: PatchConfigAlertsMutationRequest;
    QueryParams: PatchConfigAlertsQueryParams;
    HeaderParams: PatchConfigAlertsHeaderParams;
};
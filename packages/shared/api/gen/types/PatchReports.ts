import { Reports } from "./Reports";

 export type PatchReportsQueryParams = {
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
    user_nickname?: string;
    /**
     * @type string | undefined, json
    */
    reported_item?: string;
    /**
     * @type string | undefined, public.report_reason
    */
    reason?: string;
    /**
     * @type string | undefined, text
    */
    target_user_nickname?: string;
    /**
     * @type string | undefined, public.report_type
    */
    report_type?: string;
};
export const patchReportsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchReportsHeaderParamsPrefer = (typeof patchReportsHeaderParamsPrefer)[keyof typeof patchReportsHeaderParamsPrefer];
export type PatchReportsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchReportsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchReports204 = any;
/**
 * @description reports
*/
export type PatchReportsMutationRequest = Reports;
export type PatchReportsMutationResponse = any;
export type PatchReportsMutation = {
    Response: PatchReportsMutationResponse;
    Request: PatchReportsMutationRequest;
    QueryParams: PatchReportsQueryParams;
    HeaderParams: PatchReportsHeaderParams;
};
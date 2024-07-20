export type DeleteReportsQueryParams = {
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
export const deleteReportsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteReportsHeaderParamsPrefer = (typeof deleteReportsHeaderParamsPrefer)[keyof typeof deleteReportsHeaderParamsPrefer];
export type DeleteReportsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteReportsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteReports204 = any;
export type DeleteReportsMutationResponse = any;
export type DeleteReportsMutation = {
    Response: DeleteReportsMutationResponse;
    QueryParams: DeleteReportsQueryParams;
    HeaderParams: DeleteReportsHeaderParams;
};
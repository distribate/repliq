import { Reports } from "./Reports";

 export type PostReportsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postReportsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostReportsHeaderParamsPrefer = (typeof postReportsHeaderParamsPrefer)[keyof typeof postReportsHeaderParamsPrefer];
export type PostReportsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostReportsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostReports201 = any;
/**
 * @description reports
*/
export type PostReportsMutationRequest = Reports;
export type PostReportsMutationResponse = any;
export type PostReportsMutation = {
    Response: PostReportsMutationResponse;
    Request: PostReportsMutationRequest;
    QueryParams: PostReportsQueryParams;
    HeaderParams: PostReportsHeaderParams;
};
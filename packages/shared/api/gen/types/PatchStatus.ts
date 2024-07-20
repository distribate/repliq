import { Status } from "./Status";

 export type PatchStatusQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, boolean
    */
    value?: string;
};
export const patchStatusHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchStatusHeaderParamsPrefer = (typeof patchStatusHeaderParamsPrefer)[keyof typeof patchStatusHeaderParamsPrefer];
export type PatchStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchStatusHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchStatus204 = any;
/**
 * @description status
*/
export type PatchStatusMutationRequest = Status;
export type PatchStatusMutationResponse = any;
export type PatchStatusMutation = {
    Response: PatchStatusMutationResponse;
    Request: PatchStatusMutationRequest;
    QueryParams: PatchStatusQueryParams;
    HeaderParams: PatchStatusHeaderParams;
};
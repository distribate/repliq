import { LuckpermsGroups } from "./LuckpermsGroups";

 export type PatchLuckpermsGroupsQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    name?: string;
};
export const patchLuckpermsGroupsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchLuckpermsGroupsHeaderParamsPrefer = (typeof patchLuckpermsGroupsHeaderParamsPrefer)[keyof typeof patchLuckpermsGroupsHeaderParamsPrefer];
export type PatchLuckpermsGroupsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchLuckpermsGroupsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchLuckpermsGroups204 = any;
/**
 * @description luckperms_groups
*/
export type PatchLuckpermsGroupsMutationRequest = LuckpermsGroups;
export type PatchLuckpermsGroupsMutationResponse = any;
export type PatchLuckpermsGroupsMutation = {
    Response: PatchLuckpermsGroupsMutationResponse;
    Request: PatchLuckpermsGroupsMutationRequest;
    QueryParams: PatchLuckpermsGroupsQueryParams;
    HeaderParams: PatchLuckpermsGroupsHeaderParams;
};
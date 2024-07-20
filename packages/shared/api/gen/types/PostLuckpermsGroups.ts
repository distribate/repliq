import { LuckpermsGroups } from "./LuckpermsGroups";

 export type PostLuckpermsGroupsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postLuckpermsGroupsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostLuckpermsGroupsHeaderParamsPrefer = (typeof postLuckpermsGroupsHeaderParamsPrefer)[keyof typeof postLuckpermsGroupsHeaderParamsPrefer];
export type PostLuckpermsGroupsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostLuckpermsGroupsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostLuckpermsGroups201 = any;
/**
 * @description luckperms_groups
*/
export type PostLuckpermsGroupsMutationRequest = LuckpermsGroups;
export type PostLuckpermsGroupsMutationResponse = any;
export type PostLuckpermsGroupsMutation = {
    Response: PostLuckpermsGroupsMutationResponse;
    Request: PostLuckpermsGroupsMutationRequest;
    QueryParams: PostLuckpermsGroupsQueryParams;
    HeaderParams: PostLuckpermsGroupsHeaderParams;
};
import { LuckpermsGroupPermissions } from "./LuckpermsGroupPermissions";

 export type PostLuckpermsGroupPermissionsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postLuckpermsGroupPermissionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostLuckpermsGroupPermissionsHeaderParamsPrefer = (typeof postLuckpermsGroupPermissionsHeaderParamsPrefer)[keyof typeof postLuckpermsGroupPermissionsHeaderParamsPrefer];
export type PostLuckpermsGroupPermissionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostLuckpermsGroupPermissionsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostLuckpermsGroupPermissions201 = any;
/**
 * @description luckperms_group_permissions
*/
export type PostLuckpermsGroupPermissionsMutationRequest = LuckpermsGroupPermissions;
export type PostLuckpermsGroupPermissionsMutationResponse = any;
export type PostLuckpermsGroupPermissionsMutation = {
    Response: PostLuckpermsGroupPermissionsMutationResponse;
    Request: PostLuckpermsGroupPermissionsMutationRequest;
    QueryParams: PostLuckpermsGroupPermissionsQueryParams;
    HeaderParams: PostLuckpermsGroupPermissionsHeaderParams;
};
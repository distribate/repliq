import { LuckpermsUserPermissions } from "./LuckpermsUserPermissions";

 export type PostLuckpermsUserPermissionsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postLuckpermsUserPermissionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostLuckpermsUserPermissionsHeaderParamsPrefer = (typeof postLuckpermsUserPermissionsHeaderParamsPrefer)[keyof typeof postLuckpermsUserPermissionsHeaderParamsPrefer];
export type PostLuckpermsUserPermissionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostLuckpermsUserPermissionsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostLuckpermsUserPermissions201 = any;
/**
 * @description luckperms_user_permissions
*/
export type PostLuckpermsUserPermissionsMutationRequest = LuckpermsUserPermissions;
export type PostLuckpermsUserPermissionsMutationResponse = any;
export type PostLuckpermsUserPermissionsMutation = {
    Response: PostLuckpermsUserPermissionsMutationResponse;
    Request: PostLuckpermsUserPermissionsMutationRequest;
    QueryParams: PostLuckpermsUserPermissionsQueryParams;
    HeaderParams: PostLuckpermsUserPermissionsHeaderParams;
};
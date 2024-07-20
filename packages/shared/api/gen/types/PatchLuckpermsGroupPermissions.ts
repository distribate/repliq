import { LuckpermsGroupPermissions } from "./LuckpermsGroupPermissions";

 export type PatchLuckpermsGroupPermissionsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    id?: string;
    /**
     * @type string | undefined, character varying
    */
    name?: string;
    /**
     * @type string | undefined, character varying
    */
    permission?: string;
    /**
     * @type string | undefined, boolean
    */
    value?: string;
    /**
     * @type string | undefined, character varying
    */
    server?: string;
    /**
     * @type string | undefined, character varying
    */
    world?: string;
    /**
     * @type string | undefined, bigint
    */
    expiry?: string;
    /**
     * @type string | undefined, character varying
    */
    contexts?: string;
};
export const patchLuckpermsGroupPermissionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchLuckpermsGroupPermissionsHeaderParamsPrefer = (typeof patchLuckpermsGroupPermissionsHeaderParamsPrefer)[keyof typeof patchLuckpermsGroupPermissionsHeaderParamsPrefer];
export type PatchLuckpermsGroupPermissionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchLuckpermsGroupPermissionsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchLuckpermsGroupPermissions204 = any;
/**
 * @description luckperms_group_permissions
*/
export type PatchLuckpermsGroupPermissionsMutationRequest = LuckpermsGroupPermissions;
export type PatchLuckpermsGroupPermissionsMutationResponse = any;
export type PatchLuckpermsGroupPermissionsMutation = {
    Response: PatchLuckpermsGroupPermissionsMutationResponse;
    Request: PatchLuckpermsGroupPermissionsMutationRequest;
    QueryParams: PatchLuckpermsGroupPermissionsQueryParams;
    HeaderParams: PatchLuckpermsGroupPermissionsHeaderParams;
};
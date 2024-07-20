import { LuckpermsUserPermissions } from "./LuckpermsUserPermissions";

 export type PatchLuckpermsUserPermissionsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    id?: string;
    /**
     * @type string | undefined, character varying
    */
    uuid?: string;
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
export const patchLuckpermsUserPermissionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchLuckpermsUserPermissionsHeaderParamsPrefer = (typeof patchLuckpermsUserPermissionsHeaderParamsPrefer)[keyof typeof patchLuckpermsUserPermissionsHeaderParamsPrefer];
export type PatchLuckpermsUserPermissionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchLuckpermsUserPermissionsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchLuckpermsUserPermissions204 = any;
/**
 * @description luckperms_user_permissions
*/
export type PatchLuckpermsUserPermissionsMutationRequest = LuckpermsUserPermissions;
export type PatchLuckpermsUserPermissionsMutationResponse = any;
export type PatchLuckpermsUserPermissionsMutation = {
    Response: PatchLuckpermsUserPermissionsMutationResponse;
    Request: PatchLuckpermsUserPermissionsMutationRequest;
    QueryParams: PatchLuckpermsUserPermissionsQueryParams;
    HeaderParams: PatchLuckpermsUserPermissionsHeaderParams;
};
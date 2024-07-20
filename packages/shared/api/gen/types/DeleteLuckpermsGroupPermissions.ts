export type DeleteLuckpermsGroupPermissionsQueryParams = {
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
export const deleteLuckpermsGroupPermissionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteLuckpermsGroupPermissionsHeaderParamsPrefer = (typeof deleteLuckpermsGroupPermissionsHeaderParamsPrefer)[keyof typeof deleteLuckpermsGroupPermissionsHeaderParamsPrefer];
export type DeleteLuckpermsGroupPermissionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteLuckpermsGroupPermissionsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteLuckpermsGroupPermissions204 = any;
export type DeleteLuckpermsGroupPermissionsMutationResponse = any;
export type DeleteLuckpermsGroupPermissionsMutation = {
    Response: DeleteLuckpermsGroupPermissionsMutationResponse;
    QueryParams: DeleteLuckpermsGroupPermissionsQueryParams;
    HeaderParams: DeleteLuckpermsGroupPermissionsHeaderParams;
};
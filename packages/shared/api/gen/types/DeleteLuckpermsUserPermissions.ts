export type DeleteLuckpermsUserPermissionsQueryParams = {
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
export const deleteLuckpermsUserPermissionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteLuckpermsUserPermissionsHeaderParamsPrefer = (typeof deleteLuckpermsUserPermissionsHeaderParamsPrefer)[keyof typeof deleteLuckpermsUserPermissionsHeaderParamsPrefer];
export type DeleteLuckpermsUserPermissionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteLuckpermsUserPermissionsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteLuckpermsUserPermissions204 = any;
export type DeleteLuckpermsUserPermissionsMutationResponse = any;
export type DeleteLuckpermsUserPermissionsMutation = {
    Response: DeleteLuckpermsUserPermissionsMutationResponse;
    QueryParams: DeleteLuckpermsUserPermissionsQueryParams;
    HeaderParams: DeleteLuckpermsUserPermissionsHeaderParams;
};
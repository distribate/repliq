export type DeleteLuckpermsActionsQueryParams = {
    /**
     * @type string | undefined, integer
    */
    id?: string;
    /**
     * @type string | undefined, bigint
    */
    time?: string;
    /**
     * @type string | undefined, character varying
    */
    actor_uuid?: string;
    /**
     * @type string | undefined, character varying
    */
    actor_name?: string;
    /**
     * @type string | undefined, character
    */
    type?: string;
    /**
     * @type string | undefined, character varying
    */
    acted_uuid?: string;
    /**
     * @type string | undefined, character varying
    */
    acted_name?: string;
    /**
     * @type string | undefined, character varying
    */
    action?: string;
};
export const deleteLuckpermsActionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteLuckpermsActionsHeaderParamsPrefer = (typeof deleteLuckpermsActionsHeaderParamsPrefer)[keyof typeof deleteLuckpermsActionsHeaderParamsPrefer];
export type DeleteLuckpermsActionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteLuckpermsActionsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteLuckpermsActions204 = any;
export type DeleteLuckpermsActionsMutationResponse = any;
export type DeleteLuckpermsActionsMutation = {
    Response: DeleteLuckpermsActionsMutationResponse;
    QueryParams: DeleteLuckpermsActionsQueryParams;
    HeaderParams: DeleteLuckpermsActionsHeaderParams;
};
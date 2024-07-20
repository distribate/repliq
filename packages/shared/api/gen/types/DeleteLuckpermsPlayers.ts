export type DeleteLuckpermsPlayersQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    uuid?: string;
    /**
     * @type string | undefined, character varying
    */
    username?: string;
    /**
     * @type string | undefined, character varying
    */
    primary_group?: string;
};
export const deleteLuckpermsPlayersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteLuckpermsPlayersHeaderParamsPrefer = (typeof deleteLuckpermsPlayersHeaderParamsPrefer)[keyof typeof deleteLuckpermsPlayersHeaderParamsPrefer];
export type DeleteLuckpermsPlayersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteLuckpermsPlayersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteLuckpermsPlayers204 = any;
export type DeleteLuckpermsPlayersMutationResponse = any;
export type DeleteLuckpermsPlayersMutation = {
    Response: DeleteLuckpermsPlayersMutationResponse;
    QueryParams: DeleteLuckpermsPlayersQueryParams;
    HeaderParams: DeleteLuckpermsPlayersHeaderParams;
};
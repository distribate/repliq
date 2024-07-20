export type DeleteLuckpermsGroupsQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    name?: string;
};
export const deleteLuckpermsGroupsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteLuckpermsGroupsHeaderParamsPrefer = (typeof deleteLuckpermsGroupsHeaderParamsPrefer)[keyof typeof deleteLuckpermsGroupsHeaderParamsPrefer];
export type DeleteLuckpermsGroupsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteLuckpermsGroupsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteLuckpermsGroups204 = any;
export type DeleteLuckpermsGroupsMutationResponse = any;
export type DeleteLuckpermsGroupsMutation = {
    Response: DeleteLuckpermsGroupsMutationResponse;
    QueryParams: DeleteLuckpermsGroupsQueryParams;
    HeaderParams: DeleteLuckpermsGroupsHeaderParams;
};
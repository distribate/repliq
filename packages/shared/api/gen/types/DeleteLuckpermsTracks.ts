export type DeleteLuckpermsTracksQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    name?: string;
    /**
     * @type string | undefined, text
    */
    groups?: string;
};
export const deleteLuckpermsTracksHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteLuckpermsTracksHeaderParamsPrefer = (typeof deleteLuckpermsTracksHeaderParamsPrefer)[keyof typeof deleteLuckpermsTracksHeaderParamsPrefer];
export type DeleteLuckpermsTracksHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteLuckpermsTracksHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteLuckpermsTracks204 = any;
export type DeleteLuckpermsTracksMutationResponse = any;
export type DeleteLuckpermsTracksMutation = {
    Response: DeleteLuckpermsTracksMutationResponse;
    QueryParams: DeleteLuckpermsTracksQueryParams;
    HeaderParams: DeleteLuckpermsTracksHeaderParams;
};
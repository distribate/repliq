import { LuckpermsTracks } from "./LuckpermsTracks";

 export type PatchLuckpermsTracksQueryParams = {
    /**
     * @type string | undefined, character varying
    */
    name?: string;
    /**
     * @type string | undefined, text
    */
    groups?: string;
};
export const patchLuckpermsTracksHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchLuckpermsTracksHeaderParamsPrefer = (typeof patchLuckpermsTracksHeaderParamsPrefer)[keyof typeof patchLuckpermsTracksHeaderParamsPrefer];
export type PatchLuckpermsTracksHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchLuckpermsTracksHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchLuckpermsTracks204 = any;
/**
 * @description luckperms_tracks
*/
export type PatchLuckpermsTracksMutationRequest = LuckpermsTracks;
export type PatchLuckpermsTracksMutationResponse = any;
export type PatchLuckpermsTracksMutation = {
    Response: PatchLuckpermsTracksMutationResponse;
    Request: PatchLuckpermsTracksMutationRequest;
    QueryParams: PatchLuckpermsTracksQueryParams;
    HeaderParams: PatchLuckpermsTracksHeaderParams;
};
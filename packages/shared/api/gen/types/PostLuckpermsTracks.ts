import { LuckpermsTracks } from "./LuckpermsTracks";

 export type PostLuckpermsTracksQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postLuckpermsTracksHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostLuckpermsTracksHeaderParamsPrefer = (typeof postLuckpermsTracksHeaderParamsPrefer)[keyof typeof postLuckpermsTracksHeaderParamsPrefer];
export type PostLuckpermsTracksHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostLuckpermsTracksHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostLuckpermsTracks201 = any;
/**
 * @description luckperms_tracks
*/
export type PostLuckpermsTracksMutationRequest = LuckpermsTracks;
export type PostLuckpermsTracksMutationResponse = any;
export type PostLuckpermsTracksMutation = {
    Response: PostLuckpermsTracksMutationResponse;
    Request: PostLuckpermsTracksMutationRequest;
    QueryParams: PostLuckpermsTracksQueryParams;
    HeaderParams: PostLuckpermsTracksHeaderParams;
};
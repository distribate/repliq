import { LuckpermsPlayers } from "./LuckpermsPlayers";

 export type PostLuckpermsPlayersQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postLuckpermsPlayersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostLuckpermsPlayersHeaderParamsPrefer = (typeof postLuckpermsPlayersHeaderParamsPrefer)[keyof typeof postLuckpermsPlayersHeaderParamsPrefer];
export type PostLuckpermsPlayersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostLuckpermsPlayersHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostLuckpermsPlayers201 = any;
/**
 * @description luckperms_players
*/
export type PostLuckpermsPlayersMutationRequest = LuckpermsPlayers;
export type PostLuckpermsPlayersMutationResponse = any;
export type PostLuckpermsPlayersMutation = {
    Response: PostLuckpermsPlayersMutationResponse;
    Request: PostLuckpermsPlayersMutationRequest;
    QueryParams: PostLuckpermsPlayersQueryParams;
    HeaderParams: PostLuckpermsPlayersHeaderParams;
};
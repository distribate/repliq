import { LuckpermsPlayers } from "./LuckpermsPlayers";

 export type PatchLuckpermsPlayersQueryParams = {
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
export const patchLuckpermsPlayersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchLuckpermsPlayersHeaderParamsPrefer = (typeof patchLuckpermsPlayersHeaderParamsPrefer)[keyof typeof patchLuckpermsPlayersHeaderParamsPrefer];
export type PatchLuckpermsPlayersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchLuckpermsPlayersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchLuckpermsPlayers204 = any;
/**
 * @description luckperms_players
*/
export type PatchLuckpermsPlayersMutationRequest = LuckpermsPlayers;
export type PatchLuckpermsPlayersMutationResponse = any;
export type PatchLuckpermsPlayersMutation = {
    Response: PatchLuckpermsPlayersMutationResponse;
    Request: PatchLuckpermsPlayersMutationRequest;
    QueryParams: PatchLuckpermsPlayersQueryParams;
    HeaderParams: PatchLuckpermsPlayersHeaderParams;
};
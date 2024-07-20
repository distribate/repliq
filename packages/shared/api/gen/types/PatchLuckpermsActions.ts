import { LuckpermsActions } from "./LuckpermsActions";

 export type PatchLuckpermsActionsQueryParams = {
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
export const patchLuckpermsActionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchLuckpermsActionsHeaderParamsPrefer = (typeof patchLuckpermsActionsHeaderParamsPrefer)[keyof typeof patchLuckpermsActionsHeaderParamsPrefer];
export type PatchLuckpermsActionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchLuckpermsActionsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchLuckpermsActions204 = any;
/**
 * @description luckperms_actions
*/
export type PatchLuckpermsActionsMutationRequest = LuckpermsActions;
export type PatchLuckpermsActionsMutationResponse = any;
export type PatchLuckpermsActionsMutation = {
    Response: PatchLuckpermsActionsMutationResponse;
    Request: PatchLuckpermsActionsMutationRequest;
    QueryParams: PatchLuckpermsActionsQueryParams;
    HeaderParams: PatchLuckpermsActionsHeaderParams;
};
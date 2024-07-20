import { LuckpermsActions } from "./LuckpermsActions";

 export type PostLuckpermsActionsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postLuckpermsActionsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostLuckpermsActionsHeaderParamsPrefer = (typeof postLuckpermsActionsHeaderParamsPrefer)[keyof typeof postLuckpermsActionsHeaderParamsPrefer];
export type PostLuckpermsActionsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostLuckpermsActionsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostLuckpermsActions201 = any;
/**
 * @description luckperms_actions
*/
export type PostLuckpermsActionsMutationRequest = LuckpermsActions;
export type PostLuckpermsActionsMutationResponse = any;
export type PostLuckpermsActionsMutation = {
    Response: PostLuckpermsActionsMutationResponse;
    Request: PostLuckpermsActionsMutationRequest;
    QueryParams: PostLuckpermsActionsQueryParams;
    HeaderParams: PostLuckpermsActionsHeaderParams;
};
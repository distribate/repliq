import { ThreadsPinned } from "./ThreadsPinned";

 export type PatchThreadsPinnedQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    threads_id?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
};
export const patchThreadsPinnedHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsPinnedHeaderParamsPrefer = (typeof patchThreadsPinnedHeaderParamsPrefer)[keyof typeof patchThreadsPinnedHeaderParamsPrefer];
export type PatchThreadsPinnedHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsPinnedHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreadsPinned204 = any;
/**
 * @description threads_pinned
*/
export type PatchThreadsPinnedMutationRequest = ThreadsPinned;
export type PatchThreadsPinnedMutationResponse = any;
export type PatchThreadsPinnedMutation = {
    Response: PatchThreadsPinnedMutationResponse;
    Request: PatchThreadsPinnedMutationRequest;
    QueryParams: PatchThreadsPinnedQueryParams;
    HeaderParams: PatchThreadsPinnedHeaderParams;
};
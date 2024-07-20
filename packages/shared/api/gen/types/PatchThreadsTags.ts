import { ThreadsTags } from "./ThreadsTags";

 export type PatchThreadsTagsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, jsonb[]
    */
    tags?: string;
};
export const patchThreadsTagsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsTagsHeaderParamsPrefer = (typeof patchThreadsTagsHeaderParamsPrefer)[keyof typeof patchThreadsTagsHeaderParamsPrefer];
export type PatchThreadsTagsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsTagsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreadsTags204 = any;
/**
 * @description threads_tags
*/
export type PatchThreadsTagsMutationRequest = ThreadsTags;
export type PatchThreadsTagsMutationResponse = any;
export type PatchThreadsTagsMutation = {
    Response: PatchThreadsTagsMutationResponse;
    Request: PatchThreadsTagsMutationRequest;
    QueryParams: PatchThreadsTagsQueryParams;
    HeaderParams: PatchThreadsTagsHeaderParams;
};
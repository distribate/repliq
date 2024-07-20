import { Threads } from "./Threads";

 export type PatchThreadsQueryParams = {
    /**
     * @type string | undefined, timestamp without time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, boolean
    */
    comments?: string;
    /**
     * @type string | undefined, boolean
    */
    permission?: string;
    /**
     * @type string | undefined, boolean
    */
    auto_remove?: string;
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, jsonb
    */
    content?: string;
};
export const patchThreadsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsHeaderParamsPrefer = (typeof patchThreadsHeaderParamsPrefer)[keyof typeof patchThreadsHeaderParamsPrefer];
export type PatchThreadsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreads204 = any;
/**
 * @description threads
*/
export type PatchThreadsMutationRequest = Threads;
export type PatchThreadsMutationResponse = any;
export type PatchThreadsMutation = {
    Response: PatchThreadsMutationResponse;
    Request: PatchThreadsMutationRequest;
    QueryParams: PatchThreadsQueryParams;
    HeaderParams: PatchThreadsHeaderParams;
};
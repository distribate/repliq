import { Posts } from "./Posts";

 export type PatchPostsQueryParams = {
    /**
     * @type string | undefined, text
    */
    content?: string;
    /**
     * @type string | undefined, uuid
    */
    post_id?: string;
    /**
     * @type string | undefined, public.post_visibility
    */
    visibility?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, boolean
    */
    comments?: string;
};
export const patchPostsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchPostsHeaderParamsPrefer = (typeof patchPostsHeaderParamsPrefer)[keyof typeof patchPostsHeaderParamsPrefer];
export type PatchPostsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchPostsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchPosts204 = any;
/**
 * @description posts
*/
export type PatchPostsMutationRequest = Posts;
export type PatchPostsMutationResponse = any;
export type PatchPostsMutation = {
    Response: PatchPostsMutationResponse;
    Request: PatchPostsMutationRequest;
    QueryParams: PatchPostsQueryParams;
    HeaderParams: PatchPostsHeaderParams;
};
import { ThreadsImages } from "./ThreadsImages";

 export type PatchThreadsImagesQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, text[]
    */
    images?: string;
};
export const patchThreadsImagesHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsImagesHeaderParamsPrefer = (typeof patchThreadsImagesHeaderParamsPrefer)[keyof typeof patchThreadsImagesHeaderParamsPrefer];
export type PatchThreadsImagesHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsImagesHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreadsImages204 = any;
/**
 * @description threads_images
*/
export type PatchThreadsImagesMutationRequest = ThreadsImages;
export type PatchThreadsImagesMutationResponse = any;
export type PatchThreadsImagesMutation = {
    Response: PatchThreadsImagesMutationResponse;
    Request: PatchThreadsImagesMutationRequest;
    QueryParams: PatchThreadsImagesQueryParams;
    HeaderParams: PatchThreadsImagesHeaderParams;
};
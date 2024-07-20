import { ThreadsImages } from "./ThreadsImages";

 export type PostThreadsImagesQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postThreadsImagesHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostThreadsImagesHeaderParamsPrefer = (typeof postThreadsImagesHeaderParamsPrefer)[keyof typeof postThreadsImagesHeaderParamsPrefer];
export type PostThreadsImagesHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostThreadsImagesHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostThreadsImages201 = any;
/**
 * @description threads_images
*/
export type PostThreadsImagesMutationRequest = ThreadsImages;
export type PostThreadsImagesMutationResponse = any;
export type PostThreadsImagesMutation = {
    Response: PostThreadsImagesMutationResponse;
    Request: PostThreadsImagesMutationRequest;
    QueryParams: PostThreadsImagesQueryParams;
    HeaderParams: PostThreadsImagesHeaderParams;
};
import { PComments } from "./PComments";

 export type PostPCommentsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postPCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostPCommentsHeaderParamsPrefer = (typeof postPCommentsHeaderParamsPrefer)[keyof typeof postPCommentsHeaderParamsPrefer];
export type PostPCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostPCommentsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostPComments201 = any;
/**
 * @description p_comments
*/
export type PostPCommentsMutationRequest = PComments;
export type PostPCommentsMutationResponse = any;
export type PostPCommentsMutation = {
    Response: PostPCommentsMutationResponse;
    Request: PostPCommentsMutationRequest;
    QueryParams: PostPCommentsQueryParams;
    HeaderParams: PostPCommentsHeaderParams;
};
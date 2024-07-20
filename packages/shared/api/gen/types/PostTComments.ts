import { TComments } from "./TComments";

 export type PostTCommentsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postTCommentsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostTCommentsHeaderParamsPrefer = (typeof postTCommentsHeaderParamsPrefer)[keyof typeof postTCommentsHeaderParamsPrefer];
export type PostTCommentsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostTCommentsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostTComments201 = any;
/**
 * @description t_comments
*/
export type PostTCommentsMutationRequest = TComments;
export type PostTCommentsMutationResponse = any;
export type PostTCommentsMutation = {
    Response: PostTCommentsMutationResponse;
    Request: PostTCommentsMutationRequest;
    QueryParams: PostTCommentsQueryParams;
    HeaderParams: PostTCommentsHeaderParams;
};
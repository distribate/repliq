import { TCommentsReplies } from "./TCommentsReplies";

 export type PostTCommentsRepliesQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postTCommentsRepliesHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostTCommentsRepliesHeaderParamsPrefer = (typeof postTCommentsRepliesHeaderParamsPrefer)[keyof typeof postTCommentsRepliesHeaderParamsPrefer];
export type PostTCommentsRepliesHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostTCommentsRepliesHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostTCommentsReplies201 = any;
/**
 * @description t_comments_replies
*/
export type PostTCommentsRepliesMutationRequest = TCommentsReplies;
export type PostTCommentsRepliesMutationResponse = any;
export type PostTCommentsRepliesMutation = {
    Response: PostTCommentsRepliesMutationResponse;
    Request: PostTCommentsRepliesMutationRequest;
    QueryParams: PostTCommentsRepliesQueryParams;
    HeaderParams: PostTCommentsRepliesHeaderParams;
};
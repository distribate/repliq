import type { PostsComments } from "./PostsComments";

 export type GetPostsCommentsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    post_id?: string;
    /**
     * @type string | undefined, uuid
    */
    comment_id?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
    /**
     * @description Ordering
     * @type string | undefined
    */
    order?: string;
    /**
     * @description Limiting and Pagination
     * @type string | undefined
    */
    offset?: string;
    /**
     * @description Limiting and Pagination
     * @type string | undefined
    */
    limit?: string;
};
export const getPostsCommentsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetPostsCommentsHeaderParamsPrefer = (typeof getPostsCommentsHeaderParamsPrefer)[keyof typeof getPostsCommentsHeaderParamsPrefer];
export type GetPostsCommentsHeaderParams = {
    /**
     * @description Limiting and Pagination
     * @type string | undefined
    */
    Range?: string;
    /**
     * @description Limiting and Pagination
     * @default "items"
     * @type string | undefined
    */
    "Range-Unit"?: string;
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: GetPostsCommentsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetPostsComments200 = PostsComments[];
/**
 * @description Partial Content
*/
export type GetPostsComments206 = any;
/**
 * @description OK
*/
export type GetPostsCommentsQueryResponse = PostsComments[];
export type GetPostsCommentsQuery = {
    Response: GetPostsCommentsQueryResponse;
    QueryParams: GetPostsCommentsQueryParams;
    HeaderParams: GetPostsCommentsHeaderParams;
};
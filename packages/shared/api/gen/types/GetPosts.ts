import type { Posts } from "./Posts";

 export type GetPostsQueryParams = {
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
export const getPostsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetPostsHeaderParamsPrefer = (typeof getPostsHeaderParamsPrefer)[keyof typeof getPostsHeaderParamsPrefer];
export type GetPostsHeaderParams = {
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
    Prefer?: GetPostsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetPosts200 = Posts[];
/**
 * @description Partial Content
*/
export type GetPosts206 = any;
/**
 * @description OK
*/
export type GetPostsQueryResponse = Posts[];
export type GetPostsQuery = {
    Response: GetPostsQueryResponse;
    QueryParams: GetPostsQueryParams;
    HeaderParams: GetPostsHeaderParams;
};
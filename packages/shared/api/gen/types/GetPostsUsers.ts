import type { PostsUsers } from "./PostsUsers";

 export type GetPostsUsersQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    post_id?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
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
export const getPostsUsersHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetPostsUsersHeaderParamsPrefer = (typeof getPostsUsersHeaderParamsPrefer)[keyof typeof getPostsUsersHeaderParamsPrefer];
export type GetPostsUsersHeaderParams = {
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
    Prefer?: GetPostsUsersHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetPostsUsers200 = PostsUsers[];
/**
 * @description Partial Content
*/
export type GetPostsUsers206 = any;
/**
 * @description OK
*/
export type GetPostsUsersQueryResponse = PostsUsers[];
export type GetPostsUsersQuery = {
    Response: GetPostsUsersQueryResponse;
    QueryParams: GetPostsUsersQueryParams;
    HeaderParams: GetPostsUsersHeaderParams;
};
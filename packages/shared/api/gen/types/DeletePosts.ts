export type DeletePostsQueryParams = {
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
export const deletePostsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeletePostsHeaderParamsPrefer = (typeof deletePostsHeaderParamsPrefer)[keyof typeof deletePostsHeaderParamsPrefer];
export type DeletePostsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeletePostsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeletePosts204 = any;
export type DeletePostsMutationResponse = any;
export type DeletePostsMutation = {
    Response: DeletePostsMutationResponse;
    QueryParams: DeletePostsQueryParams;
    HeaderParams: DeletePostsHeaderParams;
};
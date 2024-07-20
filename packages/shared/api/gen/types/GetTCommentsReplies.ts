import type { TCommentsReplies } from "./TCommentsReplies";

 export type GetTCommentsRepliesQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, uuid
    */
    initiator_comment_id?: string;
    /**
     * @type string | undefined, uuid
    */
    recipient_comment_id?: string;
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
export const getTCommentsRepliesHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetTCommentsRepliesHeaderParamsPrefer = (typeof getTCommentsRepliesHeaderParamsPrefer)[keyof typeof getTCommentsRepliesHeaderParamsPrefer];
export type GetTCommentsRepliesHeaderParams = {
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
    Prefer?: GetTCommentsRepliesHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetTCommentsReplies200 = TCommentsReplies[];
/**
 * @description Partial Content
*/
export type GetTCommentsReplies206 = any;
/**
 * @description OK
*/
export type GetTCommentsRepliesQueryResponse = TCommentsReplies[];
export type GetTCommentsRepliesQuery = {
    Response: GetTCommentsRepliesQueryResponse;
    QueryParams: GetTCommentsRepliesQueryParams;
    HeaderParams: GetTCommentsRepliesHeaderParams;
};
import type { FriendsRequests } from "./FriendsRequests";

 export type GetFriendsRequestsQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    recipient?: string;
    /**
     * @type string | undefined, text
    */
    initiator?: string;
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
export const getFriendsRequestsHeaderParamsPrefer = {
    "count=none": "count=none"
} as const;
export type GetFriendsRequestsHeaderParamsPrefer = (typeof getFriendsRequestsHeaderParamsPrefer)[keyof typeof getFriendsRequestsHeaderParamsPrefer];
export type GetFriendsRequestsHeaderParams = {
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
    Prefer?: GetFriendsRequestsHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type GetFriendsRequests200 = FriendsRequests[];
/**
 * @description Partial Content
*/
export type GetFriendsRequests206 = any;
/**
 * @description OK
*/
export type GetFriendsRequestsQueryResponse = FriendsRequests[];
export type GetFriendsRequestsQuery = {
    Response: GetFriendsRequestsQueryResponse;
    QueryParams: GetFriendsRequestsQueryParams;
    HeaderParams: GetFriendsRequestsHeaderParams;
};
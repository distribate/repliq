export type DeleteFriendsRequestsQueryParams = {
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
};
export const deleteFriendsRequestsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteFriendsRequestsHeaderParamsPrefer = (typeof deleteFriendsRequestsHeaderParamsPrefer)[keyof typeof deleteFriendsRequestsHeaderParamsPrefer];
export type DeleteFriendsRequestsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteFriendsRequestsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteFriendsRequests204 = any;
export type DeleteFriendsRequestsMutationResponse = any;
export type DeleteFriendsRequestsMutation = {
    Response: DeleteFriendsRequestsMutationResponse;
    QueryParams: DeleteFriendsRequestsQueryParams;
    HeaderParams: DeleteFriendsRequestsHeaderParams;
};
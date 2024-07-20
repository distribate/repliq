import { FriendsRequests } from "./FriendsRequests";

 export type PatchFriendsRequestsQueryParams = {
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
export const patchFriendsRequestsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchFriendsRequestsHeaderParamsPrefer = (typeof patchFriendsRequestsHeaderParamsPrefer)[keyof typeof patchFriendsRequestsHeaderParamsPrefer];
export type PatchFriendsRequestsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchFriendsRequestsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchFriendsRequests204 = any;
/**
 * @description friends_requests
*/
export type PatchFriendsRequestsMutationRequest = FriendsRequests;
export type PatchFriendsRequestsMutationResponse = any;
export type PatchFriendsRequestsMutation = {
    Response: PatchFriendsRequestsMutationResponse;
    Request: PatchFriendsRequestsMutationRequest;
    QueryParams: PatchFriendsRequestsQueryParams;
    HeaderParams: PatchFriendsRequestsHeaderParams;
};
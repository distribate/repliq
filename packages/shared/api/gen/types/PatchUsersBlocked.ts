import { UsersBlocked } from "./UsersBlocked";

 export type PatchUsersBlockedQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    user_1?: string;
    /**
     * @type string | undefined, text
    */
    user_2?: string;
};
export const patchUsersBlockedHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersBlockedHeaderParamsPrefer = (typeof patchUsersBlockedHeaderParamsPrefer)[keyof typeof patchUsersBlockedHeaderParamsPrefer];
export type PatchUsersBlockedHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersBlockedHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsersBlocked204 = any;
/**
 * @description users_blocked
*/
export type PatchUsersBlockedMutationRequest = UsersBlocked;
export type PatchUsersBlockedMutationResponse = any;
export type PatchUsersBlockedMutation = {
    Response: PatchUsersBlockedMutationResponse;
    Request: PatchUsersBlockedMutationRequest;
    QueryParams: PatchUsersBlockedQueryParams;
    HeaderParams: PatchUsersBlockedHeaderParams;
};
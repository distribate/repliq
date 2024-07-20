import { ThreadsUsers } from "./ThreadsUsers";

 export type PatchThreadsUsersQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
};
export const patchThreadsUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchThreadsUsersHeaderParamsPrefer = (typeof patchThreadsUsersHeaderParamsPrefer)[keyof typeof patchThreadsUsersHeaderParamsPrefer];
export type PatchThreadsUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchThreadsUsersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchThreadsUsers204 = any;
/**
 * @description threads_users
*/
export type PatchThreadsUsersMutationRequest = ThreadsUsers;
export type PatchThreadsUsersMutationResponse = any;
export type PatchThreadsUsersMutation = {
    Response: PatchThreadsUsersMutationResponse;
    Request: PatchThreadsUsersMutationRequest;
    QueryParams: PatchThreadsUsersQueryParams;
    HeaderParams: PatchThreadsUsersHeaderParams;
};
import { UsersStatus } from "./UsersStatus";

 export type PatchUsersStatusQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, boolean
    */
    status?: string;
    /**
     * @type string | undefined, text
    */
    user?: string;
};
export const patchUsersStatusHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersStatusHeaderParamsPrefer = (typeof patchUsersStatusHeaderParamsPrefer)[keyof typeof patchUsersStatusHeaderParamsPrefer];
export type PatchUsersStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersStatusHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsersStatus204 = any;
/**
 * @description users_status
*/
export type PatchUsersStatusMutationRequest = UsersStatus;
export type PatchUsersStatusMutationResponse = any;
export type PatchUsersStatusMutation = {
    Response: PatchUsersStatusMutationResponse;
    Request: PatchUsersStatusMutationRequest;
    QueryParams: PatchUsersStatusQueryParams;
    HeaderParams: PatchUsersStatusHeaderParams;
};
import { UsersSecurity } from "./UsersSecurity";

 export type PatchUsersSecurityQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type string | undefined, text
    */
    email?: string;
    /**
     * @type string | undefined, text
    */
    token?: string;
};
export const patchUsersSecurityHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersSecurityHeaderParamsPrefer = (typeof patchUsersSecurityHeaderParamsPrefer)[keyof typeof patchUsersSecurityHeaderParamsPrefer];
export type PatchUsersSecurityHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersSecurityHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsersSecurity204 = any;
/**
 * @description users_security
*/
export type PatchUsersSecurityMutationRequest = UsersSecurity;
export type PatchUsersSecurityMutationResponse = any;
export type PatchUsersSecurityMutation = {
    Response: PatchUsersSecurityMutationResponse;
    Request: PatchUsersSecurityMutationRequest;
    QueryParams: PatchUsersSecurityQueryParams;
    HeaderParams: PatchUsersSecurityHeaderParams;
};
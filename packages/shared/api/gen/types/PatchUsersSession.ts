import { UsersSession } from "./UsersSession";

 export type PatchUsersSessionQueryParams = {
    /**
     * @type string | undefined, timestamp without time zone
    */
    expires_at?: string;
    /**
     * @type string | undefined, text
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, text
    */
    ua?: string;
    /**
     * @type string | undefined, text
    */
    browser?: string;
    /**
     * @type string | undefined, text
    */
    os?: string;
    /**
     * @type string | undefined, text
    */
    cpu?: string;
    /**
     * @type string | undefined, boolean
    */
    isBot?: string;
    /**
     * @type string | undefined, timestamp with time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    ip?: string;
};
export const patchUsersSessionHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersSessionHeaderParamsPrefer = (typeof patchUsersSessionHeaderParamsPrefer)[keyof typeof patchUsersSessionHeaderParamsPrefer];
export type PatchUsersSessionHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersSessionHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsersSession204 = any;
/**
 * @description users_session
*/
export type PatchUsersSessionMutationRequest = UsersSession;
export type PatchUsersSessionMutationResponse = any;
export type PatchUsersSessionMutation = {
    Response: PatchUsersSessionMutationResponse;
    Request: PatchUsersSessionMutationRequest;
    QueryParams: PatchUsersSessionQueryParams;
    HeaderParams: PatchUsersSessionHeaderParams;
};
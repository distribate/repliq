import { Users } from "./Users";

 export type PatchUsersQueryParams = {
    /**
     * @type string | undefined, boolean
    */
    acceptrules?: string;
    /**
     * @type string | undefined, date
    */
    birthday?: string;
    /**
     * @type string | undefined, timestamp without time zone
    */
    created_at?: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string | undefined, text
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    nickname?: string;
    /**
     * @type string | undefined, text
    */
    status?: string;
    /**
     * @type string | undefined, text
    */
    uuid?: string;
    /**
     * @type string | undefined, text
    */
    cover_image?: string;
    /**
     * @type string | undefined, text
    */
    name_color?: string;
    /**
     * @type string | undefined, public.profile_visibility
    */
    visibility?: string;
    /**
     * @type string | undefined, text
    */
    real_name?: string;
    /**
     * @type string | undefined, jsonb
    */
    preferences?: string;
    /**
     * @type string | undefined, text
    */
    favorite_item?: string;
};
export const patchUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersHeaderParamsPrefer = (typeof patchUsersHeaderParamsPrefer)[keyof typeof patchUsersHeaderParamsPrefer];
export type PatchUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsers204 = any;
/**
 * @description users
*/
export type PatchUsersMutationRequest = Users;
export type PatchUsersMutationResponse = any;
export type PatchUsersMutation = {
    Response: PatchUsersMutationResponse;
    Request: PatchUsersMutationRequest;
    QueryParams: PatchUsersQueryParams;
    HeaderParams: PatchUsersHeaderParams;
};
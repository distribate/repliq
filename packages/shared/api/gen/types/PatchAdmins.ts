import { Admins } from "./Admins";

 export type PatchAdminsQueryParams = {
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
    admin_id?: string;
};
export const patchAdminsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchAdminsHeaderParamsPrefer = (typeof patchAdminsHeaderParamsPrefer)[keyof typeof patchAdminsHeaderParamsPrefer];
export type PatchAdminsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchAdminsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchAdmins204 = any;
/**
 * @description admins
*/
export type PatchAdminsMutationRequest = Admins;
export type PatchAdminsMutationResponse = any;
export type PatchAdminsMutation = {
    Response: PatchAdminsMutationResponse;
    Request: PatchAdminsMutationRequest;
    QueryParams: PatchAdminsQueryParams;
    HeaderParams: PatchAdminsHeaderParams;
};
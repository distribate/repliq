import { InfoFindout } from "./InfoFindout";

 export type PatchInfoFindoutQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type string | undefined, text
    */
    findout?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
};
export const patchInfoFindoutHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchInfoFindoutHeaderParamsPrefer = (typeof patchInfoFindoutHeaderParamsPrefer)[keyof typeof patchInfoFindoutHeaderParamsPrefer];
export type PatchInfoFindoutHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchInfoFindoutHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchInfoFindout204 = any;
/**
 * @description info_findout
*/
export type PatchInfoFindoutMutationRequest = InfoFindout;
export type PatchInfoFindoutMutationResponse = any;
export type PatchInfoFindoutMutation = {
    Response: PatchInfoFindoutMutationResponse;
    Request: PatchInfoFindoutMutationRequest;
    QueryParams: PatchInfoFindoutQueryParams;
    HeaderParams: PatchInfoFindoutHeaderParams;
};
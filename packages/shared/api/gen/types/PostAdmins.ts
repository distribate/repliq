import { Admins } from "./Admins";

 export type PostAdminsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postAdminsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostAdminsHeaderParamsPrefer = (typeof postAdminsHeaderParamsPrefer)[keyof typeof postAdminsHeaderParamsPrefer];
export type PostAdminsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostAdminsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostAdmins201 = any;
/**
 * @description admins
*/
export type PostAdminsMutationRequest = Admins;
export type PostAdminsMutationResponse = any;
export type PostAdminsMutation = {
    Response: PostAdminsMutationResponse;
    Request: PostAdminsMutationRequest;
    QueryParams: PostAdminsQueryParams;
    HeaderParams: PostAdminsHeaderParams;
};
export type DeleteAdminsQueryParams = {
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
export const deleteAdminsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteAdminsHeaderParamsPrefer = (typeof deleteAdminsHeaderParamsPrefer)[keyof typeof deleteAdminsHeaderParamsPrefer];
export type DeleteAdminsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteAdminsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteAdmins204 = any;
export type DeleteAdminsMutationResponse = any;
export type DeleteAdminsMutation = {
    Response: DeleteAdminsMutationResponse;
    QueryParams: DeleteAdminsQueryParams;
    HeaderParams: DeleteAdminsHeaderParams;
};
export type DeleteUsersStatusQueryParams = {
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
export const deleteUsersStatusHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersStatusHeaderParamsPrefer = (typeof deleteUsersStatusHeaderParamsPrefer)[keyof typeof deleteUsersStatusHeaderParamsPrefer];
export type DeleteUsersStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersStatusHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsersStatus204 = any;
export type DeleteUsersStatusMutationResponse = any;
export type DeleteUsersStatusMutation = {
    Response: DeleteUsersStatusMutationResponse;
    QueryParams: DeleteUsersStatusQueryParams;
    HeaderParams: DeleteUsersStatusHeaderParams;
};
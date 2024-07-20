export type DeleteUsersSecurityQueryParams = {
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
export const deleteUsersSecurityHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersSecurityHeaderParamsPrefer = (typeof deleteUsersSecurityHeaderParamsPrefer)[keyof typeof deleteUsersSecurityHeaderParamsPrefer];
export type DeleteUsersSecurityHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersSecurityHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsersSecurity204 = any;
export type DeleteUsersSecurityMutationResponse = any;
export type DeleteUsersSecurityMutation = {
    Response: DeleteUsersSecurityMutationResponse;
    QueryParams: DeleteUsersSecurityQueryParams;
    HeaderParams: DeleteUsersSecurityHeaderParams;
};
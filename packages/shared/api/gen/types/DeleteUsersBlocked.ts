export type DeleteUsersBlockedQueryParams = {
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
    user_1?: string;
    /**
     * @type string | undefined, text
    */
    user_2?: string;
};
export const deleteUsersBlockedHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersBlockedHeaderParamsPrefer = (typeof deleteUsersBlockedHeaderParamsPrefer)[keyof typeof deleteUsersBlockedHeaderParamsPrefer];
export type DeleteUsersBlockedHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersBlockedHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsersBlocked204 = any;
export type DeleteUsersBlockedMutationResponse = any;
export type DeleteUsersBlockedMutation = {
    Response: DeleteUsersBlockedMutationResponse;
    QueryParams: DeleteUsersBlockedQueryParams;
    HeaderParams: DeleteUsersBlockedHeaderParams;
};
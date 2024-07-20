export type DeleteUsersSessionQueryParams = {
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
export const deleteUsersSessionHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersSessionHeaderParamsPrefer = (typeof deleteUsersSessionHeaderParamsPrefer)[keyof typeof deleteUsersSessionHeaderParamsPrefer];
export type DeleteUsersSessionHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersSessionHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsersSession204 = any;
export type DeleteUsersSessionMutationResponse = any;
export type DeleteUsersSessionMutation = {
    Response: DeleteUsersSessionMutationResponse;
    QueryParams: DeleteUsersSessionQueryParams;
    HeaderParams: DeleteUsersSessionHeaderParams;
};
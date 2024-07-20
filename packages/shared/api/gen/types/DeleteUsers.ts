export type DeleteUsersQueryParams = {
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
export const deleteUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersHeaderParamsPrefer = (typeof deleteUsersHeaderParamsPrefer)[keyof typeof deleteUsersHeaderParamsPrefer];
export type DeleteUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsers204 = any;
export type DeleteUsersMutationResponse = any;
export type DeleteUsersMutation = {
    Response: DeleteUsersMutationResponse;
    QueryParams: DeleteUsersQueryParams;
    HeaderParams: DeleteUsersHeaderParams;
};
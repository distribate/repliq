export type DeleteUsersSettingsQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_id?: string;
};
export const deleteUsersSettingsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteUsersSettingsHeaderParamsPrefer = (typeof deleteUsersSettingsHeaderParamsPrefer)[keyof typeof deleteUsersSettingsHeaderParamsPrefer];
export type DeleteUsersSettingsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteUsersSettingsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteUsersSettings204 = any;
export type DeleteUsersSettingsMutationResponse = any;
export type DeleteUsersSettingsMutation = {
    Response: DeleteUsersSettingsMutationResponse;
    QueryParams: DeleteUsersSettingsQueryParams;
    HeaderParams: DeleteUsersSettingsHeaderParams;
};
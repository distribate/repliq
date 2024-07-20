import { UsersSettings } from "./UsersSettings";

 export type PostUsersSettingsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postUsersSettingsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostUsersSettingsHeaderParamsPrefer = (typeof postUsersSettingsHeaderParamsPrefer)[keyof typeof postUsersSettingsHeaderParamsPrefer];
export type PostUsersSettingsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostUsersSettingsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostUsersSettings201 = any;
/**
 * @description users_settings
*/
export type PostUsersSettingsMutationRequest = UsersSettings;
export type PostUsersSettingsMutationResponse = any;
export type PostUsersSettingsMutation = {
    Response: PostUsersSettingsMutationResponse;
    Request: PostUsersSettingsMutationRequest;
    QueryParams: PostUsersSettingsQueryParams;
    HeaderParams: PostUsersSettingsHeaderParams;
};
import { UsersSettings } from "./UsersSettings";

 export type PatchUsersSettingsQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_id?: string;
};
export const patchUsersSettingsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchUsersSettingsHeaderParamsPrefer = (typeof patchUsersSettingsHeaderParamsPrefer)[keyof typeof patchUsersSettingsHeaderParamsPrefer];
export type PatchUsersSettingsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchUsersSettingsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchUsersSettings204 = any;
/**
 * @description users_settings
*/
export type PatchUsersSettingsMutationRequest = UsersSettings;
export type PatchUsersSettingsMutationResponse = any;
export type PatchUsersSettingsMutation = {
    Response: PatchUsersSettingsMutationResponse;
    Request: PatchUsersSettingsMutationRequest;
    QueryParams: PatchUsersSettingsQueryParams;
    HeaderParams: PatchUsersSettingsHeaderParams;
};
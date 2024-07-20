export type DeleteThreadsUsersQueryParams = {
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
};
export const deleteThreadsUsersHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsUsersHeaderParamsPrefer = (typeof deleteThreadsUsersHeaderParamsPrefer)[keyof typeof deleteThreadsUsersHeaderParamsPrefer];
export type DeleteThreadsUsersHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsUsersHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreadsUsers204 = any;
export type DeleteThreadsUsersMutationResponse = any;
export type DeleteThreadsUsersMutation = {
    Response: DeleteThreadsUsersMutationResponse;
    QueryParams: DeleteThreadsUsersQueryParams;
    HeaderParams: DeleteThreadsUsersHeaderParams;
};
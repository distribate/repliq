export type DeleteInfoFindoutQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type string | undefined, text
    */
    findout?: string;
    /**
     * @type string | undefined, bigint
    */
    id?: string;
};
export const deleteInfoFindoutHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteInfoFindoutHeaderParamsPrefer = (typeof deleteInfoFindoutHeaderParamsPrefer)[keyof typeof deleteInfoFindoutHeaderParamsPrefer];
export type DeleteInfoFindoutHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteInfoFindoutHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteInfoFindout204 = any;
export type DeleteInfoFindoutMutationResponse = any;
export type DeleteInfoFindoutMutation = {
    Response: DeleteInfoFindoutMutationResponse;
    QueryParams: DeleteInfoFindoutQueryParams;
    HeaderParams: DeleteInfoFindoutHeaderParams;
};
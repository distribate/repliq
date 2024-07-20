export type DeleteStatusQueryParams = {
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, boolean
    */
    value?: string;
};
export const deleteStatusHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteStatusHeaderParamsPrefer = (typeof deleteStatusHeaderParamsPrefer)[keyof typeof deleteStatusHeaderParamsPrefer];
export type DeleteStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteStatusHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteStatus204 = any;
export type DeleteStatusMutationResponse = any;
export type DeleteStatusMutation = {
    Response: DeleteStatusMutationResponse;
    QueryParams: DeleteStatusQueryParams;
    HeaderParams: DeleteStatusHeaderParams;
};
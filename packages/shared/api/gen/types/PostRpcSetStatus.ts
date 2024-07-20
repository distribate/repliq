export const postRpcSetStatusHeaderParamsPrefer = {
    "params=single-object": "params=single-object"
} as const;
export type PostRpcSetStatusHeaderParamsPrefer = (typeof postRpcSetStatusHeaderParamsPrefer)[keyof typeof postRpcSetStatusHeaderParamsPrefer];
export type PostRpcSetStatusHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostRpcSetStatusHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type PostRpcSetStatus200 = any;
export type PostRpcSetStatusMutationRequest = {
    /**
     * @type string, text
    */
    p_user_id: string;
    /**
     * @type boolean, boolean
    */
    p_value: boolean;
};
export type PostRpcSetStatusMutationResponse = any;
export type PostRpcSetStatusMutation = {
    Response: PostRpcSetStatusMutationResponse;
    Request: PostRpcSetStatusMutationRequest;
    HeaderParams: PostRpcSetStatusHeaderParams;
};
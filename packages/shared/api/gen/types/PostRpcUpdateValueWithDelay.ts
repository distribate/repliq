export const postRpcUpdateValueWithDelayHeaderParamsPrefer = {
    "params=single-object": "params=single-object"
} as const;
export type PostRpcUpdateValueWithDelayHeaderParamsPrefer = (typeof postRpcUpdateValueWithDelayHeaderParamsPrefer)[keyof typeof postRpcUpdateValueWithDelayHeaderParamsPrefer];
export type PostRpcUpdateValueWithDelayHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostRpcUpdateValueWithDelayHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type PostRpcUpdateValueWithDelay200 = any;
export type PostRpcUpdateValueWithDelayMutationRequest = {
    /**
     * @type string, text
    */
    p_user_id: string;
};
export type PostRpcUpdateValueWithDelayMutationResponse = any;
export type PostRpcUpdateValueWithDelayMutation = {
    Response: PostRpcUpdateValueWithDelayMutationResponse;
    Request: PostRpcUpdateValueWithDelayMutationRequest;
    HeaderParams: PostRpcUpdateValueWithDelayHeaderParams;
};
export const postRpcCheckAndInsertUserHeaderParamsPrefer = {
    "params=single-object": "params=single-object"
} as const;
export type PostRpcCheckAndInsertUserHeaderParamsPrefer = (typeof postRpcCheckAndInsertUserHeaderParamsPrefer)[keyof typeof postRpcCheckAndInsertUserHeaderParamsPrefer];
export type PostRpcCheckAndInsertUserHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostRpcCheckAndInsertUserHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type PostRpcCheckAndInsertUser200 = any;
export type PostRpcCheckAndInsertUserMutationRequest = {
    /**
     * @type string, text
    */
    nick: string;
    /**
     * @type string, text
    */
    pass: string;
};
export type PostRpcCheckAndInsertUserMutationResponse = any;
export type PostRpcCheckAndInsertUserMutation = {
    Response: PostRpcCheckAndInsertUserMutationResponse;
    Request: PostRpcCheckAndInsertUserMutationRequest;
    HeaderParams: PostRpcCheckAndInsertUserHeaderParams;
};
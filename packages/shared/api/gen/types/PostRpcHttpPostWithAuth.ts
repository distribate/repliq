export const postRpcHttpPostWithAuthHeaderParamsPrefer = {
    "params=single-object": "params=single-object"
} as const;
export type PostRpcHttpPostWithAuthHeaderParamsPrefer = (typeof postRpcHttpPostWithAuthHeaderParamsPrefer)[keyof typeof postRpcHttpPostWithAuthHeaderParamsPrefer];
export type PostRpcHttpPostWithAuthHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostRpcHttpPostWithAuthHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type PostRpcHttpPostWithAuth200 = any;
export type PostRpcHttpPostWithAuthMutationRequest = {
    /**
     * @type string, text
    */
    bearer: string;
    /**
     * @type string, text
    */
    post_data: string;
    /**
     * @type string, text
    */
    url_address: string;
};
export type PostRpcHttpPostWithAuthMutationResponse = any;
export type PostRpcHttpPostWithAuthMutation = {
    Response: PostRpcHttpPostWithAuthMutationResponse;
    Request: PostRpcHttpPostWithAuthMutationRequest;
    HeaderParams: PostRpcHttpPostWithAuthHeaderParams;
};
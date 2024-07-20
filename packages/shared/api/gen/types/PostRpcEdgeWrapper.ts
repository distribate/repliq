export const postRpcEdgeWrapperHeaderParamsPrefer = {
    "params=single-object": "params=single-object"
} as const;
export type PostRpcEdgeWrapperHeaderParamsPrefer = (typeof postRpcEdgeWrapperHeaderParamsPrefer)[keyof typeof postRpcEdgeWrapperHeaderParamsPrefer];
export type PostRpcEdgeWrapperHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostRpcEdgeWrapperHeaderParamsPrefer;
};
/**
 * @description OK
*/
export type PostRpcEdgeWrapper200 = any;
export type PostRpcEdgeWrapperMutationRequest = {
    /**
     * @type string, text
    */
    database: string;
    /**
     * @type string, text
    */
    nickname: string;
    /**
     * @type string, text
    */
    table_name: string;
    /**
     * @type string, text
    */
    uuid: string;
};
export type PostRpcEdgeWrapperMutationResponse = any;
export type PostRpcEdgeWrapperMutation = {
    Response: PostRpcEdgeWrapperMutationResponse;
    Request: PostRpcEdgeWrapperMutationRequest;
    HeaderParams: PostRpcEdgeWrapperHeaderParams;
};
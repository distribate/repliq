export type GetRpcEdgeWrapperQueryParams = {
    /**
     * @type string, text
    */
    database: string;
    /**
     * @type string, text
    */
    table_name: string;
    /**
     * @type string, text
    */
    nickname: string;
    /**
     * @type string, text
    */
    uuid: string;
};
/**
 * @description OK
*/
export type GetRpcEdgeWrapper200 = any;
export type GetRpcEdgeWrapperQueryResponse = any;
export type GetRpcEdgeWrapperQuery = {
    Response: GetRpcEdgeWrapperQueryResponse;
    QueryParams: GetRpcEdgeWrapperQueryParams;
};
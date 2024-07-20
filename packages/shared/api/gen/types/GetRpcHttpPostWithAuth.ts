export type GetRpcHttpPostWithAuthQueryParams = {
    /**
     * @type string, text
    */
    url_address: string;
    /**
     * @type string, text
    */
    post_data: string;
    /**
     * @type string, text
    */
    bearer: string;
};
/**
 * @description OK
*/
export type GetRpcHttpPostWithAuth200 = any;
export type GetRpcHttpPostWithAuthQueryResponse = any;
export type GetRpcHttpPostWithAuthQuery = {
    Response: GetRpcHttpPostWithAuthQueryResponse;
    QueryParams: GetRpcHttpPostWithAuthQueryParams;
};
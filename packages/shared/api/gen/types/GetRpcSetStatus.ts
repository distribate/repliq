export type GetRpcSetStatusQueryParams = {
    /**
     * @type string, text
    */
    p_user_id: string;
    /**
     * @type boolean, boolean
    */
    p_value: boolean;
};
/**
 * @description OK
*/
export type GetRpcSetStatus200 = any;
export type GetRpcSetStatusQueryResponse = any;
export type GetRpcSetStatusQuery = {
    Response: GetRpcSetStatusQueryResponse;
    QueryParams: GetRpcSetStatusQueryParams;
};
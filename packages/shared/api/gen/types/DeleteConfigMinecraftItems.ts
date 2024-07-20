export type DeleteConfigMinecraftItemsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    title?: string;
    /**
     * @type string | undefined, text
    */
    image?: string;
};
export const deleteConfigMinecraftItemsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteConfigMinecraftItemsHeaderParamsPrefer = (typeof deleteConfigMinecraftItemsHeaderParamsPrefer)[keyof typeof deleteConfigMinecraftItemsHeaderParamsPrefer];
export type DeleteConfigMinecraftItemsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteConfigMinecraftItemsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteConfigMinecraftItems204 = any;
export type DeleteConfigMinecraftItemsMutationResponse = any;
export type DeleteConfigMinecraftItemsMutation = {
    Response: DeleteConfigMinecraftItemsMutationResponse;
    QueryParams: DeleteConfigMinecraftItemsQueryParams;
    HeaderParams: DeleteConfigMinecraftItemsHeaderParams;
};
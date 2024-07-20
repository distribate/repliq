export type DeleteConfigMinecraftFactsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    fact?: string;
};
export const deleteConfigMinecraftFactsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteConfigMinecraftFactsHeaderParamsPrefer = (typeof deleteConfigMinecraftFactsHeaderParamsPrefer)[keyof typeof deleteConfigMinecraftFactsHeaderParamsPrefer];
export type DeleteConfigMinecraftFactsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteConfigMinecraftFactsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteConfigMinecraftFacts204 = any;
export type DeleteConfigMinecraftFactsMutationResponse = any;
export type DeleteConfigMinecraftFactsMutation = {
    Response: DeleteConfigMinecraftFactsMutationResponse;
    QueryParams: DeleteConfigMinecraftFactsQueryParams;
    HeaderParams: DeleteConfigMinecraftFactsHeaderParams;
};
import { ConfigMinecraftItems } from "./ConfigMinecraftItems";

 export type PostConfigMinecraftItemsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postConfigMinecraftItemsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostConfigMinecraftItemsHeaderParamsPrefer = (typeof postConfigMinecraftItemsHeaderParamsPrefer)[keyof typeof postConfigMinecraftItemsHeaderParamsPrefer];
export type PostConfigMinecraftItemsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostConfigMinecraftItemsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostConfigMinecraftItems201 = any;
/**
 * @description config_minecraft_items
*/
export type PostConfigMinecraftItemsMutationRequest = ConfigMinecraftItems;
export type PostConfigMinecraftItemsMutationResponse = any;
export type PostConfigMinecraftItemsMutation = {
    Response: PostConfigMinecraftItemsMutationResponse;
    Request: PostConfigMinecraftItemsMutationRequest;
    QueryParams: PostConfigMinecraftItemsQueryParams;
    HeaderParams: PostConfigMinecraftItemsHeaderParams;
};
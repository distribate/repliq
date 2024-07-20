import { ConfigMinecraftItems } from "./ConfigMinecraftItems";

 export type PatchConfigMinecraftItemsQueryParams = {
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
export const patchConfigMinecraftItemsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchConfigMinecraftItemsHeaderParamsPrefer = (typeof patchConfigMinecraftItemsHeaderParamsPrefer)[keyof typeof patchConfigMinecraftItemsHeaderParamsPrefer];
export type PatchConfigMinecraftItemsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchConfigMinecraftItemsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchConfigMinecraftItems204 = any;
/**
 * @description config_minecraft_items
*/
export type PatchConfigMinecraftItemsMutationRequest = ConfigMinecraftItems;
export type PatchConfigMinecraftItemsMutationResponse = any;
export type PatchConfigMinecraftItemsMutation = {
    Response: PatchConfigMinecraftItemsMutationResponse;
    Request: PatchConfigMinecraftItemsMutationRequest;
    QueryParams: PatchConfigMinecraftItemsQueryParams;
    HeaderParams: PatchConfigMinecraftItemsHeaderParams;
};
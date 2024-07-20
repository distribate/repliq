import { ConfigMinecraftFacts } from "./ConfigMinecraftFacts";

 export type PatchConfigMinecraftFactsQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    fact?: string;
};
export const patchConfigMinecraftFactsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type PatchConfigMinecraftFactsHeaderParamsPrefer = (typeof patchConfigMinecraftFactsHeaderParamsPrefer)[keyof typeof patchConfigMinecraftFactsHeaderParamsPrefer];
export type PatchConfigMinecraftFactsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PatchConfigMinecraftFactsHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type PatchConfigMinecraftFacts204 = any;
/**
 * @description config_minecraft_facts
*/
export type PatchConfigMinecraftFactsMutationRequest = ConfigMinecraftFacts;
export type PatchConfigMinecraftFactsMutationResponse = any;
export type PatchConfigMinecraftFactsMutation = {
    Response: PatchConfigMinecraftFactsMutationResponse;
    Request: PatchConfigMinecraftFactsMutationRequest;
    QueryParams: PatchConfigMinecraftFactsQueryParams;
    HeaderParams: PatchConfigMinecraftFactsHeaderParams;
};
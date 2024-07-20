import { ConfigMinecraftFacts } from "./ConfigMinecraftFacts";

 export type PostConfigMinecraftFactsQueryParams = {
    /**
     * @description Filtering Columns
     * @type string | undefined
    */
    select?: string;
};
export const postConfigMinecraftFactsHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none",
    "resolution=ignore-duplicates": "resolution=ignore-duplicates",
    "resolution=merge-duplicates": "resolution=merge-duplicates"
} as const;
export type PostConfigMinecraftFactsHeaderParamsPrefer = (typeof postConfigMinecraftFactsHeaderParamsPrefer)[keyof typeof postConfigMinecraftFactsHeaderParamsPrefer];
export type PostConfigMinecraftFactsHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: PostConfigMinecraftFactsHeaderParamsPrefer;
};
/**
 * @description Created
*/
export type PostConfigMinecraftFacts201 = any;
/**
 * @description config_minecraft_facts
*/
export type PostConfigMinecraftFactsMutationRequest = ConfigMinecraftFacts;
export type PostConfigMinecraftFactsMutationResponse = any;
export type PostConfigMinecraftFactsMutation = {
    Response: PostConfigMinecraftFactsMutationResponse;
    Request: PostConfigMinecraftFactsMutationRequest;
    QueryParams: PostConfigMinecraftFactsQueryParams;
    HeaderParams: PostConfigMinecraftFactsHeaderParams;
};
export type DeleteThreadsRatingQueryParams = {
    /**
     * @type string | undefined, bigint
    */
    id?: string;
    /**
     * @type string | undefined, text
    */
    user_id?: string;
    /**
     * @type string | undefined, uuid
    */
    thread_id?: string;
    /**
     * @type string | undefined, public.thread_rating_type
    */
    type?: string;
};
export const deleteThreadsRatingHeaderParamsPrefer = {
    "return=representation": "return=representation",
    "return=minimal": "return=minimal",
    "return=none": "return=none"
} as const;
export type DeleteThreadsRatingHeaderParamsPrefer = (typeof deleteThreadsRatingHeaderParamsPrefer)[keyof typeof deleteThreadsRatingHeaderParamsPrefer];
export type DeleteThreadsRatingHeaderParams = {
    /**
     * @description Preference
     * @type string | undefined
    */
    Prefer?: DeleteThreadsRatingHeaderParamsPrefer;
};
/**
 * @description No Content
*/
export type DeleteThreadsRating204 = any;
export type DeleteThreadsRatingMutationResponse = any;
export type DeleteThreadsRatingMutation = {
    Response: DeleteThreadsRatingMutationResponse;
    QueryParams: DeleteThreadsRatingQueryParams;
    HeaderParams: DeleteThreadsRatingHeaderParams;
};
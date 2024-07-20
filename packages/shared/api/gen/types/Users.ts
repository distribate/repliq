export const usersVisibility = {
    "all": "all",
    "friends": "friends"
} as const;
export type UsersVisibility = (typeof usersVisibility)[keyof typeof usersVisibility];
export type Users = {
    /**
     * @default true
     * @type boolean | undefined, boolean
    */
    acceptrules?: boolean;
    /**
     * @type string | undefined, date
    */
    birthday?: string;
    /**
     * @default "CURRENT_TIMESTAMP"
     * @type string, timestamp without time zone
    */
    created_at: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @default "gen_random_uuid()"
     * @type string, text
    */
    id: string;
    /**
     * @type string, text
    */
    nickname: string;
    /**
     * @type string | undefined, text
    */
    status?: string;
    /**
     * @type string, text
    */
    uuid: string;
    /**
     * @type string | undefined, text
    */
    cover_image?: string;
    /**
     * @default "#FFFFFF"
     * @type string, text
    */
    name_color: string;
    /**
     * @default "all"
     * @type string, public.profile_visibility
    */
    visibility: UsersVisibility;
    /**
     * @type string | undefined, text
    */
    real_name?: string;
    /**
     * @type object, jsonb
    */
    preferences: object;
    /**
     * @type string | undefined, text
    */
    favorite_item?: string;
};
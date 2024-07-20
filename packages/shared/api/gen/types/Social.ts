export type Social = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, character varying
    */
    LOWERCASENICKNAME: string;
    /**
     * @type integer | undefined, bigint
    */
    VK_ID?: number;
    /**
     * @type integer | undefined, bigint
    */
    TELEGRAM_ID?: number;
    /**
     * @type integer | undefined, bigint
    */
    DISCORD_ID?: number;
    /**
     * @type boolean | undefined, boolean
    */
    BLOCKED?: boolean;
    /**
     * @type boolean | undefined, boolean
    */
    TOTP_ENABLED?: boolean;
    /**
     * @type boolean | undefined, boolean
    */
    NOTIFY_ENABLED?: boolean;
};
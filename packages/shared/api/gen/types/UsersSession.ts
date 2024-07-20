export type UsersSession = {
    /**
     * @type string, timestamp without time zone
    */
    expires_at: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, text
    */
    id: string;
    /**
     * @description Note:\nThis is a Foreign Key to `users.id`.<fk table=\'users\' column=\'id\'/>
     * @type string, text
    */
    user_id: string;
    /**
     * @type string | undefined, text
    */
    ua?: string;
    /**
     * @type string | undefined, text
    */
    browser?: string;
    /**
     * @type string | undefined, text
    */
    os?: string;
    /**
     * @type string | undefined, text
    */
    cpu?: string;
    /**
     * @type boolean | undefined, boolean
    */
    isBot?: boolean;
    /**
     * @default "now()"
     * @type string, timestamp with time zone
    */
    created_at: string;
    /**
     * @type string | undefined, text
    */
    ip?: string;
};
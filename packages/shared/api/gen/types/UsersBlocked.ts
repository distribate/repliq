export type UsersBlocked = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
    /**
     * @default "now()"
     * @type string, timestamp with time zone
    */
    created_at: string;
    /**
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string | undefined, text
    */
    user_1?: string;
    /**
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string | undefined, text
    */
    user_2?: string;
};
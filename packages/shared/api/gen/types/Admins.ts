export type Admins = {
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
     * @description Note:\nThis is a Foreign Key to `users.id`.<fk table=\'users\' column=\'id\'/>
     * @type string | undefined, text
    */
    admin_id?: string;
};
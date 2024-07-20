export type FriendsRequests = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, uuid
    */
    id: string;
    /**
     * @default "now()"
     * @type string, timestamp with time zone
    */
    created_at: string;
    /**
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string, text
    */
    recipient: string;
    /**
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string, text
    */
    initiator: string;
};
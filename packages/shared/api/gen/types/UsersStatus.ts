export type UsersStatus = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
    /**
     * @type boolean | undefined, boolean
    */
    status?: boolean;
    /**
     * @description Note:\nThis is a Foreign Key to `users.id`.<fk table=\'users\' column=\'id\'/>
     * @type string | undefined, text
    */
    user?: string;
};
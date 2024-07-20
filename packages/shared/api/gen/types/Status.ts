export type Status = {
    /**
     * @description Note:\nThis is a Foreign Key to `users.id`.<fk table=\'users\' column=\'id\'/>
     * @default ""
     * @type string, text
    */
    user_id: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @default false
     * @type boolean, boolean
    */
    value: boolean;
};
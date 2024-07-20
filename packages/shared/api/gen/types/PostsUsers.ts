export type PostsUsers = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, uuid
    */
    post_id: string;
    /**
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string, text
    */
    user_nickname: string;
};
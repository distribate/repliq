export type PostsComments = {
    /**
     * @description Note:\nThis is a Foreign Key to `posts.post_id`.<fk table=\'posts\' column=\'post_id\'/>
     * @type string, uuid
    */
    post_id: string;
    /**
     * @description Note:\nThis is a Foreign Key to `p_comments.id`.<fk table=\'p_comments\' column=\'id\'/>
     * @type string, uuid
    */
    comment_id: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
};
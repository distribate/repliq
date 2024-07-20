export type ThreadsComments = {
    /**
     * @description Note:\nThis is a Foreign Key to `threads.id`.<fk table=\'threads\' column=\'id\'/>
     * @type string, uuid
    */
    thread_id: string;
    /**
     * @description Note:\nThis is a Foreign Key to `t_comments.id`.<fk table=\'t_comments\' column=\'id\'/>
     * @type string, uuid
    */
    comment_id: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
};
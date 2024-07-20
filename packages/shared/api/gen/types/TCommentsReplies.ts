export type TCommentsReplies = {
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
     * @description Note:\nThis is a Foreign Key to `t_comments.id`.<fk table=\'t_comments\' column=\'id\'/>
     * @type string | undefined, uuid
    */
    initiator_comment_id?: string;
    /**
     * @description Note:\nThis is a Foreign Key to `t_comments.id`.<fk table=\'t_comments\' column=\'id\'/>
     * @type string | undefined, uuid
    */
    recipient_comment_id?: string;
};
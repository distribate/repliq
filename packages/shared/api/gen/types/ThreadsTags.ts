export type ThreadsTags = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
    /**
     * @description Note:\nThis is a Foreign Key to `threads.id`.<fk table=\'threads\' column=\'id\'/>
     * @type string, uuid
    */
    thread_id: string;
    /**
     * @type array | undefined
    */
    tags?: object[];
};
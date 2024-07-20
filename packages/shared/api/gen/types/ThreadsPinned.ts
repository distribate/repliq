export type ThreadsPinned = {
    /**
     * @description Note:\nThis is a Foreign Key to `threads.id`.<fk table=\'threads\' column=\'id\'/>
     * @type string, uuid
    */
    threads_id: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
};
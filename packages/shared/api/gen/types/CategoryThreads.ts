export type CategoryThreads = {
    /**
     * @description Note:\nThis is a Foreign Key to `category.id`.<fk table=\'category\' column=\'id\'/>
     * @type integer, integer
    */
    category_id: number;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, uuid
    */
    thread_id: string;
};
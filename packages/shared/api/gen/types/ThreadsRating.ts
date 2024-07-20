export const threadsRatingType = {
    "decrement": "decrement",
    "increment": "increment"
} as const;
export type ThreadsRatingType = (typeof threadsRatingType)[keyof typeof threadsRatingType];
export type ThreadsRating = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
    /**
     * @description Note:\nThis is a Foreign Key to `users.id`.<fk table=\'users\' column=\'id\'/>
     * @type string, text
    */
    user_id: string;
    /**
     * @description Note:\nThis is a Foreign Key to `threads.id`.<fk table=\'threads\' column=\'id\'/>
     * @type string, uuid
    */
    thread_id: string;
    /**
     * @type string, public.thread_rating_type
    */
    type: ThreadsRatingType;
};
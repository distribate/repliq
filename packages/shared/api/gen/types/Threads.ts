export type Threads = {
    /**
     * @default "CURRENT_TIMESTAMP"
     * @type string, timestamp without time zone
    */
    created_at: string;
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @type string, text
    */
    title: string;
    /**
     * @default true
     * @type boolean, boolean
    */
    comments: boolean;
    /**
     * @default false
     * @type boolean, boolean
    */
    permission: boolean;
    /**
     * @default false
     * @type boolean, boolean
    */
    auto_remove: boolean;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, uuid
    */
    id: string;
    /**
     * @type object, jsonb
    */
    content: object;
};
export type ConfigAlerts = {
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
     * @type string, text
    */
    title: string;
    /**
     * @type string | undefined, text
    */
    link?: string;
};
export type Category = {
    /**
     * @type string | undefined, text
    */
    description?: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
    /**
     * @type string, text
    */
    title: string;
    /**
     * @default true
     * @type boolean, boolean
    */
    available: boolean;
};
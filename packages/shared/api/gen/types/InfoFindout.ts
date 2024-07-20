export type InfoFindout = {
    /**
     * @type string, text
    */
    user_nickname: string;
    /**
     * @type string | undefined, text
    */
    findout?: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, bigint
    */
    id: number;
};
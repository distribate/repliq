export type UsersSecurity = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, text
    */
    user_nickname: string;
    /**
     * @type string, text
    */
    email: string;
    /**
     * @type string | undefined, text
    */
    token?: string;
};
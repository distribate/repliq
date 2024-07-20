export type Auth = {
    /**
     * @type string, character varying
    */
    NICKNAME: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, character varying
    */
    LOWERCASENICKNAME: string;
    /**
     * @type string, character varying
    */
    HASH: string;
    /**
     * @type string | undefined, character varying
    */
    IP?: string;
    /**
     * @type string | undefined, character varying
    */
    TOTPTOKEN?: string;
    /**
     * @type integer | undefined, bigint
    */
    REGDATE?: number;
    /**
     * @type string | undefined, character varying
    */
    UUID?: string;
    /**
     * @type string | undefined, character varying
    */
    PREMIUMUUID?: string;
    /**
     * @type string | undefined, character varying
    */
    LOGINIP?: string;
    /**
     * @type integer | undefined, bigint
    */
    LOGINDATE?: number;
    /**
     * @type integer | undefined, bigint
    */
    ISSUEDTIME?: number;
};
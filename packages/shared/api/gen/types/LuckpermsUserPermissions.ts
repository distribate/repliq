export type LuckpermsUserPermissions = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, integer
    */
    id: number;
    /**
     * @type string, character varying
    */
    uuid: string;
    /**
     * @type string, character varying
    */
    permission: string;
    /**
     * @type boolean, boolean
    */
    value: boolean;
    /**
     * @type string, character varying
    */
    server: string;
    /**
     * @type string, character varying
    */
    world: string;
    /**
     * @type integer, bigint
    */
    expiry: number;
    /**
     * @type string, character varying
    */
    contexts: string;
};
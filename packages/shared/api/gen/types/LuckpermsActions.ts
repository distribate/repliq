export type LuckpermsActions = {
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type integer, integer
    */
    id: number;
    /**
     * @type integer, bigint
    */
    time: number;
    /**
     * @type string, character varying
    */
    actor_uuid: string;
    /**
     * @type string, character varying
    */
    actor_name: string;
    /**
     * @type string, character
    */
    type: string;
    /**
     * @type string, character varying
    */
    acted_uuid: string;
    /**
     * @type string, character varying
    */
    acted_name: string;
    /**
     * @type string, character varying
    */
    action: string;
};
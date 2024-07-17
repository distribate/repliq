export const envSchema = {
    type: 'object',
    required: ['SKIN_ELY_URL', 'SKIN_HEAD_ELY_URL'],
    properties: {
        SKIN_ELY_URL: {
            type: 'string',
            default: "http://skinsystem.ely.by/skins/"
        },
        SKIN_HEAD_ELY_URL: {
            type: 'string',
            default: "https://ely.by/services/skins-renderer?url=http://skinsystem.ely.by/skins/"
        }
    }
};

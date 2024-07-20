export const postsVisibility = {
    "all": "all",
    "only": "only",
    "friends": "friends"
} as const;
export type PostsVisibility = (typeof postsVisibility)[keyof typeof postsVisibility];
export type Posts = {
    /**
     * @type string | undefined, text
    */
    content?: string;
    /**
     * @description Note:\nThis is a Primary Key.<pk/>
     * @type string, uuid
    */
    post_id: string;
    /**
     * @default "all"
     * @type string, public.post_visibility
    */
    visibility: PostsVisibility;
    /**
     * @default "now()"
     * @type string, timestamp with time zone
    */
    created_at: string;
    /**
     * @default true
     * @type boolean, boolean
    */
    comments: boolean;
};
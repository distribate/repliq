export const reportsReason = {
    "spam": "spam",
    "offensive": "offensive"
} as const;
export type ReportsReason = (typeof reportsReason)[keyof typeof reportsReason];
export const reportsReportType = {
    "comment": "comment",
    "post": "post",
    "thread": "thread",
    "account": "account"
} as const;
export type ReportsReportType = (typeof reportsReportType)[keyof typeof reportsReportType];
export type Reports = {
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
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string | undefined, text
    */
    user_nickname?: string;
    /**
     * @type object | undefined, json
    */
    reported_item?: object;
    /**
     * @type string | undefined, public.report_reason
    */
    reason?: ReportsReason;
    /**
     * @description Note:\nThis is a Foreign Key to `users.nickname`.<fk table=\'users\' column=\'nickname\'/>
     * @type string | undefined, text
    */
    target_user_nickname?: string;
    /**
     * @type string | undefined, public.report_type
    */
    report_type?: ReportsReportType;
};
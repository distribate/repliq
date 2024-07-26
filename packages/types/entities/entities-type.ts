import { Tables } from "./supabase";

export type USER = Tables<"users">

export type POST = Tables<"posts">
export type COMMENT = Tables<"p_comments">

export type CATEGORY = Tables<"category">
export type THREAD = Tables<"threads">
export type ALERT = Tables<"config_alerts">
export type T_COMMENT = Tables<"t_comments">
export type THREAD_COMMENT = Tables<"threads_comments">
export type THREAD_COMMENT_REPLIED = Tables<"t_comments_replies">
export type REPORT = Tables<"reports">

export type Session = {
	id: string,
	user_id: string,
	browser: string,
	os: string,
	isBot: boolean,
	ua: string,
	cpu: string
}
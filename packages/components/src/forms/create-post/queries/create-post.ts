"use server"

import "server-only"
import { Tables } from "@repo/types/entities/supabase.ts"
import { createClient } from "@repo/lib/utils/api/server.ts";

type Posts = Tables<"posts">

export type Post = Pick<Posts, "content" | "visibility">

export async function createPostReferenced({
	visibility, content
}: Post) {
	const api = createClient();
	
	const { data, error } = await api
	.from("posts")
	.insert<Post>({
		content: content,
		visibility: visibility
	})
	.select("post_id")
	.single()
	
	if (error) throw new Error(error.message);
	
	return data;
}

type CreatePost = {
	post_id: string,
	user_nickname: string
}

export async function createPost({
	post_id, user_nickname
}: CreatePost) {
	const api = createClient();
	
	const { error } = await api
	.from("posts_users")
	.insert<CreatePost>({
		post_id: post_id,
		user_nickname: user_nickname
	})
	.single()
	
	if (error) {
		console.log(error.message);
		return false;
	}
	
	return true;
}
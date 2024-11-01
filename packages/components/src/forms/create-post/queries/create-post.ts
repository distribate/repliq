"use server"

import "server-only"
import { createClient } from "@repo/lib/utils/api/server.ts";
import { PostEntity } from '@repo/types/entities/entities-type.ts';

export type Post = Pick<PostEntity, "content" | "visibility">

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
	
	if (error) {
		throw new Error(error.message);
	}
	
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
		return false;
	}
	
	return true;
}
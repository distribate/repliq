"use server"

import { Database, Tables } from '@repo/types/entities/supabase.ts';
import { getCurrentUser } from "@repo/lib/actions/get-current-user.ts";
import { checkIsFriend } from "@repo/lib/helpers/check-is-friend.ts";
import { createClient } from '@repo/lib/utils/api/server.ts';

type RawPosts = {
	posts: Tables<"posts">
}

export type Posts = {
	commentsCount: number;
	comments: boolean;
	content: string | null;
	created_at: string;
	post_id: string;
	visibility: Database['public']['Enums']['post_visibility'];
}

export async function getPostsByNickname(
	nickname?: string, limit?: number
): Promise<Posts[] | null> {
	const currentUser = await getCurrentUser();
	if (!currentUser || !nickname) return null;
	
	const api = createClient();
	
	const currentUserNickname = currentUser.nickname;
	
	let query = api
	.from("posts_users")
	.select(`
		post_id,
		posts(post_id,created_at,content,visibility,comments)
	`)
	.order("created_at", {
		referencedTable: "posts", ascending: false
	})
	.eq("user_nickname", nickname)
	.returns<RawPosts[]>()
	
	if (limit) query.limit(limit)
	
	const { data, error } = await query;
	
	if (error) {
		throw new Error(error.message)
	}
	
	const isFriend = await checkIsFriend({
		requestedUserNickname: nickname
	})
	
	let posts: RawPosts[];
	
	if (currentUserNickname !== nickname) {
		posts = data.filter(item => {
			return item.posts.visibility === 'all' || (isFriend && item.posts.visibility === 'friends');
		});
	} else {
		posts = data;
	}
	
	const updatedPosts = await Promise.all(posts.map(async (item) => {
		const selectedPost = item.posts;
		
		const { count, error: postCommentsError } = await api
		.from("posts_comments_ref")
		.select("post_id", { count: "exact" })
		.eq("post_id", selectedPost.post_id);
		
		if (postCommentsError) throw postCommentsError;
		
		return { ...selectedPost, commentsCount: count && count || 0 };
	}));
	
	return updatedPosts;
}
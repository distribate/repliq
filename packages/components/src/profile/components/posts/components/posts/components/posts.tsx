"use client"

import { PostItemHeader } from "../../../../../../post/components/post-item/components/post-header/post-header.tsx";
import { PostItemBody } from "../../../../../../post/components/post-item/components/post-body/post-body.tsx";
import { PostItemFooter } from "../../../../../../post/components/post-item/components/post-footer/post-footer.tsx";
import { currentUserQuery } from "@repo/lib/queries/current-user-query.ts";
import { postsQuery } from "../queries/posts-query.ts";
import { BlockWrapper } from "../../../../../../wrappers/block-wrapper.tsx";
import { UserPostsSkeleton } from "../../../../../../skeletons/user-posts-skeleton.tsx";
import dynamic from "next/dynamic";
import { PostComments } from './post-comments.tsx';

const PostsNotFound = dynamic(() =>
	import("../../../../../../templates/section-not-found.tsx")
	.then(m => m.ContentNotFound)
)

const SomethingError = dynamic(() =>
	import("../../../../../../templates/something-error.tsx")
	.then(m => m.SomethingError)
)

type PostsProps = {
	nickname: string,
	name_color: string
}

export const Posts = ({
	nickname, name_color
}: PostsProps) => {
	const { data: currentUser } = currentUserQuery()
	const { data: posts, isError, isLoading } = postsQuery(nickname)
	
	if (isLoading) return <UserPostsSkeleton/>
	if (isError) return <SomethingError/>
	
	if (posts && posts.length === 0) return <PostsNotFound title="Постов не найдено."/>
	
	return (
		posts?.map((post, i) => (
			<BlockWrapper className="flex flex-col gap-y-4" key={i}>
				<PostItemHeader
					id={post.post_id}
					name_color={name_color}
					nickname={nickname}
					created_at={post.created_at}
				/>
				<PostItemBody content={post.content}/>
				<PostComments post_id={post.post_id} commentsCount={post.commentsCount}/>
				{currentUser && (
					<PostItemFooter post_id={post.post_id}/>
				)}
			</BlockWrapper>
		))
	)
}
import { PostCommentEntity } from '@repo/types/entities/entities-type.ts';

export type CommentItemProps = PostCommentEntity & {
  post_id: string
}
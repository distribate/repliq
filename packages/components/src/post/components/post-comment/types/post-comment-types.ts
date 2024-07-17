import { COMMENT } from '@repo/types/entities/entities-type.ts';

export type CommentItemProps = COMMENT & {
  post_id: string
}
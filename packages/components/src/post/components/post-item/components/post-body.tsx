import { Typography } from '@repo/ui/src/components/typography.tsx';
import { PostEntity, UserEntity } from '@repo/types/entities/entities-type.ts';
import {
  POST_CONTROL_QUERY_KEY,
  PostControlQuery,
  postControlQuery,
} from '#post/components/post-item/queries/post-control-query.ts';
import { Input } from '@repo/ui/src/components/input.tsx';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@repo/ui/src/components/button.tsx';
import { useState, ChangeEvent } from 'react';
import { useControlPost } from '#post/components/post-item/hooks/use-control-post.ts';

type PostItemBodyProps = Pick<PostEntity, 'content' | 'id'>
  & Pick<UserEntity, 'nickname'>

export const PostItemBody = ({
  content, id, nickname,
}: PostItemBodyProps) => {
  const qc = useQueryClient();
  const [ value, setValue ] = useState<string>(content);
  const { data: postControlState } = postControlQuery(id);
  const { controlPostMutation } = useControlPost();
  
  const isEdit = postControlState.isEdit;
  
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    
    setValue(value);
    qc.setQueryData(POST_CONTROL_QUERY_KEY(id), (prev: PostControlQuery) => ({
      ...prev,
      values: { content: value.length >= 1 ? value : null },
    }));
  };
  
  const handleUpdateContent = () => {
    if (!isValid) return;
    
    qc.setQueryData(
      POST_CONTROL_QUERY_KEY(id),
      (prev: PostControlQuery) =>
        ({ ...prev, isEdit: false }),
    );
    
    return controlPostMutation.mutate({ type: 'edit', id, nickname });
  };
  
  const handleCancelEdit = () => {
    qc.setQueryData(
      POST_CONTROL_QUERY_KEY(id),
      (prev: PostControlQuery) =>
        ({ ...prev, isEdit: false }),
    );
  };
  
  const isValid = value !== content && !controlPostMutation.isPending;
  
  return (
    <div className="flex w-full">
      {isEdit && (
        <div className="flex flex-col gap-2 w-full">
          <Input
            maxLength={500}
            placeholder="Расскажи о чём нибудь"
            className="!p-2 !text-[16px] bg-shark-700/10"
            value={value}
            onChange={onChange}
          />
          <div className="flex items-center gap-2 self-end">
            <Button
              disabled={!isValid}
              state="default"
              onClick={handleUpdateContent}
              className="w-fit px-4"
            >
              <Typography>Сохранить</Typography>
            </Button>
            <Button
              onClick={handleCancelEdit}
              variant="negative"
              className="w-fit px-4"
            >
              <Typography>Отмена</Typography>
            </Button>
          </div>
        </div>
      )}
      {!isEdit && <Typography>{content}</Typography>}
    </div>
  );
};
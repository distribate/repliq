import { MoreWrapper } from '../../../../wrappers/more-wrapper.tsx';
import { HoverCardItem } from '@repo/ui/src/components/hover-card.tsx';

export const ThreadCommentMoreActions = () => {
  return (
    <div className="absolute right-2 top-2">
      <MoreWrapper variant="small">
        <div className="flex flex-col gap-y-2">
          <HoverCardItem>Удалить комментарий</HoverCardItem>
          <HoverCardItem>Редактировать</HoverCardItem>
        </div>
      </MoreWrapper>
    </div>
  );
};
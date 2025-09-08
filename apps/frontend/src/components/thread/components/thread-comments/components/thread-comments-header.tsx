import { Typography } from "@repo/ui/src/components/typography";

type ThreadCommentsHeaderProps = {
  non_comments: boolean;
};

export const ThreadCommentsHeader = ({ non_comments }: ThreadCommentsHeaderProps) => {
  return (
    <div className="flex w-fit self-center bg-shark-800 rounded-md px-2 py-0.5">
      {non_comments ? (
        <Typography textSize="medium" textColor="shark_white" className="font-semibold">
          Комментариев еще нет...
        </Typography>
      ) : (
        <Typography textSize="medium" textColor="shark_white" className="font-semibold">
          Обсуждение началось
        </Typography>
      )}
    </div>
  );
};

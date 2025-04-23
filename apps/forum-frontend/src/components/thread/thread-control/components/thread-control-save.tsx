import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useThreadControl } from "#components/thread/thread-control/hooks/use-thread-control";
import { threadControlQuery } from "#components/thread/thread-control/queries/thread-control-query";

type ThreadControlSaveProps = {
  threadId: string
};

export const ThreadControlSave = ({ threadId }: ThreadControlSaveProps) => {
  const { updateThreadMutation } = useThreadControl();
  const { data: threadControlValues } = threadControlQuery();

  const handleSave = () => updateThreadMutation.mutate(threadId);

  if (!threadControlValues || !threadControlValues.state) return;

  return (
    <Button
      variant="positive"
      className="px-4"
      disabled={!threadControlValues.state.isValid}
      onClick={handleSave}
    >
      <Typography>Сохранить</Typography>
    </Button>
  );
};

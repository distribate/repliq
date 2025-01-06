import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useThreadControl } from "#thread/components/thread-control/hooks/use-thread-control.ts";
import { threadControlQuery } from "#thread/components/thread-control/queries/thread-control-query.ts";

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

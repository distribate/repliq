import { Button } from "@repo/ui/src/components/button.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { threadControlAtom, updateThreadAction } from "#components/thread/thread-control/models/thread-control.model";
import { reatomComponent } from "@reatom/npm-react";

type ThreadControlSaveProps = {
  threadId: string
};

export const ThreadControlSave = reatomComponent<ThreadControlSaveProps>(({ ctx, threadId }) => {
  const threadControlValues = ctx.spy(threadControlAtom)

  return (
    <Button
      variant="positive"
      className="px-4"
      disabled={!threadControlValues.isValid}
      onClick={() => updateThreadAction(ctx, threadId)}
    >
      <Typography>Сохранить</Typography>
    </Button>
  );
}, "ThreadControlSave")
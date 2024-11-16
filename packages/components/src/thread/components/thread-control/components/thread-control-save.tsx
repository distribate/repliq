import { Button } from '@repo/ui/src/components/button.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useThreadControl } from '#thread/components/thread-control/hooks/use-thread-control.ts';
import { ThreadModel } from '#thread/queries/get-thread-model.ts';

type ThreadControlSaveProps = {
  threadId: Pick<ThreadModel, "id">["id"],
  isValid?: boolean
}

export const ThreadControlSave = ({
  isValid, threadId
}: ThreadControlSaveProps) => {
  const { updateThreadMutation } = useThreadControl();
  
  const handleSave = () => updateThreadMutation.mutate(threadId)
  
  return (
    <Button
      variant="positive"
      className="px-4"
      disabled={!isValid}
      onClick={handleSave}
    >
      <Typography>Сохранить</Typography>
    </Button>
  )
}
import { ThreadControlProps } from '../types/thread-control-types.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { ThreadControlVisibility } from './thread-control-visibility.tsx';
import { ThreadControlPermission } from './thread-control-permission.tsx';
import { ThreadControlAutoHide } from './thread-control-autohide.tsx';
import { Button } from '@repo/ui/src/components/button.tsx';
import { ThreadControlMain } from './thread-control-main.tsx';
import { EyeOff, PencilLine, StickyNote, TimerReset } from 'lucide-react';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export const ThreadControl = ({
  id: threadId,
}: Pick<ThreadControlProps, 'id'>) => {
  return (
    <div className="flex flex-col items-center px-4 gap-2 w-full">
      <div className="flex items-center gap-2 w-full">
        <Dialog>
          <DialogTrigger className="w-full">
            <Button
              className="w-full"
              state="default"
            >
              <div className="flex items-center gap-2">
                <EyeOff size={20} />
                <Typography>Видимость треда</Typography>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-4xl">
            <ThreadControlVisibility />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className="w-full">
            <Button
              className="w-full"
              state="default"
            >
              <div className="flex items-center gap-2">
                <StickyNote size={20} />
                <Typography>Права</Typography>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-4xl">
            <ThreadControlPermission />
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Dialog>
          <DialogTrigger>
            <Button
              className="w-full"
              state="default"
            >
              <div className="flex items-center gap-2">
                <TimerReset size={20} />
                <Typography>Авто-удаление</Typography>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-4xl">
            <ThreadControlAutoHide />
          </DialogContent>
        </Dialog>
        <Dialog>
          <DialogTrigger className="w-full">
            <Button className="w-full" state="default">
              <div className="flex items-center gap-2">
                <PencilLine size={20} />
                <Typography>Редактировать</Typography>
              </div>
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 max-w-4xl">
            <ThreadControlMain id={threadId} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
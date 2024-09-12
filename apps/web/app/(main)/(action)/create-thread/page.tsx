import { CreateThreadForm } from '@repo/components/src/forms/create-thread/components/create-thread-form.tsx';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';

export default async function CreateThreadPage() {
  return (
    <div className="flex flex-col w-full gap-4">
      <BlockWrapper className="flex flex-col gap-y-2 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Создание треда
        </Typography>
      </BlockWrapper>
      <CreateThreadForm />
    </div>
  );
}
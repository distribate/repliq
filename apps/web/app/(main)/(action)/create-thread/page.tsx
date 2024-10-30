import { CreateThreadForm } from '@repo/components/src/forms/create-thread/components/create-thread-form.tsx';
import { BlockWrapper } from '@repo/components/src/wrappers/block-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { FormThreadRecommendations } from '@repo/components/src/forms/create-thread/components/form-thread-recommendations.tsx';

export default async function CreateThreadPage() {
  return (
    <div className="flex flex-col w-full gap-4">
      <BlockWrapper className="flex flex-col gap-y-4 w-full !p-4">
        <Typography textSize="big" textColor="shark_white">
          Создание треда
        </Typography>
        <FormThreadRecommendations/>
      </BlockWrapper>
      <CreateThreadForm />
    </div>
  );
}
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { PostAdditionalForm } from '../../../../../forms/create-post/components/post-additional-form.tsx';
import { PostPhotoForm } from '../../../../../forms/create-post/components/post-photo-form.tsx';
import { PostVideoForm } from '../../../../../forms/create-post/components/post-video-form.tsx';
import { PostPublishButton } from '../../../../../forms/create-post/components/post-publish-button.tsx';

export const CreatePostActiveSection =  () => {
  return (
    <div className="flex flex-col py-2 w-full">
      <div className="flex flex-col">
        <Separator orientation="horizontal" />
        <div className="flex items-center pt-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <PostAdditionalForm />
            <div className="flex gap-4 items-start">
              <PostPhotoForm />
              <PostVideoForm />
            </div>
          </div>
          <PostPublishButton />
        </div>
      </div>
    </div>
  )
}
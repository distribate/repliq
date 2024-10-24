import { Typography } from '@repo/ui/src/components/typography.tsx';
import { getAuthBackgroundImages } from '@repo/lib/queries/get-auth-background-images.ts';
import Image from 'next/image';
import { getPublicUrlFromStorage } from '@repo/lib/utils/storage/get-public-url-from-storage.ts';
import { Dialog, DialogContent, DialogTrigger } from '@repo/ui/src/components/dialog.tsx';
import { AuthBackgroundImagesAddButton } from './auth-bg-images-add-button.tsx';
import { OctagonAlert, X } from 'lucide-react';
import { AuthBackgroundImagesDeleteButton } from './auth-bg-images-delete-button.tsx';
import { HoverCardWrapper } from '../../../../../wrappers/hover-card-wrapper.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';

type AuthImages = {
  name: string,
  url: string
}

async function getAuthImages() {
  const authBackgroundImages = await getAuthBackgroundImages();
  
  if (!authBackgroundImages) {
    return null;
  }
  
  let images: Array<AuthImages> = [];
  
  for (let i = 0; i < authBackgroundImages.length; i++) {
    const imageName = authBackgroundImages[i]?.name;
    
    const image = await getPublicUrlFromStorage({
      bucket: 'static',
      fileName: `auth_background/${imageName}`,
    });
    
    images.push({
      name: imageName, url: image,
    });
  }
  
  if (images.length === 0) return null;
  
  return images;
}

export const AuthBackgroundImages = async() => {
  const authImages = await getAuthImages();
  
  return (
    <div className="flex flex-col bg-shark-900/60 relative p-4 rounded-md gap-4 w-fit h-fit">
      <Typography textSize="big">
        Фоновые изображения авторизации
      </Typography>
      {authImages && (
        <>
          <div className="flex absolute top-6 right-4 w-fit">
            <HoverCardWrapper
              trigger={
                <OctagonAlert size={20} className="text-shark-300" />
              }
              content={
                <div className="flex flex-col gap-2 p-2 w-full h-fit">
                  <Typography textSize="medium">
                    Ограничения
                  </Typography>
                  <Separator />
                  <Typography textSize="small" className="text-shark-300">
                    размер до 10 МБ, всего 50 файлов доступно к загрузке (еще {50 - authImages.length})
                  </Typography>
                </div>
              }
            />
          </div>
          <div className="grid grid-cols-5 auto-rows-auto gap-2 w-fit">
            {authImages.slice(0, 50).map((image, i) => (
              <Dialog key={i}>
                <DialogTrigger className="group hover:brightness-75 duration-300 relative">
                  <Image
                    src={image.url}
                    alt=""
                    height={500}
                    width={500}
                    className="w-[116px] h-[116px] object-cover rounded-md"
                  />
                  <AuthBackgroundImagesDeleteButton imageName={image.name} />
                </DialogTrigger>
                <DialogContent className="max-w-6xl p-0">
                  <Image
                    key={i}
                    src={image.url}
                    alt=""
                    height={1920}
                    width={1080}
                    quality={100}
                    className="w-full h-full rounded-md"
                  />
                </DialogContent>
              </Dialog>
            ))}
            <AuthBackgroundImagesAddButton />
          </div>
        </>
      )}
    </div>
  );
};
import { GearLoader } from '@repo/ui/src/components/gear-loader.tsx';

export const DialogLoader = () => {
  return (
    <div className="flex w-full h-full justify-center items-center p-6">
      <GearLoader />
    </div>
  );
};
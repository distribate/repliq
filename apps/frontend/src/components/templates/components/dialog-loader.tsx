import { WindowLoader } from "@repo/ui/src/components/window-loader";

export const DialogLoader = () => {
  return (
    <div className="flex w-full h-full justify-center items-center p-6">
      <WindowLoader />
    </div>
  );
};

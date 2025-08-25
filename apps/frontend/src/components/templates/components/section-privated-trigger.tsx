import { IconLock } from "@tabler/icons-react";

export const SectionPrivatedTrigger = () => {
  return (
    <div
      className="flex absolute -right-1 -bottom-1 rounded-sm px-[4px] py-1text-shark-300 font-normal
        bg-shark-900 peer-data-[state=inactive]:hidden"
    >
      <IconLock size={12} />
    </div>
  );
};

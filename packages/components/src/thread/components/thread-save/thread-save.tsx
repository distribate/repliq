import { BookMarked } from "lucide-react";

export const ThreadSave = () => {
  return (
    <div className="flex items-center rounded-[8px] h-full cursor-pointer py-2 px-4 hover:bg-shark-700 bg-shark-800 overflow-hidden">
      <BookMarked size={18} className="text-shark-300" />
    </div>
  );
};
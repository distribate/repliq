import { BookMarked } from 'lucide-react';

export const ThreadSave = () => {
  return (
    <div className="flex items-center rounded-md h-full cursor-pointer py-2 px-4 border-shark-700 border bg-shark-900/60 overflow-hidden">
      <BookMarked size={20} className="text-shark-300" />
    </div>
  );
};
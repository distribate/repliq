import { HTMLAttributes } from 'react';

interface LibraryBackgroundItemsProps
  extends HTMLAttributes<HTMLDivElement> {
}

export const LibraryBackgroundImageItem = ({
  children, ...props
}: LibraryBackgroundItemsProps) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-shark-800 relative hover:bg-white/10
		 cursor-pointer group transition-all duration-150 w-full" {...props}>
      {children}
    </div>
  )
}
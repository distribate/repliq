import { Input } from '@repo/ui/src/components/input';
import { PageConventionProps } from '@repo/types/global';

type SearchBrowseTypeKeys = 'users' | 'threads';

const SEARCH_BROWSE_TYPE: Record<SearchBrowseTypeKeys, SearchBrowseTypeKeys> = {
  users: 'users',
  threads: 'threads',
};

export default async function SearchPage({
  searchParams,
}: PageConventionProps) {
  const { type } = searchParams;
  
  const query: boolean = typeof type === "string"
    && (type in SEARCH_BROWSE_TYPE);
  
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {!query ? (
        <>
          <div className="flex items-center py-4 px-2 h-[80px] bg-shark-950 w-full rounded-lg">
            <Input
              placeholder="Поиск..."
              className="w-full h-full !rounded-md text-xl"
              backgroundType="transparent"
            />
          </div>
          
        </>
      ) : (
        <>
          {type === SEARCH_BROWSE_TYPE['users'] && (
            <>
              Users
            </>
          )}
          {type === SEARCH_BROWSE_TYPE['threads'] && (
            <>
              Threads
            </>
          )}
        </>
      )}
    </div>
  );
}
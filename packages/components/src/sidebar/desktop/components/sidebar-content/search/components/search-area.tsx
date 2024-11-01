import { searchQuery, SearchTopic, SearchUser } from '../queries/search-query.ts';
import { SearchResultsSkeleton } from './search-results-skeleton.tsx';
import { SearchAreaNotFound } from '#templates/search-area-not-found.tsx';
import { SearchUserItem } from '#cards/components/search/search-user-card.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { ThreadEntity } from '@repo/types/entities/entities-type.ts';

type SearchCardTopicProps = Pick<ThreadEntity, "id" | "title">

const SearchCardTopic = ({
	title, id
}: SearchCardTopicProps) => {
  return (
    <Link href={THREAD_URL + id} className="flex items-center gap-2 p-2 bg-shark-900 rounded-md">
      {title}
    </Link>
  );
};

export const SearchArea = () => {
  const { data: searched, isFetching } = searchQuery();
  const { push } = useRouter();
  
  const typeIsUsers = searched.type === 'users';
  const typeIsTopics = searched.type === 'threads';
  
  if (!searched.results || !searched.value) return null;
  
  return (
    <div className="flex flex-col gap-1 w-full max-h-[400px] overflow-y-scroll">
      {searched.results && searched.results.length === 0 ? (
        <SearchAreaNotFound searchValue={searched.value || null} />
      ) : (
        isFetching ? <SearchResultsSkeleton /> : (
          <>
            {typeIsUsers && (
              (searched.results as SearchUser[]).map((item => (
                <SearchUserItem
                  key={item.nickname}
                  nicknameColor={item.name_color}
                  nickname={item.nickname}
                />
              )))
            )}
            {typeIsTopics && (
              (searched.results as SearchTopic[]).map((item => (
                <SearchCardTopic key={item.id} {...item} />
              )))
            )}
            {searched.results.length >= 5 && (
              <div
                onClick={() => push(`/search?type=${searched.type}`)}
                className="cursor-pointer"
              >
                <Typography textColor="gray" textSize="small">
                  показать больше
                </Typography>
              </div>
            )}
          </>
        )
      )}
    </div>
  );
};
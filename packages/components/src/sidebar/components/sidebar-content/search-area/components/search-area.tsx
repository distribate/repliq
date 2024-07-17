import { searchQuery, SearchTopic, SearchUser } from "../queries/search-query.ts";
import { SearchUserItem } from "../../../../../cards/components/search/search-user-card.tsx";
import { SearchAreaNotFound } from "../../../../../templates/search-area-not-found.tsx";
import { SearchResultsSkeleton } from './search-results-skeleton.tsx';

type SearchCardTopicProps = {
	title: string
}

const SearchCardTopic = ({ title }: SearchCardTopicProps) => {
	return <div className="flex px-4 py-2 rounded-md bg-shark-950">{title}</div>
}

export const SearchArea = () => {
	const { data: searched, isFetching } = searchQuery()
	
	const typeIsUsers = searched.type === 'users';
	const typeIsTopics = searched.type === 'threads'
	
	if (!searched.results || !searched.value) return null;
	
	return (
		<div className="flex flex-col gap-y-1 w-full max-h-[400px] overflow-y-scroll">
			{searched.results && searched.results.length === 0 ? (
				<SearchAreaNotFound searchValue={searched.value || null}/>
			) : (
				isFetching ? <SearchResultsSkeleton/> : (
					<>
						{typeIsUsers && (
							(searched.results as SearchUser[]).map((item => (
								<SearchUserItem nicknameColor={item.name_color} key={item.nickname} nickname={item.nickname} />
							)))
						)}
						{typeIsTopics && (
							(searched.results as SearchTopic[]).map((item => (
								<SearchCardTopic key={item.id} title={item.title}/>
							)))
						)}
					</>
				)
			)}
		</div>
	)
}
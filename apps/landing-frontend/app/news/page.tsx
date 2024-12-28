import { MainLayoutPage } from "@repo/landing-components/src/layout/main-layout";
import { NewsPageList } from "@repo/landing-components/src/news/news-page-list";

export const metadata = {
	title: "Новости"
}

export default function NewsPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div id="news" className="full-screen-section flex flex-col gap-10 items-center justify-start">
				<div className="flex flex-col responsive items-center h-full justify-center gap-10 relative top-32 pb-48">
					<NewsPageList/>
				</div>
			</div>
		</MainLayoutPage>
	)
}
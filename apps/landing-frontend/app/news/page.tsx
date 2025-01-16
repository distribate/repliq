import { MainLayoutPage } from "@repo/landing-components/src/layout/main-layout";
import { NewsPageList } from "@repo/landing-components/src/news/news-page-list";
import { Typography } from "@repo/landing-ui/src/typography";
import { NewsPageSearch } from "@repo/landing-components/src/news/news-page-search";
import { NewsPageListInView } from "@repo/landing-components/src/news/news-page-list-scroller";

export const metadata = {
	title: "Новости",
	description:
		"Будьте в курсе последних обновлений, событий и акций на нашем сервере Fasberry. Узнайте первыми о новых функциях и специальных мероприятиях!",
	keywords: [
		"Fasberry новости",
		"обновления сервера Fasberry",
		"события Fasberry",
		"новые функции Fasberry",
		"акции Fasberry сервера",
		"новости игрового сервера",
	],
	author: "Fasberry Server Team",
	robots: "index, follow",
	canonical: "https://fasberry.su/news",
	openGraph: {
		title: "Новости сервера Fasberry | Будьте в курсе событий",
		description:
			"Последние новости и обновления с нашего сервера Fasberry. Узнайте о новых возможностях, ивентах и акциях!",
		url: "https://fasberry.su/news",
		type: "website",
		images: [
			{
				url: "https://fasberry.su/images/backgrounds/bees.jpg",
				alt: "Новости сервера Fasberry",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Новости сервера Fasberry | Обновления и события",
		description:
			"Следите за всеми важными обновлениями и мероприятиями на нашем сервере Fasberry. Не пропустите интересные события!",
		images: ["https://fasberry.su/images/backgrounds/bees.jpg"],
	},
}

export default function NewsPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div className="full-screen-section flex flex-col gap-10 items-center justify-start">
				<div className="flex flex-col responsive items-center h-full justify-center gap-10 relative top-32 pb-48">
					<Typography className="text-4xl font-semibold text-white">
						Новости
					</Typography>
					<NewsPageSearch />
					<div
						id="list"
						className="grid gris-cols-1 
        			sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 auto-rows-auto gap-4 w-full h-full"
					>
						<NewsPageList />
					</div>
					<NewsPageListInView />
				</div>
			</div>
		</MainLayoutPage>
	)
}
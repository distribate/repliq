import { MainLayoutPage } from "@repo/landing-components/src/layout/main-layout";
import { WikiContent } from "@repo/landing-components/src/wiki/content/wiki-content";
import { Suspense } from "react";

export const metadata = {
	title: "Справочник",
	description:
		"Полная википедия нашего Fasberry проекта: гайды, описания режимов, правила, команды и многое другое для игроков. Узнай всё о нашем сервере и сообществе!",
	keywords: [
		"Fasberry википедия",
		"гайды по Fasberry серверу",
		"режимы Fasberry",
		"правила Fasberry сервера",
		"команды Fasberry сервера",
		"информация о Fasberry сервере",
	],
	author: "Fasberry Wiki Team",
	robots: "index, follow",
	canonical: "https://fasberry.su/wiki",
	openGraph: {
		title: "Википедия Fasberry Проекта | Гид для игроков",
		description:
			"Исследуй нашу википедию проекта и узнай всё: от правил и гайдов до уникальных функций сервера. Твое приключение начинается здесь!",
		url: "https://fasberry.su/wiki",
		type: "website",
		images: [
			{
				url: "https://fasberry.su/images/backgrounds/rules_background.png",
				alt: "Википедия Fasberry проекта",
				width: 1200,
				height: 630,
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Википедия Fasberry Проекта | Узнай всё о сервере",
		description:
			"Гайды, правила, команды и многое другое на нашей википедии Fasberry проекта. Присоединяйся и стань экспертом!",
		images: ["https://fasberry.su/images/backgrounds/rules_background.png"],
	},
}

export default async function WikiPage() {
	return (
		<MainLayoutPage>
			<Suspense>
				<WikiContent />
			</Suspense>
		</MainLayoutPage>
	)
}
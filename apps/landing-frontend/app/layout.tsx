import type { Metadata } from "next";
import { ReactNode } from "react";
import { TooltipProvider } from "@repo/landing-ui/src/tooltip";
import { Toaster } from "sonner";
import { NextThemeProvider } from "@repo/lib/providers/theme-provider.tsx";
import { Header } from "@repo/landing-components/src/header/header";
import { Footer } from "@repo/landing-components/src/footer/footer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryProvider } from '@repo/lib/providers/query-provider.tsx';
import "../globals.css";
import "../styles/minecraft-weather.css"
import "../styles/minecraft-theme.css"
import { Analytics } from "@vercel/analytics/react"

export const metadata: Metadata = {
	title: {
		template: "%s | Fasberry",
		default: "Fasberry"
	},
	description: "Официальная страница майнкрафт-проекта Fasberry. Жанр: RP, RPG, полу-ванила. 1.20.1+. Играть: play.fasberry.su.",
	metadataBase: new URL('https://fasberry.su/'),
	category: 'videogame',
	robots: {
		index: true,
		follow: true,
		nocache: true,
		googleBot: {
			index: true,
			follow: true,
			noimageindex: true,
			'max-video-preview': -1,
			'max-image-preview': 'large',
			'max-snippet': -1,
		},
	},
	creator: "Fasberry Project Team",
	keywords: ["fasberry", "фесберри", "фесберри проект", "фасберри", "fasberryproject", "minecraft",
		"майнкрафт", "майнкрафт играть", "minecraft play", "сервера майнкрафт бесплатно", "список серверов майнкрафта",
		"полу-ванильные сервера майнкрафта", "полуванила майнкрафт", "rp сервер майнкрафт", "rpg сервер майнкрафт",
		"rp rpg сервер майнкрафт", "город в майнкрафте сервер", "minecraft server", "выживание", "survival minecraft",
		"survival", "smp", "fasberry project", "minecraft fasberry", "minecraft server play", "майнкрафт сервер"],
	formatDetection: {
		email: true,
		address: true,
		telephone: true,
	},
	alternates: {
		canonical: '/',
	},
	openGraph: {
		title: "Fasberry Project",
		description: "Сколько хороших и комфортных для вас майнкрафт-серверов вы знаете/знали? Теперь знаете на один больше.",
		url: "https://fasberry.su/",
		locale: "ru_RU",
		type: 'website',
		siteName: "Официальный сайт майнкрафт сервера Fasberry.",
	},
	twitter: {
		title: "Fasberry Project",
		description: "Сколько хороших и комфортных для вас майнкрафт-серверов вы знаете/знали? Теперь знаете на один больше.",
		images: "https://fasberry.su/favicon.ico"
	},
};

export default function RootLayout({
	children,
}: Readonly<{ children: ReactNode }>) {
	return (
		<html lang="ru" suppressHydrationWarning>
			<body>
				<QueryProvider>
					<ReactQueryDevtools />
					<NextThemeProvider>
						<Toaster
							position="top-left"
							richColors
							icons={{
								info: <img width={32} height={32} alt="" loading="lazy" draggable={false} src="/images/minecraft/icons/book_big.webp" />,
								error: <img width={32} height={32} alt="" loading="lazy" draggable={false} src="/images/minecraft/icons/book_big.webp" />,
								success: <img width={32} height={32} alt="" loading="lazy" draggable={false} src="/images/minecraft/icons/book_big.webp" />,
								warning: <img width={32} height={32} alt="" loading="lazy" draggable={false} src="/images/minecraft/icons/book_big.webp" />
							}}
						/>
						<TooltipProvider>
							<Header />
							{children}
							<Footer />
						</TooltipProvider>
					</NextThemeProvider>
				</QueryProvider>
				<Analytics />
			</body>
		</html>
	);
}
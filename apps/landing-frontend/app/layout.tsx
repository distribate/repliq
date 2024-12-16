import type { Metadata } from "next";
import { ReactNode } from "react";
import { TooltipProvider } from "#/ui/tooltip";
import { Toaster } from "sonner";
import { NextThemeProvider } from "#/providers/theme-provider";
import { Header } from "#/components/header/header";
import { Footer } from "#/components/footer/footer";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryProvider } from '@repo/lib/providers/query-provider.tsx';
import "#/styles/globals.css";
import "#/styles/minecraft-weather.css"
import "#/styles/minecraft-theme.css"

export const metadata: Metadata = {
	title: {
		template: "%s | Fasberry",
		default: "Fasberry"
	},
	description: "Официальная страница майнкрафт-проекта Fasberry. Жанр: RP, RPG, полу-ванила. 1.20.1+. Играть: play.fasberry.ru.",
	metadataBase: new URL('https://fasberry.io/'),
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
	creator: "distribate",
	authors: [ { name: "distribate", url: "https://t.me/shaftem" } ],
	keywords: [ "fasberry", "фесберри", "фесберри проект", "фасберри", "fasberryproject", "minecraft",
		"майнкрафт", "майнкрафт играть", "minecraft play", "сервера майнкрафт бесплатно", "список серверов майнкрафта",
		"полу-ванильные сервера майнкрафта", "полуванила майнкрафт", "rp сервер майнкрафт", "rpg сервер майнкрафт",
		"rp rpg сервер майнкрафт", "город в майнкрафте сервер", "minecraft server", "выживание", "survival minecraft",
		"survival", "smp", "fasberry project", "minecraft fasberry", "minecraft server play", "майнкрафт сервер" ],
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
		url: "https://fasberry.io/",
		locale: "ru_RU",
		type: 'website',
		siteName: "Официальный сайт майнкрафт сервера Fasberry.",
	},
	twitter: {
		title: "Fasberry Project",
		description: "Сколько хороших и комфортных для вас майнкрафт-серверов вы знаете/знали? Теперь знаете на один больше.",
		images: "https://fasberry.io/favicon.ico"
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
				<Toaster position="top-left" richColors />
				<TooltipProvider>
					<Header/>
					{children}
					<Footer/>
				</TooltipProvider>
			</NextThemeProvider>
		</QueryProvider>
		{/*<script*/}
		{/*	type="text/javascript"*/}
		{/*	id="metrika-counter"*/}
		{/*	dangerouslySetInnerHTML={{*/}
		{/*		__html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};*/}
    {/*          m[i].l=1*new Date();*/}
    {/*          for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}*/}
    {/*          k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})*/}
    {/*          (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");*/}
    {/*       */}
    {/*          ym(95784050, "init", {*/}
    {/*               clickmap:true,*/}
    {/*               trackLinks:true,*/}
    {/*               accurateTrackBounce:true*/}
    {/*          });`*/}
		{/*	}}*/}
		{/*/>*/}
		{/*<noscript>*/}
		{/*	<img src="https://mc.yandex.ru/watch/95784050" style={{ position: 'absolute', left: '-9999px' }} alt='' width={400} height={400} />*/}
		{/*</noscript>*/}
		</body>
		</html>
	);
}
import { MainLayoutPage } from "#/components/layout/main-layout";
import { MapBlock } from "#/components/map/map-block";
import { Typography } from "#/ui/typography";

const serverMap = [
	// {
	// 	name: "Bisquite Survival",
	// 	href: "http://map.fasberry.ru",
	// 	image: "/images/minecraft/icons/map_zoom.webp"
	// },
]

export const metadata = {
	title: "Карта"
}

export default async function MapPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div
				className="bg-right lg:bg-center"
				style={{ backgroundImage: `url("/images/static/dirt.png")` }}
			>
				<div className="flex flex-row flex-wrap gap-x-12 gap-y-4 items-center justify-center w-full min-h-screen">
					{!serverMap.length && (
						<Typography className="text-neutral-400" size="xl">
							Пока ничего нет...
						</Typography>
					)}
					{/*{serverMap.map((item, idx) => (*/}
					{/*	<MapBlock key={idx} image={item.image} name={item.name} link={item.href}/>*/}
					{/*))}*/}
				</div>
			</div>
		</MainLayoutPage>
	)
}
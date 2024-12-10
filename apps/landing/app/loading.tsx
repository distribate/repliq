import { MainLayoutPage } from "#/components/layout/main-layout";
import { Typography } from "#/ui/typography";

export default async function Loading() {
	return (
		<MainLayoutPage variant="with_section">
			<div
				className="bg-right lg:bg-center"
				style={{ backgroundImage: `url("/images/static/dirt.png")` }}
			>
				<div className="flex flex-col gap-x-12 gap-y-4 items-center justify-center w-full min-h-screen">
					<Typography>
						Загрузка уровня
					</Typography>
					<Typography>
						Все уже почти готово...
					</Typography>
				</div>
			</div>
		</MainLayoutPage>
	)
}
import { DialogWrapper } from "#/components/wrappers/dialog-wrapper";
import { Typography } from "#/ui/typography";
import { News } from "#/lib/queries/get-news";
import dayjs from "dayjs";
import { NewsImage } from "#/components/news/news-image";

export const NewsItemWrapper = ({
	images, created_at, description, title, media_links
}: Omit<News, "id">) => {
	
	const formattedTime = dayjs(created_at).format("DD.MM.YYYY HH:mm")
	
	return (
		<DialogWrapper
			title={title}
			classNames={{
				content: "flex flex-col xl:flex-row rounded-[8px] p-0 w-6xl overflow-hidden gap-x-6",
				trigger: "rounded-[8px] overflow-hidden border-[#3d3d3d]/50 border-2"
			}}
			trigger={
				<>
					<div className="h-[200px] lg:h-[444px] w-full overflow-hidden">
						{images?.map((image, idx) => (
							<NewsImage
								key={idx}
								src={image}
								className="min-h-[400px] w-full h-full object-cover"
							/>
						))}
					</div>
					<div className="flex justify-between items-center overflow-hidden p-6 w-full gap-y-4">
						<Typography
							color="black"
							position="left"
							size="xl"
							text_color="adaptiveWhiteBlack"
							className="truncate"
						>
							{title}
						</Typography>
						<Typography color="black" size="lg" text_color="adaptiveGray">
							{formattedTime}
						</Typography>
					</div>
				</>
			}
			content={
				<>
					{images && (
						<div className="h-[220px] sm:h-[360px] md:h-[420px] xl:w-2/3 xl:h-6/7 w-full overflow-hidden">
							{images.map((image, idx) => (
								<NewsImage
									src={image}
									key={idx}
									className="rounded-[8px] object-cover w-full h-full"
								/>
							))}
						</div>
					)}
					<div className="flex flex-col justify-between w-full xl:w-3/4 py-6 pl-2 pr-6">
						<div className="flex flex-col gap-y-4">
							<Typography text_color="adaptiveWhiteBlack" className="text-xl lg:text-3xl">
								{title}
							</Typography>
							<Typography text_color="adaptiveWhiteBlack" className="text-md lg:text-xl">
								{description}
							</Typography>
						</div>
						<Typography text_color="adaptiveWhiteBlack" className="text-sm self-end lg:text-base">
							{formattedTime}
						</Typography>
					</div>
				</>
			}
		/>
	)
}
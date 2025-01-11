import { MainLayoutPage } from "@repo/landing-components/src/layout/main-layout";
import { Typography } from "@repo/landing-ui/src/typography";
import { MAIL_FASBERRY_SUPPORT, TELEGRAM_CHANNEL_LINK, VK_GROUP_LINK } from "@repo/shared/wiki//data/configs";
import Link from "next/link";

export default async function InfoContactsPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div
				id="contacts-n-feedback"
				className="flex flex-col min-h-screen responsive mx-auto py-36 gap-y-6"
			>
				<Typography className="text-black dark:text-white text-3xl">
					Контакты
				</Typography>
				<div className="flex flex-col gap-y-8 rounded-[8px]">
					<div
						className="flex flex-col gap-y-4 border-2 border-[#454545] hover:duration-300 duration-300 rounded-[8px] p-4">
						<Typography className="text-project-color text-xl">
							Социальные сети и мессенджеры
						</Typography>
						<div className="flex flex-col text-white text-md lg:text-lg gap-y-4">
							<Typography>Группа VK:&nbsp;
								<Link
									href='https://vk.com/fasberry'
									className="relative group"
								>
									<span
										className="text-white group-hover:text-project-color-pink group-hover:inline hidden absolute left-0 duration-300 group-hover:duration-300">
										→&nbsp;
									</span>
									<span
										className="group-hover:text-project-color-pink duration-300 relative group-hover:duration-300 right-0 group-hover:-right-6">
										{VK_GROUP_LINK}
									</span>
								</Link>
							</Typography>
							<Typography>Канал в Telegram:&nbsp;
								<Link
									href='https://t.me/fasberry'
									className="relative group"
								>
									<span
										className="text-white group-hover:text-project-color-pink group-hover:inline hidden absolute left-0 duration-300 group-hover:duration-300"
									>
										→&nbsp;
									</span>
									<span
										className="group-hover:text-project-color-pink duration-300 relative group-hover:duration-300 right-0 group-hover:-right-6"
									>
										{TELEGRAM_CHANNEL_LINK}
									</span>
								</Link>
							</Typography>
						</div>
					</div>
					<div
						className="flex flex-col gap-y-4 border-2 border-[#454545] hover:duration-300 duration-300 rounded-[8px] p-4">
						<Typography className="text-project-color text-xl">
							Электронная почта
						</Typography>
						<div className="flex flex-col gap-y-4">
							<Typography className="hover:text-project-color-pink duration-300 hover:duration-300 text-white text-md lg:text-lg">
								<a
									href={`mailto:${MAIL_FASBERRY_SUPPORT}`}
									target="_blank"
								>
									{MAIL_FASBERRY_SUPPORT}
								</a>
							</Typography>
						</div>
					</div>
				</div>
			</div>
		</MainLayoutPage>
	)
}
import { DialogWrapper } from "#/components/wrappers/dialog-wrapper";
import { Button } from "#/ui/button";
import { Typography } from "#/ui/typography";
import { TooltipWrapper } from "#/components/wrappers/tooltip-wrapper";
import { DialogClose } from "#/ui/dialog";
import Image from "next/image";
import { toast } from "sonner";

const MAIN_IP = process.env.MINECRAFT_SERVER_FASBERRY_IP

export const HowToConnectOnServer = () => {
	const actionCopyboard = async() => {
		await navigator.clipboard.writeText(MAIN_IP || "play.fasberry.su");
		
		toast.success("IP успешно скопирован!", {
			icon: <Image width={40} height={40} alt="IP copied!" loading="lazy" src="/images/minecraft/icons/book_big.webp"/>
		})
	}
	
	return (
		<DialogWrapper
			title="Инструкция как зайти на сервер"
			triggerAsChild
			classNames={{
				trigger: "min-w-[360px] w-full",
				content: "max-w-6xl h-3/4 bg-transparent border-none p-0"
			}}
			trigger={
				<Button
					className="w-full h-[54px] lg:h-[56px] group hover:bg-[#088d47]/80 hover:duration-300
					duration-100 ease-in-out bg-[#05b458]/80 backdrop-filter backdrop-blur-lg"
				>
					<Typography className="!text-white text-2xl text-shadow-xl">
						<span className="inline-block duration-150 group-hover:duration-300 group-hover:translate-x-2">⏵</span>
						&nbsp;Начать играть&nbsp;
						<span className="inline-block duration-150 group-hover:duration-300 group-hover:-translate-x-2">⏴</span>
					</Typography>
				</Button>
			}
			content={
				<div
					className="flex justify-center items-center bg-repeat border-4 border-black h-full w-full"
					style={{ backgroundImage: `url("images/static/dirt.png")` }}
				>
					<div className="flex flex-col gap-y-6 justify-between">
						<div className="flex flex-col gap-y-2">
							<Typography className="text-neutral-400" size="base">
								Название сервера
							</Typography>
							<div className="bg-black py-2 px-2 border-2 border-neutral-500 w-100 md:w-96">
								<Typography size="base" position="left" className="text-white">
									Сервер Minecraft
								</Typography>
							</div>
							<Typography size="base" className="text-neutral-400">
								Адрес сервера
							</Typography>
							<TooltipWrapper
								trigger={
									<Typography
										size="base"
										position="left"
										onClick={() => actionCopyboard()}
										className="cursor-pointer bg-black py-2 px-2 border-2 text-white border-neutral-500 w-100 md:w-96"
									>
										play.fasberry.su
									</Typography>
								}
								content={
									<Typography size="lg" className="text-neutral-400">
										Скопировать IP
									</Typography>
								}
							/>
						</div>
						<div className="flex flex-col gap-y-2">
							<TooltipWrapper
								classNames={{ content: "w-fit max-w-[460px]" }}
								trigger={
									<div className="button w-full md:w-96 px-2 py-1">
										<Typography
											shadow="xl"
											className="text-shadow-xl text-[0.8rem] lg:text-base text-white"
											position="center"
										>
											Наборы ресурсов: Включены
										</Typography>
									</div>
								}
								content={
									<Typography size="lg" className="text-neutral-400">
										На сервере используется свой ресурспак. Эту опцию рекомендуется оставить включенной!
									</Typography>
								}
							/>
							<DialogClose>
								<div className="button w-full md:w-96 px-2 py-1">
									<Typography className="text-shadow-xl text-[0.8rem] text-white lg:text-base" position="center">
										Готово
									</Typography>
								</div>
							</DialogClose>
						</div>
					</div>
				</div>
			}
		/>
	)
}
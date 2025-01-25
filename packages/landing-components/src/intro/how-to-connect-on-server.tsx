import { DialogWrapper } from "@repo/landing-components/src/wrappers/dialog-wrapper";
import { Button } from "@repo/landing-ui/src/button";
import { Typography } from "@repo/landing-ui/src/typography";
import { TooltipWrapper } from "@repo/landing-components/src/wrappers/tooltip-wrapper";
import { DialogClose } from "@repo/landing-ui/src/dialog";
import { toast } from "sonner";
import { serverIpQuery } from "@repo/lib/queries/server-ip-query";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@repo/landing-ui/src/tooltip";

export const actionCopyboard = async (ip: string) => {
	await navigator.clipboard.writeText(ip);

	return toast.success("IP успешно скопирован!")
}

export const HowToConnectOnServer = () => {
	const { data: ip, isLoading } = serverIpQuery()

	return (
		<DialogWrapper
			title="Инструкция как зайти на сервер"
			triggerAsChild
			classNames={{
				trigger: "min-w-[360px] h-[54px] w-full",
				content: "max-w-6xl h-3/4 bg-transparent border-none p-0"
			}}
			trigger={
				<Button
					variant="positive"
					className="w-full rounded-xl group hover:duration-300 duration-100 ease-in-out backdrop-blur-lg"
				>
					<Typography className="text-white text-2xl text-shadow-xl">
						<span className="inline-block duration-150 group-hover:duration-300 group-hover:translate-x-2">
							⏵
						</span>
						&nbsp;Начать играть&nbsp;
						<span className="inline-block duration-150 group-hover:duration-300 group-hover:-translate-x-2">
							⏴
						</span>
					</Typography>
				</Button>
			}
			content={
				<div
					className="flex justify-center items-center bg-repeat border-4 border-black h-full w-full"
					style={{ backgroundImage: `url("images/static/dirt.webp")` }}
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
										onClick={() => actionCopyboard(ip ?? "")}
										className="cursor-pointer bg-black py-2 px-2 border-2 text-white border-neutral-500 w-100 md:w-96"
									>
										{isLoading && "загрузка..."}
										{!isLoading && (
											ip ?? "недоступно"
										)}
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
							<TooltipProvider>
								<Tooltip delayDuration={2}>
									<TooltipTrigger>
										<div className="button w-full md:w-96 px-2 py-1">
											<Typography
												shadow="xl"
												className="text-shadow-xl text-[0.8rem] lg:text-base text-white"
												position="center"
											>
												Наборы ресурсов: Включены
											</Typography>
										</div>
									</TooltipTrigger>
									<TooltipContent className="w-fit max-w-[460px]" side="left">
										<Typography size="lg" className="text-neutral-400">
											На сервере используется ресурспак. Эту нужно оставить включенным!
										</Typography>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
							<DialogClose>
								<div className="button w-full md:w-96 px-2 py-1">
									<Typography
										className="text-shadow-xl text-[0.8rem] text-white lg:text-base"
										position="center"
									>
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
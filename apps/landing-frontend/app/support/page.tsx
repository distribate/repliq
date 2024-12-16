import { MainLayoutPage } from "#/components/layout/main-layout";
import { Overlay } from "#/ui/overlay";
import { WrapperTitle } from "#/ui/wrapper-title";
import { Typography } from "#/ui/typography";
import { Block } from "#/ui/block";
import Image from "next/image";
import Link from "next/link";
import { Button } from "#/ui/button";
import { DialogWrapper } from "#/components/wrappers/dialog-wrapper";
import { DONATIONALERTS_NUMBER, YOOMONEY_NUMBER } from "#/shared/data/support-payment-info";
import { HOT_MC_VOTE, TELEGRAM_SHARE, VK_SHARE } from "#/shared/data/support-share-info";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/ui/accordion";
import { CopyCryptoAddress } from "#/components/support/copy-crypto-address";

export const metadata = {
	title: "Поддержка"
}

export default async function SupportPage() {
	return (
		<MainLayoutPage variant="with_section">
			<div
				className="full-screen-section flex items-center justify-start bg-bottom bg-no-repeat bg-cover
			 bg-[url('/images/backgrounds/support_background.png')]"
			>
				<Overlay variant="default"/>
				<WrapperTitle>
					<div className="flex flex-col gap-6 w-full lg:max-w-3xl items-start justify-center">
						<div className="flex flex-col gap-1 w-full lg:max-w-3xl">
							<Typography position="left" shadow="xl" className="text-5xl lg:text-6xl text-gold mb-2">
								Поддержка проекта
							</Typography>
							<Typography position="left" text_color="white" className="text-2xl md:text-3xl">
								Здесь можно узнать о способах поддержки развития проекта. Это не связано с донатом!
							</Typography>
						</div>
						<Link href="#support-list">
							<Button
								size="default"
								variant="pageLink"
								className="hover:bg-[#724e11] bg-[#86600d]"
							>
								<Typography text_color="white" className="font-bold text-xl">
									<span className="inline-block duration-150 group-hover:duration-150">
										○
									</span>
									&nbsp;К поддержке
								</Typography>
							</Button>
						</Link>
					</div>
				</WrapperTitle>
			</div>
			<div className="full-screen-section flex flex-col justify-center items-center relative py-24 lg:py-36">
				<div className="flex flex-col justify-center gap-y-6 w-[85%] mx-auto">
					<div className="flex flex-col justify-center items-center mb-6">
						<Typography
							variant="block_title"
							className="text-black dark:text-white"
						>
							Поддержка проекта
						</Typography>
						<Typography
							size="xl"
							position="center"
							className="text-dark-red dark:text-gold"
						>
							ниже представлены пока что основные способы помочь проекту. Спасибо!
						</Typography>
					</div>
					<Block
						blockItem
						rounded="big"
						className="flex flex-col md:flex-row overflow-hidden md:items-center items-start gap-x-6 gap-y-4 w-full"
					>
						<Image
							width={566}
							height={566}
							alt="Monitoring Steve"
							className="md:h-[322px] xl:h-[352px] w-fit rounded-[8px]"
							src="/images/support/steve.webp"
						/>
						<div className="flex flex-col items-start p-2 gap-y-2 md:p-0 lg:w-1/2 w-full">
							<h1 className="text-shadow-md text-xl lg:text-2xl xl:text-4xl 2xl:text-6xl text-fuchsia-400 mb-2">
								Мониторинг
							</h1>
							<div className="flex flex-col">
								<Typography
									text_color="adaptiveWhiteBlack"
									variant="block_paragraph"
								>
									Я лично выставил сервер на несколько сайтов-мониторингов.
								</Typography>
								<Typography
									text_color="adaptiveWhiteBlack"
									variant="block_paragraph"
								>
									&quot;Зачем ты это сделал?&quot; - задашь ты мне вопрос
								</Typography>
								<Typography
									text_color="adaptiveWhiteBlack"
									variant="block_paragraph"
								>
									Ну, во-первых, это халявный трафик, хоть и малый.
								</Typography>
								<Typography
									text_color="adaptiveWhiteBlack"
									variant="block_paragraph"
								>
									А во-вторых, тебе же легко просто проголосовать за сервер, да?
								</Typography>
							</div>
							<div className="flex flex-col mt-4">
								<Link target="_blank" href={HOT_MC_VOTE}>
									<div className="flex justify-between items-center button px-6 py-1">
										<Typography text_color="white" hover_effects="fuchsia" size="xl">
											Проголосовать
										</Typography>
									</div>
								</Link>
							</div>
						</div>
					</Block>
					<Block
						blockItem
						rounded="big"
						className="flex flex-col md:flex-row overflow-hidden md:items-center items-start gap-x-6 gap-y-4 w-full"
					>
						<Image
							width={512}
							height={512}
							className="md:w-[322px] md:h-[322px] xl:w-[352px] xl:h-[352px] rounded-[8px]"
							src="/images/support/creeper.jpg"
							alt="share Fasberry Project"
						/>
						<div className="flex flex-col items-start p-2 gap-y-2 md:p-0 lg:w-1/2 w-full">
							<h1 className='text-shadow-md text-xl lg:text-2xl xl:text-4xl 2xl:text-6xl text-fuchsia-400 mb-4'>
								Материальная поддержка
							</h1>
							<Typography
								text_color="adaptiveWhiteBlack"
								variant="block_paragraph"
							>
								В любом случае ты всегда можешь поддержать проект материально, это будет очень и очень большим
								возмещением времени, которое
								я трачу на развитие проекта. Спасибо!
							</Typography>
							<div className="flex flex-col lg:flex-row mt-4">
								<DialogWrapper
									title="Поддержка проекта"
									classNames={{ content: "p-0 max-w-xl overflow-hidden" }}
									trigger={
										<div className="flex justify-between items-center button px-6 py-1">
											<Typography text_color="white" hover_effects="fuchsia" size="xl">
												Поддержать
											</Typography>
										</div>
									}
									content={
										<div className="flex flex-col justify-between w-full gap-4">
											<Image
												src="/images/backgrounds/bees.jpg"
												width={1920}
												height={1080}
												className="h-[50%] object-cover w-full rounded-t-[8px]"
												alt=""
											/>
											<div className="flex flex-col items-center w-full gap-4 p-4">
												<Typography
													position="center"
													text_color="adaptiveWhiteBlack"
													className="text-lg sm:text-xl lg:text-2xl mb-4 lg:mb-8"
												>
													Вы можете поддержать проект разными способами
												</Typography>
												<Link
													target="_blank"
													href={DONATIONALERTS_NUMBER}
													className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
												>
													<Typography
														size="xl"
														className="text-black dark:text-white"
													>
														<span>♦</span> DonationAlerts <span>♦</span>
													</Typography>
												</Link>
												<Link
													target="_blank"
													href={YOOMONEY_NUMBER}
													className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
												>
													<Typography
														size="xl"
														text_color="adaptiveWhiteBlack"
													>
														<span>♦</span> Юмани <span>♦</span>
													</Typography>
												</Link>
												<Accordion type="single" collapsible>
													<AccordionItem value="crypto">
														<AccordionTrigger withBook={false} className="flex justify-center self-center p-0 m-0">
															<Typography
																size="xl"
																text_color="adaptiveWhiteBlack"
															>
																<span>♦</span> Крипта <span>♦</span>
															</Typography>
														</AccordionTrigger>
														<AccordionContent className="flex flex-col gap-1 pt-1 items-center">
															<CopyCryptoAddress title="USDT (TRC20)" value="1"/>
															<CopyCryptoAddress title="TON" value="1"/>
														</AccordionContent>
													</AccordionItem>
												</Accordion>
											</div>
										</div>
									}
								/>
							</div>
						</div>
					</Block>
					<Block
						blockItem
						rounded="big"
						className="flex flex-col md:flex-row overflow-hidden md:items-center items-start gap-x-6 gap-y-4 w-full"
					>
						<Image
							width={512}
							height={512}
							className="md:w-[322px] md:h-[322px] xl:w-[352px] xl:h-[352px] rounded-[8px]"
							src="/images/support/alex.webp"
							alt="share Fasberry Project"
						/>
						<div className="flex flex-col items-start p-2 gap-y-2 md:p-0 lg:w-1/2 w-full">
							<h1 className='text-shadow-md text-xl lg:text-2xl xl:text-4xl 2xl:text-6xl text-fuchsia-400 mb-4'>
								Знакомый знакомому
							</h1>
							<Typography
								text_color="adaptiveWhiteBlack"
								variant="block_paragraph"
							>
								Расскажи об этом сервере своим друзьям, может знакомым, зайдите вечерком, поиграйте. Если зайдет, то
								возможно вы станете легендами.
								Я думаю хороший обмен.
							</Typography>
							<div className="flex flex-col lg:flex-row justify-start w-full gap-x-4 mt-4 gap-y-2">
								<Link href={TELEGRAM_SHARE} target="_blank">
									<div className="flex justify-between items-center button px-2 py-1">
										<Typography text_color="white" hover_effects="fuchsia" size="xl">
											Поделиться / Телеграмм
										</Typography>
									</div>
								</Link>
								<Link href={VK_SHARE} target="_blank">
									<div className="flex justify-between items-center button px-2 py-1">
										<Typography text_color="white" hover_effects="fuchsia" size="xl">
											Поделиться / ВКонтакте
										</Typography>
									</div>
								</Link>
							</div>
						</div>
					</Block>
				</div>
			</div>
		</MainLayoutPage>
	)
}
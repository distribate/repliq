import { Sheet, SheetContent, SheetTrigger } from "#/ui/sheet";
import { ImageWrapper } from "#/ui/image-wrapper";
import { ThemeToggle } from "#/components/header/header-theme-toggle";
import { MAIN_HEADER } from "#/shared/data/configs";
import { Typography } from "#/ui/typography";
import { useState } from "react";
import Link from "next/link";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "#/ui/accordion";
import { usePathname, useRouter } from "next/navigation";

export const HeaderSheet = () => {
	const [ open, setOpen ] = useState(false);
	const { push } = useRouter()
	const pathname = usePathname()
	
	const chestStatusImage = open
		? "/images/minecraft/icons/chest_opened.png"
		: "/images/minecraft/icons/chest_closed.png"
	
	const handleToPage = (href?: string) => {
		if (href) {
			push(href);
			setOpen(!open)
		}
	}
	
	return (
		<Sheet modal open={open} onOpenChange={setOpen}>
			<SheetTrigger className="xl:hidden absolute top-[10px] right-[8px] z-[3000]">
				<ImageWrapper width={48} height={48} src={chestStatusImage} title="Chest"/>
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="xl:hidden flex flex-col items-start justify-between bg-neutral-950 rounded-[16px] min-h-1/2 h-fit p-4 w-full"
			>
				<div className="flex justify-between items-center w-full">
					<Link href="/" className="bg-transparent cursor-pointer relative top-2 right-4">
						<ImageWrapper src="/images/fasberry_logo.png" title="Fasberry" width={224} height={64}/>
					</Link>
					<div className="w-[36px] h-[36px] relative overflow-hidden">
						<ThemeToggle/>
					</div>
				</div>
				<Accordion
					type="single"
					collapsible
					className="flex flex-col items-center justify-center w-full gap-y-4 px-4"
				>
					{MAIN_HEADER.map(item => {
						const isActive = item.href === pathname;
						const activePathName = MAIN_HEADER.find(i => i.name === pathname)?.name
							|| "actived"
						
						return (
							<AccordionItem key={item.name} value={item.name} className="w-full">
								<AccordionTrigger
									withBook={false}
									onClick={() => handleToPage(item.href)}
									className="flex border-2 group border-neutral-600
									dark:border-netural-900 hover:bg-neutral-800 cursor-pointer rounded-md gap-x-6 py-2 px-2 w-full"
								>
									<div className="flex items-center gap-1">
										{isActive && (
											<ImageWrapper
												src="/images/minecraft/icons/experience_big.webp"
												title={activePathName}
												width={16}
												height={16}
											/>
										)}
										<Typography
											size="lg"
											className={`text-project-color ${item.name === "Привилегии" && 'text-gold'}`}
										>
											{item.name}
										</Typography>
										{item.childs && (
											<>
												<span className="text-white group-data-[state=open]:inline hidden">⏶</span>
												<span className="text-white group-data-[state=closed]:inline hidden">⏷</span>
											</>
										)}
									</div>
								</AccordionTrigger>
								{item.childs && (
									<AccordionContent className="flex flex-col gap-2">
										{item.childs.map(i => {
											const isActive = i.href === pathname;
											const activePathName = MAIN_HEADER.find(i => i.name === pathname)?.name || "actived"
											
											return (
												<div
													key={i.name}
													onClick={() => handleToPage(i.href)}
													className="flex group border-2 border-neutral-600 dark:border-netural-900 hover:bg-neutral-800 cursor-pointer
													 rounded-md gap-x-6 py-2 px-2 w-full"
												>
													<div className="flex items-center gap-1">
														{isActive && (
															<ImageWrapper
																src="/images/minecraft/icons/experience_big.webp"
																title={activePathName}
																width={16}
																height={16}
															/>
														)}
														<Typography
															size="lg"
															className={`text-project-color`}
														>
															{i.name}
														</Typography>
														{item.childs && (
															<>
																<span className="text-white group-data-[state=open]:inline hidden">⏶</span>
																<span className="text-white group-data-[state=closed]:inline hidden">⏷</span>
															</>
														)}
													</div>
												</div>
											)
										})}
									</AccordionContent>
								)}
							</AccordionItem>
						)
					})}
				</Accordion>
			</SheetContent>
		</Sheet>
	)
}
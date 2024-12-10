"use client"

import { usePathname, useRouter } from 'next/navigation'
import { MAIN_HEADER } from '#/shared/data/configs';
import { Typography } from '#/ui/typography';
import { toast } from 'sonner';
import { ImageWrapper } from "#/ui/image-wrapper";
import Image from "next/image"
import Link from "next/link";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "#/ui/dropdown-menu";
import { HeaderSheet } from "#/components/header/header-sheet";
import { Skeleton } from "#/ui/skeleton";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(
	() =>
		import("#/components/header/header-theme-toggle").then(m => ({
			default: m.ThemeToggle
		})),
	{
		ssr: false,
		loading: () => <Skeleton className="w-[36px] h-[36px]"/>,
	}
)

export const Header = () => {
	const pathname = usePathname();
	const { push } = useRouter()
	
	const pathDetect = (href?: string) => {
		if (href) {
			if (pathname === href) {
				return toast.info("Вы уже на этой странице!", {
					icon: <Image alt="Stop!" width={32} height={32} src="/images/minecraft/icons/bell.webp"/>
				})
			}
			push(href)
		}
	}
	
	return (
		<div
			className="header flex items-center justify-between sticky lg:absolute top-0 transition w-full bg-repeat-x z-50
				bg-[url('/images/static/cracked_polished_blacked.webp')] "
			style={{ backgroundSize: '160px' }}
		>
			<Link href="/" className="bg-transparent cursor-pointer relative top-3 xl:-right-[112px]">
				<ImageWrapper src="/images/fasberry_logo.png" title="Fasberry" width={224} height={64}/>
			</Link>
			<div className="hidden xl:flex gap-x-4 items-center justify-start pr-[132px]">
				{MAIN_HEADER.map(item => {
					const isActive = pathname === item.href;
					const activePathName = MAIN_HEADER.find(i => i.href === pathname)?.name || "activePathName";
					
					return (
						<DropdownMenu key={item.name}>
							<DropdownMenuTrigger onClick={() => pathDetect(item.href)} className="group">
								<div
									className="flex items-center gap-1 cursor-pointer"
								>
									{isActive && (
										<ImageWrapper
											src="/images/minecraft/icons/experience_big.webp"
											title={activePathName}
											width={20}
											height={20}
										/>
									)}
									<Typography
										className={`hover:brightness-150 text-project-color text-lg
          			      ${isActive && 'brightness-[1.8]'} ${item.name == "Привилегии" && 'text-gold'}`
										}
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
							</DropdownMenuTrigger>
							{item.childs && (
								<DropdownMenuContent className="border" side="bottom" align="end">
									<div className="flex flex-col py-2 px-4 gap-2 w-full">
										{item.childs.map(item => {
											const isActive = item.href === pathname;
											
											return (
												<div key={item.name} className="flex items-center gap-1 cursor-pointer">
													{isActive && (
														<ImageWrapper
															src="/images/minecraft/icons/experience_big.webp"
															title={activePathName}
															width={16}
															height={16}
														/>
													)}
													<Link href={item.href || "/"}>
														<Typography className="hover:brightness-150 text-lg text-project-color">
															{item.name}
														</Typography>
													</Link>
												</div>
											)
										})}
									</div>
								</DropdownMenuContent>
							)}
						</DropdownMenu>
					)
				})}
				<div className="w-[36px] h-[36px] overflow-hidden">
					<ThemeToggle/>
				</div>
			</div>
			<HeaderSheet/>
		</div>
	);
};
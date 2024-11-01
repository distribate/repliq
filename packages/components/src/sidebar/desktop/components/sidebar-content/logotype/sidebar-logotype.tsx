import Logotype from "@repo/assets/images/logotype.png"
import Link from "next/link";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { useSidebarControl } from '../../sidebar-layout/hooks/use-sidebar-control.ts';
import { ImageWrapper } from '#wrappers/image-wrapper.tsx';

export const SidebarLogotype = () => {
	const { isCompact, isExpanded } = useSidebarControl()
	
	return (
		<Link href="/">
			<div className="flex items-center w-full">
				{isCompact || !isExpanded ? (
					<ImageWrapper
						priority={true}
						propSrc={Logotype.src}
						width={42}
						height={42}
						propAlt="Go to Forum"
					/>
				) : (
					<>
						<ImageWrapper
							priority={true}
							propSrc={Logotype.src}
							width={42}
							className="h-[42px] w-[56px]"
							height={42}
							propAlt="Go to Forum"
						/>
						<div className="w-fit">
							<Typography textSize="very_big" textColor="shark_white" className="font-[Minecraft] truncate">
								Fasberry
							</Typography>
						</div>
					</>
				)}
			</div>
		</Link>
	)
}
import { PageWrapper } from "@repo/components/src/wrappers/page-wrapper";
import PlayerGirlDance from "@repo/assets/gifs/x-misari-dance.gif"
import { ImageWrapper } from "@repo/components/src/wrappers/image-wrapper.tsx";

export default function LoadingMainPage() {
	return (
		<PageWrapper className="p-6">
			<div className="flex flex-col items-center justify-center gap-y-1">
				<ImageWrapper
					propSrc={PlayerGirlDance.src}
					propAlt="Loading..."
					width={177}
					height={329}
				/>
			</div>
		</PageWrapper>
	)
}
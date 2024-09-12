import { PageWrapper } from "@repo/components/src/wrappers/page-wrapper";
import { PageLoader } from '@repo/ui/src/components/page-loader.tsx';

export default function LoadingMainPage() {
	return (
		<PageWrapper className="p-6">
			<PageLoader/>
		</PageWrapper>
	)
}
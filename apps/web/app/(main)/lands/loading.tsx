import { PageLoader } from '@repo/ui/src/components/page-loader.tsx';
import { PageWrapper } from '@repo/components/src/wrappers/page-wrapper.tsx';

export default function LandsLoadingPage() {
  return (
    <PageWrapper className="p-6">
      <PageLoader/>
    </PageWrapper>
  )
}
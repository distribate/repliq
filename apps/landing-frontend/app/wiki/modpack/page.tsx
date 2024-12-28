import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout';
import { Typography } from '@repo/landing-ui/src/typography';
import { ModpackList } from '@repo/landing-components/src/modpacks/modpack-list.tsx';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getModpacks } from '@repo/lib/queries/get-modpacks.ts';
import { Suspense } from 'react';
import { ModpackListSkeleton } from '@repo/landing-components/src/skeletons/modpack-list-skeleton.tsx';
import { MODPACKS_QUERY_KEY } from '@repo/lib/queries/modpacks-query.ts';

export const metadata = {
  title: 'Модпак',
};

const Modpack = async () => {
	const qc = new QueryClient();
	
	await qc.prefetchQuery({
		queryKey: MODPACKS_QUERY_KEY,
		queryFn: () => getModpacks()
	})
	
	const dehydratedState = dehydrate(qc);
	
	return (
		<HydrationBoundary state={dehydratedState}>
			<ModpackList />
		</HydrationBoundary>
	)
}

export default async function WikiModpackPage() {
  return (
    <MainLayoutPage variant="with_section">
      <div className="min-h-screen w-[90%] mx-auto py-36">
        <div className="flex flex-col justify-center items-center mb-6">
          <Typography variant="block_title">
            Сборки модов
          </Typography>
        </div>
        <Suspense fallback={<ModpackListSkeleton/>}>
	        <Modpack/>
        </Suspense>
      </div>
    </MainLayoutPage>
  );
}
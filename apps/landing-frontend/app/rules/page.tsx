import { MainLayoutPage } from '@repo/landing-components/src/layout/main-layout';
import { Overlay } from '@repo/landing-ui/src/overlay';
import { WrapperTitle } from '@repo/landing-ui/src/wrapper-title';
import { Typography } from '@repo/landing-ui/src/typography';
import { Rules as RulesList } from '@repo/landing-components/src/rules/rules.tsx';
import { Button } from '@repo/landing-ui/src/button';
import Link from 'next/link';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { RULES_QUERY_KEY } from '@repo/lib/queries/rules-query.ts';
import { getRules } from '@repo/lib/queries/get-rules.ts';
import { Suspense } from 'react';
import { Badge } from '@repo/landing-ui/src/Badge.tsx';
import { RulesListSkeleton } from '@repo/landing-components/src/skeletons/rules-list-skeleton.tsx';

export const metadata = {
  title: 'Правила',
  description:
    "Ознакомьтесь с правилами нашего Fasberry-сервера, чтобы обеспечить честную и дружелюбную игру для всех участников. Уважайте других игроков и следуйте установленным нормам поведения.",
  keywords: [
    "правила Fasberry",
    "правила игрового сервера",
    "Fasberry сервер правила",
    "как играть на Fasberry сервере",
    "нормы поведения Fasberry",
  ],
  author: "Fasberry Server Team",
  robots: "index, follow",
  canonical: "https://fasberry.su/rules",
  openGraph: {
    title: "Правила сервера Fasberry | Уважение и честная игра",
    description:
      "Правила нашего Fasberry-сервера для комфортной игры. Соблюдайте установленные нормы и поддерживайте дружелюбную атмосферу!",
    url: "https://fasberry.su/rules",
    type: "website",
    images: [
      {
        url: "https://fasberry.su/images/backgrounds/main_background.png",
        alt: "Правила сервера Fasberry",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Правила сервера Fasberry | Соблюдайте порядок",
    description:
      "Изучите правила нашего сервера Fasberry, чтобы играть комфортно и честно. Уважение к игрокам — наш приоритет.",
    images: ["https://fasberry.su/images/backgrounds/main_background.png"],
  },
};

const Rules = async () => {
  const qc = new QueryClient();

  await qc.prefetchQuery({
    queryKey: RULES_QUERY_KEY,
    queryFn: () => getRules(),
  });

  const dehydratedState = dehydrate(qc);

  return (
    <HydrationBoundary state={dehydratedState}>
      <RulesList />
    </HydrationBoundary>
  );
};

export default async function RulesPage() {
  return (
    <MainLayoutPage variant="with_section">
      <div
        className={`full-screen-section flex items-center justify-start bg-bottom md:bg-center bg-cover
						bg-[url('/images/backgrounds/rules_background.png')]`}
      >
        <Overlay variant="default" />
        <WrapperTitle>
          <div className="flex flex-col gap-6 w-full lg:max-w-3xl items-start justify-center">
            <div className="flex flex-col gap-1 lg:max-w-3xl">
              <Typography position="left" shadow="xl" className="text-5xl lg:text-6xl text-gold mb-2">
                Правила проекта
              </Typography>
              <Typography position="left" text_color="white" className="text-2xl md:text-3xl">
                Правила созданы для чего? Чтобы их не нарушать!
              </Typography>
            </div>
            <Link href="#rules-list">
              <Button
                size="default"
                variant="pageLink"
                className="hover:bg-[#a20f40] rounded-xl border border-[#8a113c] bg-[#8a113c]"
              >
                <Typography text_color="white" className="font-bold text-xl">
                  <span
                    className="inline-block group-hover:rotate-0 rotate-90 duration-150 group-hover:duration-150"
                  >
                    ✎
                  </span>
                  &nbsp;К правилам
                </Typography>
              </Button>
            </Link>
          </div>
        </WrapperTitle>
      </div>
      <div className="full-screen-section py-32">
        <div className="flex flex-col gap-y-10 responsive mx-auto">
          <div
            className="flex flex-col md:flex-row gap-y-4 border-2 border-[#454545] hover:duration-300
					    duration-300 lg:gap-y-2 py-4 p-2 rounded-[8px] justify-between"
          >
            <div className="flex items-start lg:items-center gap-x-2">
              <Typography
                title="Типа теги, чтобы было круто"
                className="text-black dark:text-white"
                size="xl"
              >
                Теги:
              </Typography>
              <div className="flex flex-wrap gap-2">
                <Badge>#правила</Badge>
                <Badge variant="destructive">#база</Badge>
                <Badge>#кодекс</Badge>
                <Badge variant="violet">#никтонечитает</Badge>
              </div>
            </div>
          </div>
          <Suspense fallback={<RulesListSkeleton />}>
            <Rules />
          </Suspense>
        </div>
      </div>
    </MainLayoutPage>
  );
}
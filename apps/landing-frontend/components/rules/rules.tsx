'use client';

import { Typography } from '@repo/landing-ui/src/typography';
import { RulesRuleItem } from '../rules/rules-rule-item.tsx';
import { RulesTerminItem } from '../rules/rules-termin-item.tsx';
import { Skeleton } from '@repo/landing-ui/src/skeleton.tsx';
import { useQuery } from "@tanstack/react-query";
import { forumLandingClient } from '@repo/shared/api/forum-client';

export const RULES_QUERY_KEY = ["rules"]

async function getRules() {
  const res = await forumLandingClient["get-rules"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data
}

const rulesQuery = () => useQuery({
	queryKey: RULES_QUERY_KEY,
	queryFn: () => getRules(),
	refetchOnWindowFocus: false,
	refetchOnMount: false
})

export const RulesListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось получить правила. Попробуйте позже
    </Typography>
  );
};

const RulesListSkeleton = () => {
  return (
    <div id="rules-list" className="flex flex-col gap-6 w-full h-full">
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-64 w-full" />
      <Skeleton className="h-56 w-full" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
};

export const Rules = () => {
  const { data, isLoading, isError } = rulesQuery();

  if (isLoading) return <RulesListSkeleton />;
  if (isError) return <RulesListNull />;

  if (!data) return <RulesListNull />;

  return (
    <div id="rules-list" className="flex flex-col gap-6 w-full h-full">
      <RulesTerminItem {...data.terms} />
      <RulesRuleItem categoryTitle={data.rules.chat.categoryTitle} content={data.rules.chat.content} />
      <RulesRuleItem {...data.rules.game} />
      <RulesRuleItem {...data.rules.based} />
    </div>
  );
};
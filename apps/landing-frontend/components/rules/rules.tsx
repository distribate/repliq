'use client';

import { Typography } from '@repo/landing-ui/src/typography';
import { rulesQuery } from '@repo/lib/queries/rules-query';
import { RulesRuleItem } from '../rules/rules-rule-item.tsx';
import { RulesTerminItem } from '../rules/rules-termin-item.tsx';
import { Skeleton } from '@repo/landing-ui/src/skeleton.tsx';

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
  const { data: rules, isLoading, isError } = rulesQuery();
  
  if (isLoading) return <RulesListSkeleton />;
  if (isError) return <RulesListNull />;
  
  if (!rules) return <RulesListNull />;
  
  return (
    <div id="rules-list" className="flex flex-col gap-6 w-full h-full">
      <RulesTerminItem {...rules.terms} />
      <RulesRuleItem {...rules.chat} />
      <RulesRuleItem {...rules.game} />
      <RulesRuleItem {...rules.based} />
    </div>
  );
};
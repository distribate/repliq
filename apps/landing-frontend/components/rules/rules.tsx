'use client';

import { Typography } from '#/ui/typography';
import { rulesQuery } from '#/lib/queries/rules-query';
import { RulesRuleItem } from '#/components/rules/rules-rule-item.tsx';
import { RulesTerminItem } from '#/components/rules/rules-termin-item.tsx';
import { RulesListSkeleton } from '#/components/skeletons/rules-list-skeleton.tsx';

export const RulesListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось получить правила. Попробуйте позже
    </Typography>
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
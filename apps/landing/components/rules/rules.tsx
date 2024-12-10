'use client';

import { Typography } from '#/ui/typography';
import { Badge } from '#/ui/Badge';
import { rulesQuery } from '#/lib/queries/rules-query';
import { RulesRuleItem } from '#/components/rules/rules-rule-item.tsx';
import { Skeleton } from '#/ui/skeleton.tsx';
import { RulesTerminItem } from '#/components/rules/rules-termin-item.tsx';

export const RulesListError = () => {
  return (
    <div className="flex">
      <Typography>
        Не удалось получить правила. Попробуйте позже
      </Typography>
    </div>
  )
}

const RulesListSkeleton = () => {
  return (
    <>
      <Skeleton className="h-56 w-full"/>
      <Skeleton className="h-48 w-full"/>
      <Skeleton className="h-56 w-full"/>
      <Skeleton className="h-48 w-full"/>
    </>
  )
}

export const RulesList = () => {
  const { data: rules, isLoading, isError } = rulesQuery();
  
  if (isLoading) return <RulesListSkeleton/>
  if (isError) return <RulesListError/>
  
  if (!rules) return null;
  
  return (
    <>
      <RulesTerminItem {...rules.terms} />
      <RulesRuleItem {...rules.chat} />
      <RulesRuleItem {...rules.game} />
      <RulesRuleItem {...rules.based} />
    </>
  )
}

export const Rules = () => {
  return (
    <div className="full-screen-section py-32">
      <div className="flex flex-col gap-y-10 w-[85%] mx-auto">
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
        <div id="rules-list" className="flex flex-col gap-6 w-full h-full">
          <RulesList/>
        </div>
      </div>
    </div>
  );
};
"use client"

import { donatesQuery } from '#/lib/queries/donates-query.ts';
import { SubscriptionItem } from '#/components/subs/subscription-item.tsx';
import { Typography } from '#/ui/typography.tsx';
import { DonateListSkeleton } from '#/components/skeletons/donate-list-skeleton.tsx';

const DonateListNull = () => {
  return (
    <Typography text_color="adaptiveGray" className="text-2xl">
      Не удалось получить доступные привилегии. Повторите позже
    </Typography>
  )
}

export const DonateList = () => {
  const { data: donates, isLoading, isError } = donatesQuery()
  
  if (isLoading) return <DonateListSkeleton/>
  if (isError) return <DonateListNull/>
  
  if (!donates) return <DonateListNull/>
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
      {donates.map(donate => (
        <SubscriptionItem key={donate.origin} {...donate} />
      ))}
    </div>
  )
}
"use client"

import { donatesQuery } from '#/lib/queries/donates-query.ts';
import { SubscriptionItem } from '#/components/subs/subscription-item.tsx';

export const DonateList = () => {
  const { data: donates } = donatesQuery()
  
  if (!donates) return null;
  
  return (
    <>
      {donates.map(donate => (
        <SubscriptionItem key={donate.origin} {...donate} />
      ))}
    </>
  )
}
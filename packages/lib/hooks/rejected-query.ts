"use client"

import { useQuery } from '@tanstack/react-query';

export const REJECTED_QUERY_KEY = ["friends-requests", "rejected"]

export const rejectedQuery = ({
  initiator, recipient
}: {
  initiator: string, recipient: string
}) => useQuery({
  queryKey: ["friends-requests", "rejected"],
  enabled: !!initiator && !!recipient,
})
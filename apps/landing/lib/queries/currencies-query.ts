import { useQuery } from '@tanstack/react-query';
import { getCurrencies } from '#/lib/queries/get-currencies.ts';

export const currenciesQuery = () => useQuery({
  queryKey: ["currencies"],
  queryFn: () => getCurrencies(),
  refetchOnMount: false,
  refetchOnWindowFocus: false
})
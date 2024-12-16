import { useQuery } from '@tanstack/react-query';
import { getCurrencies } from '#/lib/queries/get-currencies.ts';

export const CURRENCIES_QUERY_KEY = ["currencies"]

export const currenciesQuery = () => useQuery({
  queryKey: CURRENCIES_QUERY_KEY,
  queryFn: () => getCurrencies(),
  refetchOnMount: false,
  refetchOnWindowFocus: false
})
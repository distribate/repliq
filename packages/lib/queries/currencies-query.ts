import { currenciesClient } from '@repo/shared/api/payments-client';
import { useQuery } from '@tanstack/react-query';

export const CURRENCIES_QUERY_KEY = ["currencies"]

async function getCurrencies() {
  const res = await currenciesClient["get-currencies"].$get()

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

export const currenciesQuery = () => useQuery({
  queryKey: CURRENCIES_QUERY_KEY,
  queryFn: () => getCurrencies(),
  refetchOnMount: false,
  refetchOnWindowFocus: false
})
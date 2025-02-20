import { useQuery } from '@tanstack/react-query';
import { PaymentCurrency, PaymentType, PaymentValueType } from '@repo/types/entities/payment-types.ts';

export const SHOP_ITEM_QUERY_KEY = ['shop', 'item']

export type ShopItemQuery = Partial<{
  paymentType: PaymentType
  paymentValue: PaymentValueType
  nickname: string,
}> & {
  currency: PaymentCurrency,
  category: "donate" | "wallet" | "events"
}

export const shopItemQuery = () => useQuery<
  ShopItemQuery, Error
>({
  queryKey: SHOP_ITEM_QUERY_KEY,
  initialData: {
    currency: "RUB",
    category: "donate"
  }
});
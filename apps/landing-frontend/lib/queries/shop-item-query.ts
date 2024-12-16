import { useQuery } from '@tanstack/react-query';
import { PaymentCurrency, PaymentType, PaymentValueType } from '@repo/types/entities/payment-types.ts';

export const SHOP_ITEM_QUERY_KEY  = [ 'shop', 'item' ]

export type ShopItemQuery = {
  paymentType: PaymentType
  paymentValue: PaymentValueType
  currency: PaymentCurrency
}

export const shopItemQuery = () => useQuery<
  ShopItemQuery, Error
>({
  queryKey: SHOP_ITEM_QUERY_KEY,
});
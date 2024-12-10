import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postPayment } from '#/lib/queries/post-payment.ts';
import { PaymentFields } from '#/components/subs/subscription-item-form.tsx';
import { SHOP_ITEM_QUERY_KEY } from '#/lib/queries/shop-item-query.ts';

export const CREATE_PAYMENT_MUTATION_KEY = ["shop", 'create-payment-mutation' ];

export const CREATE_PAYMENT_DATA_QUERY_KEY = ["shop", "create-payment", "data"]

export const useCreatePayment = () => {
  const qc = useQueryClient();
  
  const createPaymentMutation = useMutation({
    mutationKey: CREATE_PAYMENT_MUTATION_KEY,
    mutationFn: async(values: PaymentFields) => postPayment(values),
    onSuccess: async(data) => {
      qc.resetQueries({
        queryKey: SHOP_ITEM_QUERY_KEY
      })
      qc.setQueryData(CREATE_PAYMENT_DATA_QUERY_KEY, data)
    }
  });
  
  return { createPaymentMutation };
};
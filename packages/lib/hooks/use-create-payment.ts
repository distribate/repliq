import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SHOP_ITEM_QUERY_KEY } from '@repo/lib/queries/shop-item-query.ts';
import { createPayment } from '@repo/lib/actions/create-payment-client.ts';
import { PaymentFields } from '@repo/landing-components/src/subs/subscription-item-form.tsx';

export const CREATE_PAYMENT_MUTATION_KEY = ["shop", 'create-payment-mutation'];

export const CREATE_PAYMENT_DATA_QUERY_KEY = ["shop", "create-payment", "data"]

export const useCreatePayment = () => {
  const qc = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationKey: CREATE_PAYMENT_MUTATION_KEY,
    mutationFn: async (values: PaymentFields) => createPayment(values),
    onSuccess: async (data) => {
      if ("paymentUrl" in data) {
        qc.resetQueries({ queryKey: SHOP_ITEM_QUERY_KEY })
        qc.setQueryData(CREATE_PAYMENT_DATA_QUERY_KEY, data)
      }
    },
    onError: e => {
      throw new Error(e.message);
    }
  });

  return { createPaymentMutation };
};
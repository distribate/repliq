import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SHOP_ITEM_QUERY_KEY } from '@repo/lib/queries/shop-item-query.ts';
import { createPayment } from '@repo/lib/actions/create-payment.ts';
import { PaymentFields } from '@repo/landing-components/src/subs/subscription-item-form.tsx';
import { toast } from 'sonner';
import { PAYMENT_STATUS_QUERY_KEY } from '@repo/landing-components/src/shop/shop-payment-status';

export const CREATE_PAYMENT_MUTATION_KEY = ["shop", 'create-payment-mutation'];

export const useCreatePayment = () => {
  const qc = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationKey: CREATE_PAYMENT_MUTATION_KEY,
    mutationFn: async (values: PaymentFields) => createPayment(values),
    onSuccess: async (raw, variables) => {
      // as fiat payment response
      const data = raw as { data: { url: string; orderId: string } } | { error: string }

      if ("error" in data) {
        qc.setQueryData(PAYMENT_STATUS_QUERY_KEY, {
          type: "error"
        })

        toast.error(data.error);
      }

      if ("data" in data) {
        qc.setQueryData(PAYMENT_STATUS_QUERY_KEY, {
          current: data.data.orderId,
          status: "pending",
          type: "created",
          url: data.data.url,
          isOpened: true,
          paymentType: variables.currency === 'RUB' ? "fiat" : "crypto"
        })
      }

      qc.resetQueries({ queryKey: SHOP_ITEM_QUERY_KEY })
    },
    onError: e => {
      throw new Error(e.message);
    }
  });

  return { createPaymentMutation };
};
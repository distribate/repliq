import { useMutation, useQueryClient } from '@tanstack/react-query';
import { SHOP_ITEM_QUERY_KEY } from '@repo/lib/queries/shop-item-query.ts';
import { createPayment } from '@repo/lib/actions/create-payment.ts';
import { PaymentFields } from '@repo/landing-components/src/subs/subscription-item-form.tsx';
import { toast } from 'sonner';

export const CREATE_PAYMENT_MUTATION_KEY = ["shop", 'create-payment-mutation'];

export const CREATE_PAYMENT_DATA_QUERY_KEY = ["shop", "create-payment", "data"]

export type CreatePaymentQuery = {
  status: "error" | "success"
  data: string
}

export const useCreatePayment = () => {
  const qc = useQueryClient();

  const createPaymentMutation = useMutation({
    mutationKey: CREATE_PAYMENT_MUTATION_KEY,
    mutationFn: async (values: PaymentFields) => createPayment(values),
    onSuccess: async (data) => {
      if ("error" in data) {
        qc.setQueryData(CREATE_PAYMENT_DATA_QUERY_KEY, { status: "error", data: data.error })

        toast.error(data.error);
      } else if ("data" in data) {
        qc.setQueryData(CREATE_PAYMENT_DATA_QUERY_KEY, { status: "success", data: data })
      }

      qc.resetQueries({ queryKey: SHOP_ITEM_QUERY_KEY })
    },
    onError: e => {
      throw new Error(e.message);
    }
  });

  return { createPaymentMutation };
};
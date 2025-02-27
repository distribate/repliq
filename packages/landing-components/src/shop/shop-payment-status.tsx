import { Button } from "@repo/landing-ui/src/button"
import { Typography } from "@repo/landing-ui/src/typography"
import { ordersClient } from "@repo/shared/api/payments-client"
import { Check, X } from "lucide-react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { InferRequestType, InferResponseType } from "hono/client"

export const PAYMENT_STATUS_QUERY_KEY = ["shop", "payment", "status"]

const client = ordersClient["get-order"][":id"].$get

export type GetOrderRequest = InferRequestType<typeof client>

export type GetOrderResponse = InferResponseType<typeof client, 200>

export type PaymentStatusQuery = {
  current: string,
  paymentType: GetOrderRequest["query"]["type"],
  status: GetOrderResponse["data"]["status"],
  type: "created" | "error",
  isOpened: boolean,
  url: string
}

export const paymentStatusQuery = () => useQuery<PaymentStatusQuery, Error>({
  queryKey: PAYMENT_STATUS_QUERY_KEY,
  refetchOnWindowFocus: false,
  refetchOnMount: false
})

const paymentStatusMap: Record<PaymentStatusQuery["status"], string> = {
  'success': 'оплачен',
  'error': 'ошибка',
  'pending': 'ждет оплаты',
  "canceled": "отменен",
}

async function getPaymentStatus(id: string, type: PaymentStatusQuery["paymentType"]) {
  const res = await ordersClient["get-order"][":id"].$get({
    param: { id },
    query: { type }
  })

  const data = await res.json()

  if (!data || "error" in data) {
    return { error: data.error };
  }

  return data.data;
}

const UPDATE_PAYMENT_STATUS_MUTATION_KEY = ["update-payment-status"]

const usePaymentStatus = () => {
  const qc = useQueryClient()

  const updatePaymentStatusMutation = useMutation({
    mutationKey: UPDATE_PAYMENT_STATUS_MUTATION_KEY,
    mutationFn: async (val: Pick<PaymentStatusQuery, "current" | "paymentType">) => 
      getPaymentStatus(val.current, val.paymentType),
    onSuccess: async (data) => {
      if ("error" in data) {
        return qc.setQueryData(PAYMENT_STATUS_QUERY_KEY,
          (prev: PaymentStatusQuery) => ({ ...prev, status: 'error' })
        )
      }

      qc.setQueryData(PAYMENT_STATUS_QUERY_KEY,
        (prev: PaymentStatusQuery) => ({ ...prev, status: data.status })
      )
    },
    onError: e => { throw new Error(e.message) }
  })

  return { updatePaymentStatusMutation }
}

export const ShopPaymentStatus = () => {
  const { data: paymentStatus } = paymentStatusQuery()
  const { updatePaymentStatusMutation } = usePaymentStatus()

  if (!paymentStatus) return null;

  const handleUpdate = () => {
    const { current, paymentType, status } = paymentStatus

    if (status !== 'pending') return;

    updatePaymentStatusMutation.mutate({ current, paymentType })
  }

  return (
    <div className="flex sm:flex-row flex-col items-center justify-between gap-4 bg-neutral-400 dark:bg-neutral-800 rounded-xl py-2 px-4 w-full">
      <div className="flex flex-col sm:flex-row items-center gap-2">
        {paymentStatus?.status === 'success' && (
          <Check size={18} className="text-green" />
        )}
        {paymentStatus?.status === 'pending' && (
          <svg viewBox="0 0 16 16" height="18" width="18" className="windows-loading-spinner">
            <circle r="7px" cy="8px" cx="8px"></circle>
          </svg>
        )}
        {paymentStatus?.status === 'error' && (
          <X size={18} className="text-red" />
        )}
        <Typography>
          Статус: {paymentStatusMap[paymentStatus?.status]}
        </Typography>
      </div>
      <Button
        disabled={updatePaymentStatusMutation.isPending}
        onClick={handleUpdate}
        className="w-fit bg-neutral-100 rounded-lg py-2 px-6"
      >
        <Typography className="text-neutral-900 text-base">
          {updatePaymentStatusMutation.isPending ? "Обновляем..." : "Обновить"}
        </Typography>
      </Button>
    </div>
  )
}
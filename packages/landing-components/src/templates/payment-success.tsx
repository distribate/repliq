"use client"

import { Avatar } from "@repo/components/src/user/components/avatar/components/avatar";
import { Button } from "@repo/landing-ui/src/button";
import { Skeleton } from "@repo/landing-ui/src/skeleton";
import { Typography } from "@repo/landing-ui/src/typography";
import { createQueryKey } from "@repo/lib/helpers/query-key-builder";
import { ordersClient } from "@repo/shared/api/payments-client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SteveNight from "@repo/assets/images/steve_night.jpg"
import { DONATE_TITLE } from "@repo/shared/constants/donate-aliases.ts";

export type PaymentSuccessProps = {
  id: string,
  nickname: string
}

async function getPayment(id: string) {
  const res = await ordersClient["get-order"][":id"].$get({
    param: { id }
  })

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data
}

const paymentQuery = (id: string, enabled: boolean) => useQuery({
  queryKey: createQueryKey("ui", ["payment"], id),
  queryFn: () => getPayment(id),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false,
  enabled
})

const paymentType: Record<string, string> = {
  donate: "привилегия",
  belkoin: "белкоины",
  charism: "харизма"
}

export const PaymentSuccess = ({
  id, nickname
}: Partial<PaymentSuccessProps>) => {
  const [expand, setExpand] = useState<boolean>(false);
  const { data: payment, isLoading } = paymentQuery(id!, !!id)

  if (!id || !nickname) return null;

  if (isLoading) {
    return (
      <div className="flex flex-col p-6 justify-between bg-neutral-900 h-96 border relative overflow-hidden border-neutral-50/10 rounded-xl gap-4 w-full">
        <Skeleton className="w-32 h-10" />
        <Skeleton className="self-end w-full h-16" />
      </div>
    )
  }

  if (!payment) return null;

  const { payment_type, payment_value, orderid } = payment;

  return (
    <div
      className="flex flex-col justify-between bg-neutral-900 h-96 border relative overflow-hidden
       border-neutral-50/10 rounded-xl gap-4 w-full"
    >
      <div
        className={`flex items-center z-[2] justify-center absolute w-full h-full bg-neutral-900/40 
          backdrop-blur-lg transition-all duration-500 ${expand ? "opacity-0" : "opacity-100"}`}
      >
        <div className="flex flex-col items-center gap-1">
          <Typography className="text-[20px] relative text-green">
            Спасибо за покупку!🥳
          </Typography>
          <Button
            className="w-fit bg-neutral-800 rounded-lg px-4"
            onClick={() => setExpand(true)}
          >
            <Typography className="text-white">
              Просмотреть
            </Typography>
          </Button>
        </div>
      </div>
      {expand && (
        <div
          onClick={() => setExpand(false)}
          className="flex cursor-pointer h-6 w-6 items-center justify-center p-1 z-[4] rounded-md 
            bg-neutral-200/20 absolute bottom-6 right-6"
        >
          <Typography className="text-neutral-400 text-[15px]">
            {`>`}
          </Typography>
        </div>
      )}
      <img
        src={SteveNight.src}
        draggable={false}
        width={120}
        height={120}
        alt=""
        className={`absolute -top-44 w-full object-cover h-[560px]`}
      />
      <div
        className="bg-gradient-to-t from-black via-black/80 to-transparent h-[270px] w-full absolute -bottom-24"
      />
      <div
        className={`flex w-full relative duration-500 transition-all p-6 justify-start items-center
          ${expand ? "opacity-100" : "opacity-0"} `}
      >
        <div className="flex bg-neutral-50 items-center justify-center w-fit px-6 py-2 rounded-lg">
          <Typography className="text-[16px] text-neutral-950 font-semibold">
            {nickname}
          </Typography>
        </div>
      </div>
      <div
        className={`flex w-full duration-500 transition-all items-end p-6 justify-start gap-4 select-none rounded-md overflow-hidden
          ${expand ? "opacity-100" : "opacity-0"} `}
      >
        <Avatar nickname={nickname} propWidth={96} propHeight={96} />
        <div className="flex flex-col gap-1 relative">
          <Typography className="text-[18px] text-neutral-300">
            ID заказа:&nbsp;
            <span className="text-neutral-50">
              #{orderid}
            </span>
          </Typography>
          <Typography className="text-[18px] text-neutral-300">
            Приобретено:&nbsp;
            <span className="text-neutral-50">
              {paymentType[payment_type]} {DONATE_TITLE[payment_value as keyof typeof DONATE_TITLE]}
            </span>
          </Typography>
        </div>
      </div>
    </div>
  )
}
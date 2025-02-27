import Link from 'next/link';
import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { z } from 'zod';
import { shopItemQuery } from '@repo/lib/queries/shop-item-query.ts';
import { useCreatePayment } from '@repo/lib/hooks/use-create-payment.ts';
import { Button } from '@repo/landing-ui/src/button.tsx';
import { createOrderBodySchema } from "@repo/types/schemas/payment/payment-schema.ts";
import { useState } from 'react';
import { toast } from 'sonner';
import { ShopPrice } from '#shop/shop-price.tsx';

export type PaymentFields = z.infer<typeof createOrderBodySchema>;

export const SubscriptionItemForm = () => {
  const { data: shopItemState } = shopItemQuery();
  const { createPaymentMutation } = useCreatePayment();
  const [privacy, setPrivacy] = useState<boolean>(false);

  const isValid = shopItemState
    ? shopItemState.nickname && shopItemState.currency && shopItemState.paymentValue && shopItemState.paymentType && privacy
    : false;

  const onSubmit = async () => {
    if (!shopItemState || !shopItemState.nickname || !shopItemState.paymentValue || !shopItemState.paymentType) return;

    if (!privacy) {
      return toast.error("Вы не приняли условия")
    }

    await createPaymentMutation.mutateAsync({
      nickname: shopItemState.nickname,
      paymentType: shopItemState.paymentType,
      paymentValue: shopItemState.paymentValue,
      currency: shopItemState.currency,
      privacy: privacy,
      fiatMethod: shopItemState.fiatMethod ?? "creditCard"
    });
  };

  return (
    <div
      className="flex flex-col justify-between gap-y-6 pt-2"
    >
      {/* <div className="flex flex-col gap-y-2">
        <div className="flex items-start gap-x-2">
          <Typography
            text_color="adaptiveWhiteBlack"
            className="text-[14px] tracking-tight leading-3 lg:text-[16px] break-words"
          >
            Почта
          </Typography>
        </div>
        <Input
          className="px-4"
          placeholder="Почта"
          {...register('email')}
        />
        {errors.email && <ErrorMessage message={errors.email.message} />}
      </div> */}
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-2">
          <label
            onClick={() => setPrivacy(!privacy)}
            htmlFor="privacy"
            className="flex items-center cursor-pointer relative"
          >
            <input
              id="privacy"
              type="checkbox"
              className="peer h-6 w-6 cursor-pointer transition-all appearance-none
                  rounded shadow hover:shadow-md border-[2px]
                  border-neutral-600 bg-neutral-700 checked:bg-neutral-900 checked:border-black"
            />
            <span
              className="absolute text-white opacity-0 peer-checked:opacity-100
               top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 20 20"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <label htmlFor="privacy" className="w-full select-none">
            <Typography className="text-[14px] tracking-tight leading-3 lg:text-[16px] break-words">
              Я согласен с&nbsp;
              <Link href="/rules" target="_blank" className="text-red">
                правилами&nbsp;
              </Link>
              проекта.
            </Typography>
          </label>
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-center gap-2 w-full">
        <div className="flex items-center gap-2 justify-center bg-neutral-600/40 p-2 w-full lg:w-1/3 rounded-lg">
          <Typography className='text-[18px]'>
            Итого:
          </Typography>
          <ShopPrice/>
        </div>
        <Button
          type="submit"
          disabled={!isValid}
          onClick={() => onSubmit()}
          className="py-2 w-full lg:w-2/3 rounded-lg group hover:bg-[#05b458] bg-[#088d47] hover:duration-300
					 duration-100 ease-in-out backdrop-filter backdrop-blur-lg"
        >
          <Typography className="text-lg text-white">
            Купить
          </Typography>
        </Button>
      </div>
    </div>
  );
};
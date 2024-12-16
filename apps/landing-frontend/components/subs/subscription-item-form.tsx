import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Input } from '#/ui/input';
import { Typography } from '#/ui/typography';
import { z } from 'zod';
import { shopItemQuery } from '#/lib/queries/shop-item-query.ts';
import { createOrderBodySchema } from '@repo/types/schemas/payment/payment-schema.ts';
import { useEffect } from 'react';
import { ShopSelectCurrency } from '#/components/shop/shop-select-currency.tsx';
import { useCreatePayment } from '#/lib/hooks/use-create-payment.ts';
import { Button } from '#/ui/button.tsx';

export type PaymentFields = z.infer<typeof createOrderBodySchema>;

const ErrorMessage = ({ message }: { message: string | undefined }) => {
  if (!message) return null;
  return <p className="text-sm font-normal text-red">{message}</p>;
};

export const SubscriptionItemForm = () => {
  const { data: shopItemState } = shopItemQuery();
  if (!shopItemState) return null;
  
  const { createPaymentMutation } = useCreatePayment();
  const { currency, paymentType, paymentValue } = shopItemState;
  
  const { formState: { errors, isValid }, setValue, handleSubmit, register } = useForm<PaymentFields>({
    mode: 'onChange',
    resolver: zodResolver(createOrderBodySchema),
    defaultValues: { privacy: false, paymentValue, paymentType },
  });
  
  useEffect(() => {
    if (shopItemState.currency) setValue('currency', currency);
  }, [ shopItemState ]);
  
  const onSubmit: SubmitHandler<PaymentFields> = async(values) => {
    await createPaymentMutation.mutateAsync(values);
  };
  
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-between gap-y-6"
    >
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-x-2">
          <Typography size="base" className="text-white">
            Игровой никнейм
          </Typography>
          <img
            title="Пожалуйста, перепроверьте ник перед оплатой!"
            src="/images/minecraft/icons/minecart_chest_big.webp"
            width={20}
            height={20}
            alt=""
            className="cursor-pointer"
          />
        </div>
        <Input className="px-4" placeholder="Введите никнейм"{...register('nickname')} />
        {errors.nickname && <ErrorMessage message={errors.nickname.message} />}
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-start gap-x-2">
          <Typography size="base" className="text-white">
            Почта
          </Typography>
        </div>
        <Input className="px-4" placeholder="Почта" {...register('email')} />
        {errors.email && <ErrorMessage message={errors.email.message} />}
      </div>
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center gap-2">
          <label
            htmlFor="privacy"
            className="flex items-center cursor-pointer relative"
          >
            <input
              id="privacy"
              type="checkbox"
              className="peer h-6 w-6 cursor-pointer transition-all appearance-none
                  rounded shadow hover:shadow-md border-[2px] border-neutral-600 bg-neutral-700 checked:bg-neutral-900 checked:border-black"
              {...register('privacy')}
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
                stroke-width="1"
              >
                <path
                  fill-rule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </span>
          </label>
          <label htmlFor="privacy" className="w-full">
            <Typography size="base" className="break-words">
              Я согласен с&nbsp;
              <Link href="rules" target="_blank" className="text-red">
                правилами&nbsp;
              </Link>
              проекта.
            </Typography>
          </label>
        </div>
        {errors.privacy && <ErrorMessage message={errors.privacy.message} />}
      </div>
      <ShopSelectCurrency />
      <Button
        type="submit"
        disabled={!isValid}
        className="py-2 w-full group hover:bg-[#05b458]/80 hover:duration-300
					 duration-100 ease-in-out bg-[#088d47]/80 backdrop-filter backdrop-blur-lg"
      >
        <Typography className="text-lg">
          Купить
        </Typography>
      </Button>
    </form>
  );
};
import { useMutationState, useQueryClient } from '@tanstack/react-query';
import { Typography } from '@repo/landing-ui/src/typography';
import Link from 'next/link';
import { SubscriptionItemForm } from '@repo/landing-components/src/subs/subscription-item-form';
import Totem from '@repo/assets/gifs/totem-of-undying-faked-death.gif';
import Heart from '@repo/assets/gifs/hardcore-heart-minecraft.gif';
import Duo from '@repo/assets/gifs/duo.gif';
import { ReactNode } from 'react';
import { CREATE_PAYMENT_DATA_QUERY_KEY, CREATE_PAYMENT_MUTATION_KEY } from '@repo/lib/hooks/use-create-payment';
import { ShopFinishedPreview } from './shop-preview';

type ShopAreaItemProps = {
  image: string,
  children: ReactNode
}

export const ShopAreaItem = ({
  children, image,
}: ShopAreaItemProps) => {
  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <img src={image} width={142} height={142} alt="" draggable={false} />
      <div className="flex flex-col items-center">
        {children}
      </div>
    </div>
  );
};

export const ShopArea = () => {
  const qc = useQueryClient();
  const paymentData = qc.getQueryData<{ data: string, status: 'success' | 'error' }>(CREATE_PAYMENT_DATA_QUERY_KEY);

  const mutData = useMutationState({
    filters: ({ mutationKey: CREATE_PAYMENT_MUTATION_KEY }),
    select: m => m.state.status,
  });

  const isPaymentSuccess = paymentData ? paymentData.status === 'success' : false
  const isPaymentError = paymentData ? paymentData.status === 'error' : false
  const isPaymentProccessing = mutData[mutData.length - 1] === 'pending';

  return (
    <>
      {isPaymentError && (
        <ShopAreaItem image={Heart.src}>
          <Typography className="text-xl">
            Произошла ошибка при создании заказа :/
          </Typography>
          <Typography className="text-neutral-300 text-lg">
            Повторите попытку позже
          </Typography>
        </ShopAreaItem>
      )}
      {isPaymentSuccess && (
        <ShopAreaItem image={Duo.src}>
          <Typography className="text-xl text-center">
            Перейдите по ссылке ниже, чтобы оплатить заказ
          </Typography>
          <Link
            href={paymentData?.data || ''}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Typography className="text-dark-green text-lg">
              (кликни)
            </Typography>
          </Link>
        </ShopAreaItem>
      )}
      {isPaymentProccessing && (
        <ShopAreaItem image={Totem.src}>
          <Typography className="text-xl">
            Платеж уже выполняется...
          </Typography>
        </ShopAreaItem>
      )}
      {(!isPaymentSuccess && !isPaymentProccessing && !isPaymentError) && (
        <div className="flex flex-col w-full gap-4">
          <ShopFinishedPreview />
          <SubscriptionItemForm />
        </div>
      )}
    </>
  );
};
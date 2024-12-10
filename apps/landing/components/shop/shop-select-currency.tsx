import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SHOP_ITEM_QUERY_KEY, ShopItemQuery, shopItemQuery } from '#/lib/queries/shop-item-query.ts';
import { PaymentCurrency } from '@repo/types/entities/payment-types.ts';
import { Typography } from '#/ui/typography.tsx';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '#/ui/dialog.tsx';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { currenciesQuery } from '#/lib/queries/currencies-query.ts';
import { Block } from '#/ui/block.tsx';

export const ShopSelectCurrency = () => {
  const qc = useQueryClient();
  const [ selectedCurrency, setSelectedCurrency ] = useState<PaymentCurrency | null>(null);
  const [ open, setOpen ] = useState(false);
  const { data: currencies } = currenciesQuery();
  
  const { data: shopItemState } = shopItemQuery();
  if (!shopItemState) return null;
  
  const { currency } = shopItemState;
  
  const selectCurrency = () => {
    setOpen(false);
    
    qc.setQueryData(
      SHOP_ITEM_QUERY_KEY,
      (prev: ShopItemQuery) => ({ ...prev, currency: selectedCurrency }),
    );
  };
  
  return (
    <div className="flex items-center gap-2">
      <Typography className="text-xl text-white">
        Метод оплаты
      </Typography>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="flex group max-w-[128px] overflow-hidden gap-2 bg-neutral-700 px-2 py-0.5 rounded-md">
            {currency && (
              <Typography className="inline">
                {currency}
              </Typography>
            )}
            {!currency && (
              <>
                <Typography
                  className="inline transition-all
                   group-hover:duration-75 duration-75 group-hover:translate-x-6 -translate-x-24"
                >
                  выбрать
                </Typography>
                <Typography
                  className="inline transition-all
                  group-hover:duration-75 duration-75 text-nowrap group-hover:translate-x-24 -translate-x-20"
                >
                  не выбрано
                </Typography>
              </>
            )}
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 max-w-4xl">
          <VisuallyHidden>
            <DialogTitle>Выберите способ оплаты для продолжения оформления заказа</DialogTitle>
          </VisuallyHidden>
          <Block blockItem type="column" rounded="big" className="h-full w-full">
            <div className="flex flex-col w-full gap-y-4">
              <Typography size="xl" className="text-center">
                Выберите способ оплаты для продолжения оформления заказа
              </Typography>
              <div className="grid grid-cols-3 gap-2 auto-rows-auto w-full h-full">
                {!currencies && <Typography size="lg">Доступых валют нет :/</Typography>}
                {currencies && currencies.map(({ id, title, imageUrl, value, isAvailable }) => (
                  <div
                    key={id}
                    onClick={() => setSelectedCurrency(value as PaymentCurrency)}
                    className={`flex cursor-pointer items-center backdrop-blur-xl
                    transition-all justify-between p-4 bg-neutral-700/80 rounded-md
                     ${!isAvailable && 'opacity-40 pointer-events-none'}
                     ${selectedCurrency === value && 'bg-neutral-500'}
                  `}
                  >
                    <img src={imageUrl} alt="" width={36} height={36} className="rounded-3xl" />
                    <Typography className="text-xl">
                      {title}
                    </Typography>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between w-full">
                <Typography className="text-neutral-300 text-[18px]">
                  {selectedCurrency !== 'RUB' && (
                    '[!] Оплата будет через телеграм-бота'
                  )}
                </Typography>
                <div className="flex items-center gap-2">
                  <button
                    className="disabled:opacity-40 disabled:pointer-events-none
                      text-green-server-color text-lg w-fit self-end button px-16 py-1"
                    onClick={selectCurrency}
                  >
                    Выбрать
                  </button>
                </div>
              </div>
            </div>
          </Block>
        </DialogContent>
      </Dialog>
    </div>
  );
};
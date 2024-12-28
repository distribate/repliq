import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { SHOP_ITEM_QUERY_KEY, ShopItemQuery, shopItemQuery } from '@repo/lib/queries/shop-item-query';
import { Typography } from '@repo/landing-ui/src/typography';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@repo/landing-ui/src/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { currenciesQuery } from '@repo/lib/queries/currencies-query';
import { Block } from '@repo/landing-ui/src/block';
import { Button } from '@repo/landing-ui/src/button';
import { PaymentCurrency } from "@repo/types/entities/payment-types";

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
    <div className="flex justify-between w-full items-center gap-2">
      <Typography size="base" text_color="adaptiveWhiteBlack">
        Метод оплаты
      </Typography>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <div className="flex group max-w-1/3 overflow-hidden gap-2
           border-2 dark:border-neutral-600 bg-white/80 border-neutral-300 dark:bg-background-dark/80 lg:px-6 px-4 py-1 lg:py-2 rounded-lg">
            <Typography className="text-[14px] lg:text-[16px] text-background-dark/80 inline dark:text-white">
              {currency ?? 'выбрать'}
            </Typography>
          </div>
        </DialogTrigger>
        <DialogContent className="p-0 max-w-2xl">
          <VisuallyHidden>
            <DialogTitle>Выберите способ оплаты для продолжения оформления заказа</DialogTitle>
          </VisuallyHidden>
          <Block blockItem type="column" rounded="big" className="h-full w-full">
            <div className="flex flex-col w-full gap-4">
              <Typography size="xl" className="text-center">
                Выберите способ оплаты для продолжения оформления заказа
              </Typography>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 auto-rows-auto w-full h-full">
                {!currencies && <Typography size="lg">Доступых валют нет :/</Typography>}
                {currencies && currencies.map(({ id, title, imageUrl, value, isAvailable }) => (
                  <div
                    key={id}
                    onClick={() => setSelectedCurrency(value as PaymentCurrency)}
                    className={`flex cursor-pointer items-center backdrop-blur-xl
                    transition-all justify-between p-4 rounded-md border-2 bg-neutral-400/80 dark:bg-neutral-700/80
                     ${!isAvailable && 'opacity-40 pointer-events-none'}
                     ${selectedCurrency === value ? 'border-neutral-800 dark:border-neutral-400' : 'border-transparent'}
                  `}
                  >
                    <img src={imageUrl} alt="" width={36} height={36} className="rounded-3xl" />
                    <Typography className="text-xl" text_color="adaptiveWhiteBlack">
                      {title}
                    </Typography>
                  </div>
                ))}
              </div>
              <div className="flex flex-col lg:flex-row gap-2 items-center justify-between w-full">
                <Typography size="base" className="text-neutral-800 dark:text-neutral-400">
                  {selectedCurrency !== 'RUB' && (
                    '[!] Оплата будет через телеграм-бота'
                  )}
                </Typography>
                <div className="flex items-center lg:w-fit w-full gap-2">
                  <Button
                    onClick={selectCurrency}
                    className="py-2 w-full group hover:bg-[#05b458] bg-[#088d47] hover:duration-300
					            duration-100 ease-in-out  backdrop-filter backdrop-blur-lg"
                  >
                    <Typography className="text-lg text-white">
                      Выбрать
                    </Typography>
                  </Button>
                </div>
              </div>
            </div>
          </Block>
        </DialogContent>
      </Dialog>
    </div>
  );
};
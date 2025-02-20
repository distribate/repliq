'use client';

import { Block } from '@repo/landing-ui/src/block.tsx';
import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { ReactNode, useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/landing-ui/src/accordion.tsx';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@repo/landing-ui/src/dialog.tsx';
import { SubscriptionItemDescription } from '@repo/landing-components/src/subs/subscription-item-description.tsx';
import { SHOP_ITEM_QUERY_KEY, ShopItemQuery } from '@repo/lib/queries/shop-item-query.ts';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ShopArea } from '@repo/landing-components/src/shop/shop-area.tsx';
import { Button } from '@repo/landing-ui/src/button.tsx';
import type { Donates } from '@repo/lib/queries/get-donates';

export const usePayment = () => {
  const qc = useQueryClient()

  const updatePaymentDetailsMutation = useMutation({
    mutationFn: async (val: Partial<ShopItemQuery>) => {
      return qc.setQueryData(SHOP_ITEM_QUERY_KEY, (prev: ShopItemQuery) => ({
        ...prev, ...val,
      }));
    },
    onSettled: () => qc.invalidateQueries({ queryKey: SHOP_ITEM_QUERY_KEY }),
    onError: (e) => {
      throw new Error(e.message);
    },
  })

  const clearPaymentDetails = () => qc.resetQueries({ queryKey: SHOP_ITEM_QUERY_KEY })

  return { updatePaymentDetailsMutation, clearPaymentDetails }
}

export const StartPayment = () => {
  return (
    <DialogContent className="!w-[640px] h-auto overflow-y-auto border-none gap-0">
      <ShopArea />
    </DialogContent>
  )
}

export const SubscriptionItem = ({
  rating, description, id, price, title, origin, imageUrl,
}: Donates) => {
  const [open, setOpen] = useState<boolean>(false);
  const { updatePaymentDetailsMutation, clearPaymentDetails } = usePayment()

  const handleDialogControl = (open: boolean) => {
    if (!open) {
      clearPaymentDetails()
    }

    setOpen(open);
  };

  const selectDonateItem = () => updatePaymentDetailsMutation.mutate({ paymentType: 'donate', paymentValue: origin });

  return (
    <Dialog
      key={id}
      open={open}
      onOpenChange={handleDialogControl}
    >
      <DialogTrigger
        onClick={selectDonateItem}
        className="flex flex-col book h-[540px] w-full
         hover:-translate-y-2 transition ease-out duration-500 justify-between"
      >
        <SubscriptionItemDescription
          description={description}
          name={title}
          commands={[]}
          rating={rating}
        />
        <Typography className="text-black cursor-pointer w-max self-end">
          узнать больше
        </Typography>
      </DialogTrigger>
      <DialogContent className="!w-[540px] max-h-[86%] p-0 overflow-y-auto !bg-transparent border-none gap-y-2 m-0">
        <Block
          type="column"
          className="gap-x-2 gap-y-2"
          rounded="big"
          blockItem
        >
          <div className="flex flex-col w-full gap-y-2 justify-center h-full">
            <Typography size="xl">
              Привилегия: {title}
            </Typography>
            <div className="flex items-center gap-1">
              <Typography size="lg" className="text-water-meadow">
                Цена:
              </Typography>
              <Typography size="lg" text_color="adaptiveWhiteBlack">
                {price + ' руб'}
              </Typography>
            </div>
            <Accordion type="single" collapsible>
              <AccordionItem value="sub-description">
                <AccordionTrigger withBook={false} className="pt-0 pb-2 m-0">
                  <Typography size="lg" className="text-water-meadow">
                    Описание <span className="text-neutral-600">(клик)</span>
                  </Typography>
                </AccordionTrigger>
                <AccordionContent>
                  <img
                    width={600}
                    height={1000}
                    src={imageUrl}
                    alt=""
                    loading="lazy"
                    draggable="true"
                    className="h-[80%] w-full rounded-[4px] lg:h-full"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <div className="flex md:flex-row flex-col items-center w-full gap-2">
            <StartPayment />
            <DialogClose
              asChild
              className="lg:w-1/3 w-full"
            >
              <Button
                className="w-full py-2 rounded-lg group hover:bg-red/80 hover:duration-300
					        duration-100 ease-in-out bg-red-server-color/80 backdrop-filter backdrop-blur-lg"
              >
                <Typography className="text-lg text-white">
                  Не хочу
                </Typography>
              </Button>
            </DialogClose>
          </div>
        </Block>
      </DialogContent>
    </Dialog>
  );
};
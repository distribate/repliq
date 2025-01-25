'use client';

import { Block } from '@repo/landing-ui/src/block.tsx';
import { Typography } from '@repo/landing-ui/src/typography.tsx';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@repo/landing-ui/src/accordion.tsx';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '@repo/landing-ui/src/dialog.tsx';
import { SubscriptionItemDescription } from '@repo/landing-components/src/subs/subscription-item-description.tsx';
import { SHOP_ITEM_QUERY_KEY, ShopItemQuery } from '@repo/lib/queries/shop-item-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { ShopArea } from '@repo/landing-components/src/shop/shop-area.tsx';
import { Button } from '@repo/landing-ui/src/button.tsx';
import { DonateType } from '@repo/lib/queries/get-donates';

export const SubscriptionItem = ({
  rating, description, commands, id, price, title, origin, imageUrl,
}: DonateType["data"][0]) => {
  const qc = useQueryClient();
  const [o, setO] = useState<boolean>(false);

  const handleDialogControl = (open: boolean) => {
    if (!open) {
      qc.resetQueries({ queryKey: SHOP_ITEM_QUERY_KEY });
    }

    setO(open);
  };

  const selectDonateItem = () => {
    return qc.setQueryData(SHOP_ITEM_QUERY_KEY, (prev: ShopItemQuery) => ({
      ...prev, paymentType: 'donate', paymentValue: origin,
    }));
  };

  return (
    <Dialog
      key={id}
      open={o}
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
          commands={commands}
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
            <Dialog>
              <DialogTrigger
                asChild
                className="w-full"
              >
                <Button
                  className="py-2 rounded-lg w-full group hover:bg-[#05b458] bg-[#088d47] hover:duration-300
					        duration-100 ease-in-out  backdrop-filter backdrop-blur-lg"
                >
                  <Typography className="text-lg text-white">
                    Перейти к покупке
                  </Typography>
                </Button>
              </DialogTrigger>
              <DialogContent className="!w-[640px] h-auto !bg-transparent p-0 overflow-y-auto border-none gap-0">
                <Block blockItem type="column" rounded="big" className="h-full w-full">
                  <Typography size="xl" position="center" className="w-[90%] self-center tracking-tight mb-4 lg:mb-8">
                    Покупка привилегии ({title})
                  </Typography>
                  <ShopArea />
                </Block>
              </DialogContent>
            </Dialog>
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
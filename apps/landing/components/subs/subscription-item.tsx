'use client';

import Image from 'next/image';
import { Block } from '#/ui/block';
import { Typography } from '#/ui/typography';
import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '#/ui/accordion';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '#/ui/dialog';
import { DialogWrapper } from '#/components/wrappers/dialog-wrapper';
import { SubscriptionItemDescription } from '#/components/subs/subscription-item-description.tsx';
import { SHOP_ITEM_QUERY_KEY, ShopItemQuery } from '#/lib/queries/shop-item-query.ts';
import { useQueryClient } from '@tanstack/react-query';
import { ShopArea } from '#/components/shop/shop-area.tsx';
import { DonateEntity } from '@repo/types/entities/entities-type.ts';

export const SubscriptionItem = ({
  rating, description, commands, id, price, title, origin, imageUrl
}: DonateEntity) => {
  const qc = useQueryClient();
  const [ isOpen, setIsOpen ] = useState<boolean>(false);
  
  const handleDialogControl = (open: boolean) => {
    if (!open) {
      qc.resetQueries({ queryKey: SHOP_ITEM_QUERY_KEY });
    }
    
    setIsOpen(open);
  };
  
  const selectDonateItem = () => {
    return qc.setQueryData(SHOP_ITEM_QUERY_KEY, (prev: ShopItemQuery) => ({
      ...prev, paymentType: 'donate', paymentValue: origin,
    }));
  };
  
  return (
    <Dialog
      key={id}
      open={isOpen}
      onOpenChange={handleDialogControl}
    >
      <DialogTrigger
        onClick={selectDonateItem}
        className="flex flex-col book h-[540px] w-full
         hover:-translate-y-1 transition ease-out duration-500
         cursor-pointer justify-between"
      >
        <SubscriptionItemDescription description={description} name={title} commands={commands} rating={rating} />
        <Typography className="text-black cursor-pointer w-max self-end">
          узнать больше
        </Typography>
      </DialogTrigger>
      <DialogContent className="max-w-[520px] max-h-[80%] p-0 overflow-y-auto !bg-transparent border-none gap-y-2 m-0">
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
            <Typography size="lg" className="text-water-meadow">
              Цена:
              <span className="text-white">
                &nbsp;{price + ' руб'}
              </span>
            </Typography>
            <Typography size="lg" className="text-water-meadow">
              Возможности, команды и бонусы
            </Typography>
            <Accordion type="single" collapsible>
              <AccordionItem value="sub-description">
                <AccordionTrigger className="text-xl text-white">
                  Описание:
                </AccordionTrigger>
                <AccordionContent>
                  <Image
                    width={600}
                    height={1000}
                    src={imageUrl}
                    alt={title}
                    loading="lazy"
                    draggable="true"
                    className="h-[80%] w-full lg:h-full"
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </Block>
        <Block
          blockItem
          rounded="big"
          className="flex lg:flex-row flex-col justify-between gap-x-2 h-full lg:px-4"
        >
          <DialogWrapper
            title={title}
            classNames={{
              trigger: 'button px-2 py-1 h-max w-full lg:w-2/3 text-center lg:px-2 text-md lg:text-lg text-green-server-color',
              content: 'max-w-[600px] h-auto !bg-transparent p-0 overflow-y-auto border-none gap-0',
            }}
            trigger="Перейти к покупке"
            content={
              <Block blockItem type="column" rounded="big" className="h-full w-full">
                <Typography size="xl" position="center" className="mb-4 lg:mb-8">
                  Покупка привилегии ({title})
                </Typography>
                <ShopArea />
              </Block>
            }
          />
          <DialogClose
            className="lg:w-1/3 w-full h-max
            button py-1 px-4 lg:px-6 text-md lg:text-lg text-red-server-color"
          >
            Не хочу
          </DialogClose>
        </Block>
      </DialogContent>
    </Dialog>
  );
};
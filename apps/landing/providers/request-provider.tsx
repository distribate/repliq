'use client';

import { useState } from 'react';
import { Dialog, DialogContent } from '#/ui/dialog';
import { Typography } from '#/ui/typography';
import Image from 'next/image';

export const ReqProvider = () => {
  const [ open, setOpen ] = useState<boolean>(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="flex flex-col md:flex-row items-center pl-4 lg:pl-4 py-0 pr-0 max-w-6xl border border-none">
        <div className="flex flex-col h-full w-full py-4">
          <Typography size="xl">
            Заказ: <span className="text-project-color">
              
              </span>
          </Typography>
          <Typography size="xl" className="mt-6 text-[#fabbfb]">
            Спасибо за покупку. Приятной игры!
          </Typography>
        </div>
        <Image
          src="https://cdn.discordapp.com/attachments/904344676587417621/1204167614398603285/edd9f462cd82f8eb9617ddbc06c9f709.jpg?ex=65d3bf7b&is=65c14a7b&hm=ca7382c69d4d67ab03936cf1e70cdf91027814745f6b004a0b72403a669bdf3a&"
          alt=""
          width={400}
          height={400}
        />
      </DialogContent>
    </Dialog>
  );
};
"use client"

import { WIKI_HEADERS } from "@repo/shared/wiki/data/configs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@repo/landing-ui/src/accordion"
import { Block } from "@repo/landing-ui/src/block"
import { TabsList, TabsTrigger } from "@repo/landing-ui/src/tabs"
import { Typography } from "@repo/landing-ui/src/typography"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

export const WikiNavigationBar = () => {
  const router = useRouter();

  return (
    <TabsList className="hidden xl:flex flex-col p-0 rounded-xl w-full xl:w-[30%] items-start sticky top-0">
      <Block border="mini_gray" className="gap-y-12 h-full" size="normal" rounded="big" type="column">
        <div className="flex flex-col gap-y-2">
          <Typography className="text-3xl">
            Общая информация
          </Typography>
          <div className="flex flex-col gap-y-2">
            <div className="flex flex-row justify-between items-center group cursor-pointer">
              <TabsTrigger value="general">
                <Typography size="xl" hover_effects="pink_drop">
                  Основной раздел
                </Typography>
              </TabsTrigger>
              <Image
                src="/images/minecraft/icons/spyglass_big.webp"
                className="group-hover:rotate-45 w-[16px] h-[20px] group-hover:duration-300 duration-300"
                width={16}
                alt="General"
                height={16}
              />
            </div>
            <Accordion type="single" collapsible defaultValue="aspects">
              <AccordionItem value="aspects">
                <AccordionTrigger className="py-0 my-0 group">
                  <Typography size="xl" hover_effects="pink_drop">
                    Аспекты игры
                  </Typography>
                </AccordionTrigger>
                <AccordionContent>
                  {WIKI_HEADERS.map((item) => (
                    item.aspect?.map((item, idx) => (
                      <div key={idx} className="group cursor-pointer">
                        <TabsTrigger value={item.value}>
                          <Typography size="base" hover_effects="pink_drop">
                            &nbsp;&nbsp;{item.title}
                          </Typography>
                        </TabsTrigger>
                      </div>
                    ))
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            {WIKI_HEADERS.map((item) => (
              item.links?.map((item, idx) => (
                <div key={idx} className="flex flex-row items-center justify-between group cursor-pointer">
                  {item.isTab ? (
                    <TabsTrigger value={item.value}>
                      <Typography size="xl" hover_effects="pink_drop">
                        {item.title}
                      </Typography>
                    </TabsTrigger>
                  ) : (
                    <div onClick={() => router.push(`${item.value}`)}>
                      <Typography size="xl" hover_effects="pink_drop">
                        {item.title}
                      </Typography>
                    </div>
                  )}
                  <Image
                    src="/images/minecraft/icons/spyglass_big.webp"
                    className="group-hover:rotate-45 w-[16px] h-[20px] group-hover:duration-300 duration-300"
                    width={26}
                    height={16}
                    alt="Spyglass Down"
                  />
                </div>
              ))
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <Typography className="text-3xl">
            Прочее
          </Typography>
          <div className="flex flex-col gap-y-4">
            <Accordion type="single" collapsible>
              <AccordionItem value="servers">
                <AccordionTrigger className="py-0 my-0 group">
                  <Typography size="xl" hover_effects="pink_drop">
                    Сервера
                  </Typography>
                </AccordionTrigger>
                <AccordionContent className="">
                  {WIKI_HEADERS.map((item) => (
                    item.servers?.map((item, idx) => (
                      <div className="group cursor-pointer" key={idx}>
                        <TabsTrigger value={item.value}>
                          <Typography size="xl" hover_effects="pink_drop">
                            &nbsp;&nbsp;{item.title}
                          </Typography>
                        </TabsTrigger>
                      </div>
                    ))
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
          <Link href="/wiki/modpack" className="group cursor-pointer">
            <Typography size="base" hover_effects="pink_drop">
              Сборки модов
            </Typography>
          </Link>
        </div>
      </Block>
    </TabsList>
  )
}
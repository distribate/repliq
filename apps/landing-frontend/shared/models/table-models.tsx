import { Block } from "#/ui/block";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from "#/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "#/ui/tooltip";
import { createColumnHelper } from "@tanstack/react-table";
import Image from "next/image";
import { ArmorItem } from '#/shared/data/wiki/wiki-list';

const columnHelper = createColumnHelper<ArmorItem>();

type TableImageProps = {
  src: string;
  alt: string
}

const TableImage = ({
  src, alt
}: TableImageProps) => {
  return (
    <Image
      src={`${src}`}
      width={16}
      height={16}
      className="w-[9px] h-[9px] lg:w-[16px] lg:h-[16px]"
      alt={alt}
    />
  );
};

export const armorColumnsEffects = [
  columnHelper.accessor("attribute", {
    header: "Название",
    cell: (props) => (
      <div className="flex items-center gap-x-2">
        <TableImage
          src={`${props.getValue().icon}`}
          alt={props.getValue().name}
        />
        <span>{props.getValue().name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("effects", {
    header: "Эффект/Особенность",
    cell: (props) => <span>{props.getValue()?.effect_name}</span>,
  }),
];

export const armorColumnsPopulators = [
  columnHelper.group({
    id: "Name",
    header: "",
    columns: [
      columnHelper.accessor("attribute", {
        header: "Название",
        cell: props => (
          <div className="flex items-center gap-x-2">
            <TableImage
              src={props.getValue()?.icon}
              alt={props.getValue()?.name}
            />
            <span>{props.getValue()?.name}</span>
          </div>
        ),
      }),
    ],
  }),
  columnHelper.group({
    id: "Structory",
    header: "Распространенность",
    columns: [
      columnHelper.accessor("isNatural", {
        header: "Природный",
        cell: (props) => (props.getValue() ? "Да" : "Нет"),
      }),
      columnHelper.accessor("isNatural", {
        header: "Руда",
        cell: (props) => (
          <div className="flex items-center gap-x-2">
            {/* <TableImage
              src={props.getValue()?.icon}
              alt={props.getValue()?.name}
            /> */}
            <span>{props.getValue()?.populators?.ore?.name || "-"}</span>
          </div>
        ),
      }),
      columnHelper.accessor("isNatural", {
        id: "Structory_Biomes",
        header: "Структура",
        cell: (props) => (
          <Dialog modal>
            {props.getValue()?.populators?.structory ?
              <DialogTrigger>
                список
              </DialogTrigger> : "-"}
            <DialogContent className="mx-auto w-[90%] max-w-md bg-transparent border-none p-0 m-0">
              <Block size="normal" rounded="normal" border="mini_gray">
                <div className="flex flex-col items-start gap-x-2">
                  <div className="flex justify-between">
                    <p className="text-lg lg:text-xl text-[#fabbfb] mb-4">
                      Биомы, где можно найти данную руду:
                    </p>
                    <DialogClose className="text-xl self-start">
                      &times;
                    </DialogClose>
                  </div>
                  {props
                    .getValue()?.populators?.structory
                    ?.map((item: React.ReactNode, idx: number) => (
                      <span key={idx} className="text-white text-md lg:text-lg">
                        {item}
                      </span>
                    ))}
                </div>
              </Block>
            </DialogContent>
          </Dialog>
        ),
      }),
      columnHelper.accessor("isNatural", {
        id: "Structory_Chance",
        header: "Шанс",
        cell: (props) => (
          <Tooltip>
            {props.getValue() ? (
              <TooltipTrigger>
                <span>{props.getValue()?.populators?.chance + "%"}</span>
              </TooltipTrigger>
            ) : (
              "-"
            )}
            <TooltipContent className="bg-black/50 backdrop-filter backdrop-blur-md border-none p-2 rounded-xl">
              <p className="text-neutral-400 text-lg">
                Шанс нахождения руды на 1 чанк
              </p>
            </TooltipContent>
          </Tooltip>
        ),
      }),
    ],
  }),
  columnHelper.group({
    id: "Height",
    header: "Высота",
    columns: [
      columnHelper.accessor("isNatural", {
        id: "Height_Min",
        header: "Мин.",
        cell: (props) => props.getValue()?.populators?.height?.min || "-",
      }),
      columnHelper.accessor("isNatural", {
        id: "Height_Max",
        header: "Макс.",
        cell: (props) => props.getValue()?.populators?.height?.max || "-",
      }),
    ],
  }),
];

export const armorColumnsDurability = [
  columnHelper.accessor("attribute", {
    header: "Название",
    cell: (props) => (
      <div className="flex items-center gap-x-2">
        <TableImage
          src={`${props.getValue().icon}`}
          alt={props.getValue().name}
        />
        <span>{props.getValue().name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("durability.helmet", {
    header: "Шлем",
    cell: (props) => <span>{props.getValue().generic + ` ед.`}</span>,
  }),
  columnHelper.accessor("durability.chestplate", {
    header: "Нагрудник",
    cell: (props) => <span>{props.getValue().generic + ` ед.`}</span>,
  }),
  columnHelper.accessor("durability.leggings", {
    header: "Поножи",
    cell: (props) => <span>{props.getValue().generic + ` ед.`}</span>,
  }),
  columnHelper.accessor("durability.boots", {
    header: "Ботинки",
    cell: (props) => <span>{props.getValue().generic + ` ед.`}</span>,
  }),
];

export const armorColumnsArmor = [
  columnHelper.accessor("attribute", {
    header: "Название",
    cell: (props) => (
      <div className="flex items-center gap-x-2">
        <TableImage
          src={`${props.getValue().icon}`}
          alt={props.getValue().name}
        />
        <span>{props.getValue().name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("armor.helmet", {
    header: () => (
      <div className="flex items-center gap-x-1">
        <span>Шлем</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-1 w-full">
        <span>{props.getValue().generic}</span>
        <div className="flex flex-nowrap items-center">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("armor.chestplate", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Нагрудник</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("armor.leggings", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Поножи</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2 text-center">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("armor.boots", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Ботинки</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2 text-center">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
];

export const armorColumnsToughness = [
  columnHelper.accessor("attribute", {
    header: "Название",
    cell: (props) => (
      <div className="flex items-center gap-x-2">
        <TableImage
          src={`${props.getValue().icon}`}
          alt={props.getValue().name}
        />
        <span>{props.getValue().name}</span>
      </div>
    ),
  }),
  columnHelper.accessor("armorThougness.helmet", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Шлем</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2 text-center">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("armorThougness.chestplate", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Нагрудник</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2 text-center">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("armorThougness.leggings", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Поножи</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2 text-center">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("armorThougness.boots", {
    header: () => (
      <div className="flex items-center gap-x-2 text-center">
        <span>Поножи</span>
      </div>
    ),
    cell: (props) => (
      <div className="flex items-center gap-x-2 text-center">
        <span>{props.getValue().generic}</span>
        <div className="flex-nowrap items-center flex">
          (<TableImage src="/images/minecraft/icons/armor.webp" alt="Armor" />
          &nbsp;x {props.getValue().generic / 2})
        </div>
      </div>
    ),
  }),
];
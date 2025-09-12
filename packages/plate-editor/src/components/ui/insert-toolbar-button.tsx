import * as React from 'react';

import type { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';

import {
  CalendarIcon,
  ChevronRightIcon,
  Columns3Icon,
  FileCodeIcon,
  FilmIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ImageIcon,
  Link2Icon,
  ListIcon,
  ListOrderedIcon,
  MinusIcon,
  PilcrowIcon,
  PlusIcon,
  QuoteIcon,
  RadicalIcon,
  SquareIcon,
  TableIcon,
  TableOfContentsIcon,
} from 'lucide-react';
import { KEYS } from 'platejs';
import { type PlateEditor, useEditorRef } from 'platejs/react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './dropdown-menu';
import {
  insertBlock,
  insertInlineElement,
} from '#plate/components/editor/transforms';

import { ToolbarButton, ToolbarMenuGroup } from './toolbar';

type Group = {
  group: string;
  items: Item[];
};

interface Item {
  icon: React.ReactNode;
  value: string;
  onSelect: (editor: PlateEditor, value: string) => void;
  focusEditor?: boolean;
  label?: string;
}

const groups: Group[] = [
  {
    group: 'Basic blocks',
    items: [
      {
        icon: <PilcrowIcon />,
        label: 'Параграф',
        value: KEYS.p,
      },
      {
        icon: <Heading1Icon />,
        label: 'Заголовок 1',
        value: 'h1',
      },
      {
        icon: <Heading2Icon />,
        label: 'Заголовок 2',
        value: 'h2',
      },
      {
        icon: <Heading3Icon />,
        label: 'Заголовок 3',
        value: 'h3',
      },
      {
        icon: <TableIcon />,
        label: 'Таблица',
        value: KEYS.table,
      },
      {
        icon: <FileCodeIcon />,
        label: 'Код',
        value: KEYS.codeBlock,
      },
      {
        icon: <QuoteIcon />,
        label: 'Цитата',
        value: KEYS.blockquote,
      },
      {
        icon: <MinusIcon />,
        label: 'Разделитель',
        value: KEYS.hr,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: 'Lists',
    items: [
      {
        icon: <ListIcon />,
        label: 'Маркированный список',
        value: KEYS.ul,
      },
      {
        icon: <ListOrderedIcon />,
        label: 'Нумерованный список',
        value: KEYS.ol,
      },
      {
        icon: <SquareIcon />,
        label: 'Список дел',
        value: KEYS.listTodo,
      },
      {
        icon: <ChevronRightIcon />,
        label: 'Переключить список',
        value: KEYS.toggle,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  // {
  //   group: 'Media',
  //   items: [
  //     {
  //       icon: <ImageIcon />,
  //       label: 'Изображение',
  //       value: KEYS.img,
  //     },
  //     {
  //       icon: <FilmIcon />,
  //       label: 'Стороннее',
  //       value: KEYS.mediaEmbed,
  //     },
  //   ].map((item) => ({
  //     ...item,
  //     onSelect: (editor, value) => {
  //       insertBlock(editor, value);
  //     },
  //   })),
  // },
  {
    group: 'Продвинутые блоки',
    items: [
      {
        icon: <TableOfContentsIcon />,
        label: 'Оглавление',
        value: KEYS.toc,
      },
      {
        icon: <Columns3Icon />,
        label: '3 колонки',
        value: 'action_three_columns',
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      },
    })),
  },
  {
    group: 'Строчный',
    items: [
      {
        icon: <Link2Icon />,
        label: 'Ссылка',
        value: KEYS.link,
      },
      {
        focusEditor: true,
        icon: <CalendarIcon />,
        label: 'Дата',
        value: KEYS.date,
      },
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      },
    })),
  },
];

export function InsertToolbarButton(props: DropdownMenuProps) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Insert" isDropdown>
          <PlusIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="flex max-h-[500px] min-w-0 flex-col overflow-y-auto"
        align="start"
      >
        {groups.map(({ group, items: nestedItems }) => (
          <ToolbarMenuGroup key={group} label={group}>
            {nestedItems.map(({ icon, label, value, onSelect }) => (
              <DropdownMenuItem
                key={value}
                className="min-w-[180px]"
                onSelect={() => {
                  onSelect(editor, value);
                  editor.tf.focus();
                }}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </ToolbarMenuGroup>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

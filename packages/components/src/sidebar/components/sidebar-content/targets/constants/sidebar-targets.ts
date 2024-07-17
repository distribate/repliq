import { Axe, NotebookTabs, Sword, UsersRound } from 'lucide-react';

export const SIDEBAR_TARGETS = [
  {
    title: 'Друзья',
    link: '/friends',
    icon: UsersRound,
  },
  {
    title: 'Клан',
    link: '/clan',
    icon: Sword,
  },
  {
    title: 'Ивенты',
    link: '/events',
    icon: Axe,
  },
  {
    title: 'Справочник',
    link: 'https://fasberry.ru/wiki',
    icon: NotebookTabs,
  },
];
import { Axe, NotebookTabs, Cuboid, UsersRound } from 'lucide-react';

export const SIDEBAR_TARGETS = [
  {
    title: 'Друзья',
    link: '/friends',
    icon: UsersRound,
  },
  {
    title: 'Территории',
    link: '/lands',
    icon: Cuboid,
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
export type NavigationLinkProps = {
  href: string,
  title: string
}

export const NAVIGATION_LINKS: NavigationLinkProps[] = [
  {
    title: 'Главная', href: '/',
  },
  {
    title: 'Рейтинги', href: '/ratings',
  },
  {
    title: 'Территории', href: '/lands',
  },
  {
    title: 'Треды', href: '/threads',
  }
];
import { BlockWrapper } from '../../wrappers/block-wrapper.tsx';
import { Typography } from '@repo/ui/src/components/typography.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import Link from 'next/link';
import { Fragment } from 'react';

type NavigationLinkProps = {
  href: string,
  title: string
}

export const NAVIGATION_LINKS: NavigationLinkProps[] = [
  {
    title: 'Главная',
    href: '/',
  }, {
    title: 'Рейтинги',
    href: '/ratings',
  }, {
    title: 'Треды',
    href: '/threads',
  }, {
    title: 'Игроки',
    href: '/users',
  },
];

const NavigationLink = (link: NavigationLinkProps) => {
  return (
    <Link href={link.href}>
      <div className="px-12 py-2 h-full cursor-pointer">
        <Typography>{link.title}</Typography>
      </div>
    </Link>
  );
};

export const NavigationPanel = () => {
  return (
    <BlockWrapper
      padding="without"
      className="flex w-full items-center"
    >
      <div className="flex items-center justify-between max-w-1/3
        *:flex *:items-center hover:*:bg-white/10 transition-colors duration-200"
      >
        {NAVIGATION_LINKS.map((link, i) => (
          <Fragment key={link.href}>
            <NavigationLink
              href={link.href}
              title={link.title}
            />
            {NAVIGATION_LINKS.length - 2 >= i && <Separator orientation="vertical" />}
          </Fragment>
        ))}
      </div>
    </BlockWrapper>
  );
};
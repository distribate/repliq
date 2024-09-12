import { BlockWrapper } from '../../wrappers/block-wrapper.tsx';
import { Separator } from '@repo/ui/src/components/separator.tsx';
import { Fragment } from 'react';
import { NAVIGATION_LINKS } from '../constants/navigation-links.ts';
import { NavigationLink } from './navigation-link.tsx';

export const NavigationPanel = () => {
  return (
    <BlockWrapper
      padding="without"
      className="flex w-full items-center overflow-hidden"
    >
      <div className="flex items-center justify-between max-w-1/3
        *:flex *:items-center hover:*:bg-white/10 transition-colors duration-200"
      >
        {NAVIGATION_LINKS.map((link, i) => (
          <Fragment key={link.href}>
            <NavigationLink href={link.href} title={link.title} />
            {NAVIGATION_LINKS.length - 2 >= i && <Separator orientation="vertical" />}
          </Fragment>
        ))}
      </div>
    </BlockWrapper>
  );
};
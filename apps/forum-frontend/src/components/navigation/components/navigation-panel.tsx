import { BlockWrapper } from "#components/wrappers/components/block-wrapper.tsx";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import { Fragment } from "react";
import { NavigationLink } from "./navigation-link.tsx";

export type NavigationLinkProps = {
  href: string;
  title: string;
};

export const NAVIGATION_LINKS: NavigationLinkProps[] = [
  {
    title: "Главная",
    href: "/",
  },
  {
    title: "Рейтинги",
    href: "/ratings",
  },
  {
    title: "Территории",
    href: "/lands",
  },
  {
    title: "Треды",
    href: "/threads",
  },
];


export const NavigationPanel = () => {
  return (
    <BlockWrapper
      padding="without"
      className="flex w-full items-center overflow-hidden"
    >
      <div
        className="flex items-center justify-between max-w-1/3
        *:flex *:items-center hover:*:bg-secondary-color transition-colors duration-200"
      >
        {NAVIGATION_LINKS.map((link, i) => (
          <Fragment key={link.href}>
            <NavigationLink href={link.href} title={link.title} />
            {NAVIGATION_LINKS.length - 2 >= i && (
              <Separator orientation="vertical" />
            )}
          </Fragment>
        ))}
      </div>
    </BlockWrapper>
  );
};

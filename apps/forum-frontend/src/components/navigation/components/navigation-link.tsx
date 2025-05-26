import { Typography } from "@repo/ui/src/components/typography.tsx";
import { NavigationLinkProps } from "./navigation-panel";
import { CustomLink } from "#components/shared/link";

export const NavigationLink = (link: NavigationLinkProps) => {
  return (
    <CustomLink to={link.href}>
      <div className="px-12 py-2 h-full cursor-pointer">
        <Typography>{link.title}</Typography>
      </div>
    </CustomLink>
  );
};

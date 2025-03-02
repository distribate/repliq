import { Link } from "@tanstack/react-router";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { NavigationLinkProps } from "../constants/navigation-links.ts";

export const NavigationLink = (link: NavigationLinkProps) => {
  return (
    <Link to={link.href}>
      <div className="px-12 py-2 h-full cursor-pointer">
        <Typography>{link.title}</Typography>
      </div>
    </Link>
  );
};

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/ui/src/components/hover-card.tsx";
import { ReactNode } from "react";

interface HoverCardWrapperProps {
  trigger: ReactNode;
  content: ReactNode;
  properties?: Partial<{
    asChild: boolean;
    contentAlign: "end" | "start" | "center";
    contentAlignOffset: number;
    sideAlign: "top" | "right" | "bottom" | "left";
    contentClassname: string;
    delay: number;
  }>;
}

export const HoverCardWrapper = ({
  content, trigger, properties = { delay: 200 }
}: HoverCardWrapperProps) => {
  return (
    <HoverCard openDelay={properties?.delay} closeDelay={properties?.delay}>
      <HoverCardTrigger asChild={properties?.asChild}>
        {trigger}
      </HoverCardTrigger>
      <HoverCardContent
        side={properties?.sideAlign}
        align={properties?.contentAlign}
        className={properties?.contentClassname}
        alignOffset={properties?.contentAlignOffset}
      >
        {content}
      </HoverCardContent>
    </HoverCard>
  );
}
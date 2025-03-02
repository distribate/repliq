import { Camera } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { TooltipWrapper } from "#wrappers/tooltip-wrapper.tsx";

export const PostPhotoForm = () => {
  return (
    <TooltipWrapper
      trigger={<Camera size={24} className="text-shark-300" />}
      content={<Typography>Фотография</Typography>}
      properties={{ sideAlign: "top" }}
    />
  );
};

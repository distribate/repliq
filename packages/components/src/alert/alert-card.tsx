import { AlertEntity } from "@repo/types/entities/entities-type.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Link } from "@tanstack/react-router";
import { Separator } from "@repo/ui/src/components/separator.tsx";
import dayjs from "dayjs";
import { AlertClose } from "./alert-close";

export const AlertCard = ({
  title, id, creator, link, created_at,
}: AlertEntity) => {
  return (
    <div className="flex group border border-shark-800 flex-col w-full relative rounded-lg py-2 px-4 bg-primary-color">
      <Typography textColor="shark_white" textSize="medium">
        {title}
      </Typography>
      <div className="flex items-center gap-2">
        {link && (
          <>
            <Link to={link} target="_blank" rel="noopener noreferrer">
              <Typography textSize="small" className="text-pink-500">
                ссылка
              </Typography>
            </Link>
            <Separator orientation="vertical" />
          </>
        )}
        <Typography textSize="small" className="text-shark-300">
          {creator}
        </Typography>
        <Separator orientation="vertical" />
        <Typography textSize="small" className="text-shark-300">
          {dayjs(created_at).format(`DD.MM.YYYY HH:mm`)}
        </Typography>
      </div>
      <AlertClose />
    </div>
  );
};
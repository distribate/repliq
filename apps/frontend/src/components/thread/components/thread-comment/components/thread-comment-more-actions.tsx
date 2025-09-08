import { moreVariant } from "#ui/more-wrapper";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { MoreVertical, Pen, Trash } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@repo/ui/src/components/dropdown-menu.tsx";
import { editCommentActionsAtom, removeCommentAction } from "../models/comment-actions.model";
import { reatomComponent } from "@reatom/npm-react";

export const ThreadCommentMoreActions = reatomComponent<{ id: number }>(({
  ctx, id
}) => {
  return (
    <div className="absolute right-2 top-2">
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className={moreVariant({ size: "small" })}>
            <MoreVertical size={20} className="text-shark-300" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <div className="flex flex-col gap-y-2">
            <DropdownMenuItem
              className="items-center gap-2"
              onClick={() => editCommentActionsAtom(ctx, id, { isEdit: true })}
            >
              <Pen size={16} className="text-shark-300" />
              <Typography>Редактировать</Typography>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="items-center gap-2"
              onClick={() => removeCommentAction(ctx, id)}
            >
              <Trash size={16} className="text-shark-300" />
              <Typography>Удалить комментарий</Typography>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}, "ThreadCommentMoreActions")
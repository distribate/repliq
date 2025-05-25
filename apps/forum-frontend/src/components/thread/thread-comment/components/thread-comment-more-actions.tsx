import { MoreWrapper } from "#components/wrappers/components/more-wrapper";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { Pen, Trash } from "lucide-react";
import { DropdownMenuItem } from "@repo/ui/src/components/dropdown-menu.tsx";
import { editCommentActionsAtom } from "../models/comment-actions.model";
import { reatomComponent } from "@reatom/npm-react";

export const ThreadCommentMoreActions = reatomComponent<{ id: number }>(({ 
  ctx, id
}) => {
  return (
    <div className="absolute right-2 top-2">
      <MoreWrapper variant="small" background="transparent">
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
            // onClick={}
          >
            <Trash size={16} className="text-shark-300" />
            <Typography>Удалить комментарий</Typography>
          </DropdownMenuItem>
        </div>
      </MoreWrapper>
    </div>
  );
}, "ThreadCommentMoreActions")
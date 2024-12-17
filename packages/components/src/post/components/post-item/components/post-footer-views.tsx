import { Eye } from "lucide-react";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserPostItem } from '@repo/types/routes-types/get-user-posts-types.ts';

type PostFooterViewsProps = Pick<UserPostItem, "views_count">;

export const PostFooterViews = ({ views_count }: PostFooterViewsProps) => {
  return (
    <div className="flex items-center gap-1">
      <Eye size={18} className="text-shark-300" />
      <Typography textSize="small" textColor="gray">{views_count}</Typography>
    </div>
  );
};
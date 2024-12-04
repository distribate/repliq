import { Typography } from "@repo/ui/src/components/typography.tsx";
import { UserEntity } from "@repo/types/entities/entities-type.ts";

type UserRealNameProps = Pick<UserEntity, "real_name"> & {
  with_annotation?: boolean;
};

export const UserRealName = ({
  real_name,
  with_annotation = true,
}: UserRealNameProps) => {
  return (
    <Typography className="text-shark-300 font-[Minecraft]" textSize="medium">
      {with_annotation && "aka"} ({real_name})
    </Typography>
  );
};

import { Typography } from "@repo/ui/src/components/typography.tsx";

type UserRealNameProps = { real_name: string } & {
  with_annotation?: boolean;
};

export const UserRealName = ({
  real_name, with_annotation = true,
}: UserRealNameProps) => {
  return (
    <Typography className="text-shark-300" textSize="medium">
      {with_annotation && "aka"} ({real_name})
    </Typography>
  );
};

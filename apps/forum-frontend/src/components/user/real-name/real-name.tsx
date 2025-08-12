type UserRealNameProps = { real_name: string } & {
  with_annotation?: boolean;
};

export const UserRealName = ({
  real_name, with_annotation = true,
}: UserRealNameProps) => {
  return (
    <span className="text-shark-300 text-md">
      {with_annotation && "aka"} {real_name}
    </span>
  );
};

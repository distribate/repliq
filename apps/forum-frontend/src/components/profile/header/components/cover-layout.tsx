import { InView } from "react-intersection-observer";
import { useCover } from "#components/profile/header/hooks/use-cover.ts";
import { coverQuery } from "#components/profile/header/queries/cover-query.ts";
import { UserCover } from "./cover";
import { Suspense } from "react";
import { UserCoverSkeleton } from "#components/skeletons/user-cover-skeleton.tsx";
import { requestedUserQuery } from "@repo/lib/queries/requested-user-query";
import { Typography } from "@repo/ui/src/components/typography";

export type UserCoverLayoutProps = {
  nickname: string;
  children?: React.ReactNode;
};

const UserDescription = ({ nickname }: Omit<UserCoverLayoutProps, "children">) => {
  const { data } = requestedUserQuery(nickname)

  const description = data?.description

  if (!description) return null;

  return (
    <div className="flex lg:hidden bg-shark-950 p-2 rounded-md mt-4">
      <Typography
        textColor="shark_white"
        className="font-[Minecraft]"
        textSize="medium"
      >
        О себе: {description}
      </Typography>
    </div>
  )
}

export const UserCoverLayout = ({
  nickname, children
}: UserCoverLayoutProps) => {
  const { data: { inView } } = coverQuery();
  const { setCoverStateMutation } = useCover();

  return (
    <>
      <Suspense fallback={<UserCoverSkeleton />}>
        <InView
          as="div"
          className={inView ? `h-svh absolute left-0 top-0 right-0` : "h-[20px] absolute left-0 top-0 right-0"}
          onChange={(inView, _) =>
            setCoverStateMutation.mutate({ inView })
          }
        />
        <div className="w-full h-full relative">
          <UserCover nickname={nickname} />
          <UserDescription nickname={nickname} />
        </div>
      </Suspense>
      <div className="w-full h-full relative">
        {children}
      </div>
    </>
  );
};
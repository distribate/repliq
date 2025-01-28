import { InView } from "react-intersection-observer";
import { useCover } from "#profile/components/cover/hooks/use-cover.ts";
import { coverQuery } from "#profile/components/cover/queries/cover-query.ts";
import { UserCover } from "./cover";
import { Suspense } from "react";
import { UserCoverSkeleton } from "#skeletons/user-cover-skeleton.tsx";

export type UserCoverLayoutProps = {
  nickname: string;
  children?: React.ReactNode;
};

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
        </div>
      </Suspense>
      <div className="w-full h-full relative">
        {children}
      </div>
    </>
  );
};
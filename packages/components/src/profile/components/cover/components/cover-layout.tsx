import { InView } from "react-intersection-observer";
import { useCover } from "#profile/components/cover/hooks/use-cover.ts";
import { coverQuery } from "#profile/components/cover/queries/cover-query.ts";
import { UserCover } from "./cover";

export type UserCoverLayoutProps = {
  requestedUserNickname: string;
  children?: React.ReactNode;
};

export const UserCoverLayout = ({
  requestedUserNickname,
  children,
}: UserCoverLayoutProps) => {
  const { data: { inView } } = coverQuery();
  const { setCoverStateMutation } = useCover();

  return (
    <>
      <InView
        as="div"
        className={inView ? `h-svh absolute left-0 top-0 right-0` : "h-[20px] absolute left-0 top-0 right-0"}
        onChange={(inView, _) =>
          setCoverStateMutation.mutate({ inView })
        }
      />
      <div className="w-full h-full relative">
        <UserCover requestedUserNickname={requestedUserNickname} />
      </div>
      <div className="w-full h-full relative">
        {children}
      </div>
    </>
  );
};
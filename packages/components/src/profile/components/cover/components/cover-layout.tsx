"use client";

import { InView } from "react-intersection-observer";
import { useCover } from "#profile/components/cover/hooks/use-cover.ts";
import { coverQuery } from "#profile/components/cover/queries/cover-query.ts";
import { UserCover } from "./cover";

export type UserCoverLayoutProps = {
  requestedUserNickname: string;
};

export const UserCoverLayout = ({
  requestedUserNickname,
}: UserCoverLayoutProps) => {
  const { data: coverQueryState } = coverQuery();
  const { setCoverStateMutation } = useCover();
  const inView = coverQueryState?.inView;

  return (
    <>
      <InView
        as="div"
        className={`${inView ? "h-[612px] absolute left-0 top-0 right-0" : "h-[200px] absolute top-0"}`}
        onChange={(inView, entry) =>
          setCoverStateMutation.mutate({ inView, entry })
        }
      />
      <UserCover requestedUserNickname={requestedUserNickname}/>
    </>
  );
};
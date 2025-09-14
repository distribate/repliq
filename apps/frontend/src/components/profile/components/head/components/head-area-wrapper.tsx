import { reatomComponent } from "@reatom/npm-react";
import { requestedUserCoverDetailsAtom, requestedUserCoverImageAtom } from "#components/profile/models/requested-user.model.ts";
import { HeadArea } from "./head-area.tsx";
import { lazy, PropsWithChildren, Suspense } from "react";

const UserCoverWatermark = lazy(() => import("./head-image-placeholder.tsx").then(m => ({ default: m.HeadImagePlaceholder })))

export const HeadAreaWrapper = reatomComponent<PropsWithChildren>(({ ctx, children }) => {
  const coverDetails = ctx.spy(requestedUserCoverDetailsAtom)
  if (!coverDetails) return null;

  const coverImage = ctx.spy(requestedUserCoverImageAtom)

  const { backgroundColor, outline } = coverDetails;

  return (
    <HeadArea backgroundColor={backgroundColor} outline={outline}>
      {coverImage ? (
        <div className="flex justify-center items-center h-full absolute inset-0 z-[1]">
          <img src={coverImage} className="object-cover object-center w-full  h-[414px]" alt="" fetchPriority="high" />
        </div>
      ) : (
        <Suspense>
          <UserCoverWatermark />
        </Suspense>
      )}
      {children}
    </HeadArea>
  );
}, "HeadAreaWrapper")
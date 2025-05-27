import { reatomComponent } from "@reatom/npm-react"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { useState } from "react"
import { authImageResource } from "../models/auth-image.model"

export const AuthImage = reatomComponent(({ ctx }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const url = ctx.spy(authImageResource.dataAtom)

  if (ctx.spy(authImageResource.statusesAtom).isPending) {
    return <Skeleton className="absolute w-full h-screen" />
  }

  if (!url) return null;

  return (
    <img
      src={url}
      width={1920}
      height={1080}
      alt=""
      draggable={false}
      onLoad={() => setIsLoaded(true)}
      data-state={isLoaded}
      className="w-full h-screen absolute object-cover transition-opacity duration-700 
        data-[state=true]:opacity-100 data-[state=false]:opacity-0"
    />
  )
}, "AuthImage")
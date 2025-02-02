import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"

async function getStaticImage() {
  const res = await forumSharedClient.shared["get-auth-image"].$get({
    query: {
      random: "true"
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null
  }

  return data.data
}

export const AUTH_IMAGE_QUERY_KEY = createQueryKey("ui", ["auth-image"])

const authImageQuery = () => useQuery({
  queryKey: AUTH_IMAGE_QUERY_KEY,
  queryFn: () => getStaticImage(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false
})

export const AuthImage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: url } = authImageQuery()

  if (!url) return null;

  return (
    <img
      src={url}
      width={1920}
      height={1080}
      alt=""
      draggable={false}
      onLoad={() => setIsLoaded(true)}
      className={`w-full h-screen absolute object-cover transition-opacity duration-700 ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
    />
  )
}
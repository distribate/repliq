"use client"

import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"

async function getIntroBackgroundImage() {
  const res = await forumSharedClient.shared["get-static-image"].$get({
    query: {
      bucket: "user_images",
      fileName: "default/rain-weather.jpg"
    }
  })

  const data = await res.json()

  if ("error" in data) {
    return null;
  }

  return data.data;
}

const introBackgroundImageQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["intro-background-image"]),
  queryFn: () => getIntroBackgroundImage(),
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  refetchOnReconnect: false
})

export const IntroBackgroundImage = () => {
  const { data: url } = introBackgroundImageQuery()

  if (!url) return null

  return (
    <div
      className="w-full h-full absolute top-0 right-0 left-0 bg-no-repeat bg-center bg-cover"
      style={{ backgroundImage: `url(${url})` }}
    />
  )
}
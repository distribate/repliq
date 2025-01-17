"use client"

import { createQueryKey } from "@repo/lib/helpers/query-key-builder"
import { forumSharedClient } from "@repo/shared/api/forum-client"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"

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

const authImageQuery = () => useQuery({
  queryKey: createQueryKey("ui", ["auth-image"]),
  queryFn: () => getStaticImage()
})

export const AuthImage = () => {
  const { data: url } = authImageQuery()

  if (!url) return null;

  return (
    <Image src={url} width={1920} height={1080} alt="" className="w-full h-screen absolute object-cover"/>
  )
}
import { landsQuery } from "#lands/queries/lands-query.ts"
import { Skeleton } from "@repo/ui/src/components/skeleton"
import { LandCard } from "./land-card"

export const LandsList = () => {
  const { data, isLoading } = landsQuery()

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
        <Skeleton className="w-full h-16" />
      </>
    )
  }

  if (!data) return null

  const lands = data.data

  return (
    lands.map((land) => <LandCard key={land.ulid} {...land} />)
  )
}
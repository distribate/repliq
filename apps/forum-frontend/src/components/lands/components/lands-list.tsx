import { landsQuery } from "#components/lands/queries/lands-query.ts"
import { LandCard } from "./land-card"
import { SectionSkeleton } from "#components/templates/section-skeleton"

export const LandsList = () => {
  const { data, isLoading } = landsQuery()

  if (isLoading)  return <SectionSkeleton/>
  
  if (!data) return null

  const lands = data.data

  return (
    lands.map((land) => <LandCard key={land.ulid} {...land} />)
  )
}
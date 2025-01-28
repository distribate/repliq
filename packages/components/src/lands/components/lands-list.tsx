import { landsQuery } from "#lands/queries/lands-query.ts"
import { LandCard } from "./land-card"

export const LandsList = () => {
  const { data } = landsQuery()

  if (!data) return null

  const lands = data.data

  return (
    lands.map((land) => <LandCard key={land.ulid} {...land} />)
  )
}
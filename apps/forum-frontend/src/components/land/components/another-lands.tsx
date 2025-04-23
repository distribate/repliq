import { type AnotherLandsByOwner as AnotherLandsByOwnerType, anotherLandsByOwnerQuery } from "#components/land/queries/another-lands-query.ts"
import { BlockWrapper } from "#components/wrappers/components/block-wrapper"
import { LAND_URL } from "@repo/shared/constants/routes"
import { Typography } from "@repo/ui/src/components/typography"
import { Link } from "@tanstack/react-router"

export const AnotherLandsByOwner = ({
  nickname, exclude,
}: AnotherLandsByOwnerType) => {
  const { data } = anotherLandsByOwnerQuery({ exclude, nickname })

  if (!data) return null;

  return (
    <BlockWrapper className="flex flex-col items-center overflow-hidden justify-end !p-4 gap-4 w-full">
      <Typography className="text-[20px] font-semibold">
        Территории владельца этой территории:
      </Typography>
      {data && (
        data.map((land) => (
          <Link to={LAND_URL + land.ulid} className="flex bg-shark-900 rounded-lg p-2 w-full items-center">
            {land.name}
          </Link>
        ))
      )}
    </BlockWrapper>
  )
}
import { type AnotherLandsByOwner as AnotherLandsByOwnerType, anotherLandsByOwnerQuery } from "#components/land/queries/another-lands-query.ts"
import { BlockWrapper } from "#components/wrappers/block-wrapper.tsx"
import { Typography } from "@repo/ui/src/components/typography"

export const AnotherLandsByOwner = ({
  nickname, exclude,
}: AnotherLandsByOwnerType) => {
  const { data } = anotherLandsByOwnerQuery({ exclude, nickname })

  return (
    <BlockWrapper className="flex flex-col items-center overflow-hidden justify-end !p-4 gap-4 w-full">
      <Typography className="text-[20px] font-semibold">
        Территории владельца этой территории:
      </Typography>
      {data && (
        data.map((land) => (
          <div>
            {land.name}
          </div>
        ))
      )}
      {!data && (
        <Typography>Пусто.</Typography>
      )}
    </BlockWrapper>
  )
}
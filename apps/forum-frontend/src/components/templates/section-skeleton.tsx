import { WindowLoader } from "@repo/ui/src/components/window-loader"

export const SectionSkeleton = () => {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <WindowLoader />
    </div>
  )
}
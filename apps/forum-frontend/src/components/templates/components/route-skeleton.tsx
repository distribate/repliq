import { PageLoader } from "@repo/ui/src/components/page-loader"

export const RouteSkeleton = () => {
  return (
    <div className="flex h-dvh w-full items-center justify-center">
      <PageLoader />
    </div>
  )
}
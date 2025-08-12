import { Typography } from "@repo/ui/src/components/typography"

export default function Page() {
  return (
    <>
      <InDevelopmentTemplate />
    </>
  )
}

export const InDevelopmentTemplate = () => {
  return (
    <div className="flex flex-col gap-12 h-screen items-center justify-center w-full">
      <Typography textSize="big" className="font-bold">
        Страница пока недоступна... 
      </Typography>
    </div>
  )
}
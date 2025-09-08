import { ForumStats } from "#components/widgets/forum-stats/components/forum-stats";
import { Typography } from "@repo/ui/src/components/typography";

export default function Page() {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      <div className="flex flex-col gap-2 rounded-xl p-4 w-full h-fit bg-primary-color">
        <Typography className="page-title text-shark-50">
          О нас
        </Typography>
        <Typography className="text-xl font-semibold text-shark-200">
          Repliq — это платформа для общения в формате тредов.
          Создавай обсуждения, обменивайся мнениями и находи интересных собеседников на форуме нового поколения.
        </Typography>
        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <ForumStats />
        </div>
      </div>
    </div>
  )
}
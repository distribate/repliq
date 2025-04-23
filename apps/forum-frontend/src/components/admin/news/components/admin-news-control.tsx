import { CreateNews } from "./admin-create-news";
import { Typography } from "@repo/ui/src/components/typography";
import { NewsList } from "./admin-news-list";

export const AdminNewsControl = () => {
  return (
    <div className="flex flex-col gap-4 items-start justify-center w-full p-4 border-2 border-shark-800 rounded-lg">
      <NewsList />
      <Typography textSize="big" className="font-semibold">
        Публикация новости
      </Typography>
      <CreateNews />
    </div>
  )
}
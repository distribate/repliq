import { Calendar, Newspaper } from "lucide-react"
import { CustomLink } from "#shared/components/link"
import { PropsWithChildren } from "react";
import { usePageContext } from "vike-react/usePageContext";
import { Typography } from "@repo/ui/src/components/typography";

export default function LayoutNews({ children }: PropsWithChildren) {
  const pathname = usePageContext().urlPathname;

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Typography className="text-3xl font-bold">
        Новости и обновления
      </Typography>
      <div className="flex items-center gap-2">
        <CustomLink
          to="/news"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg duration-150 ${pathname === '/news'
            ? 'bg-green-500 text-shark-50'
            : 'bg-shark-700/50 text-shark-300 hover:bg-shark-800 hover:text-shark-50'
            }`}
        >
          <Newspaper className="w-5 h-5" />
          Новости
        </CustomLink>
        <CustomLink
          to="/changelog"
          className={`flex items-center gap-2 px-4 py-2 rounded-lg duration-150 ${pathname === '/changelog'
            ? 'bg-green-500 text-shark-50'
            : 'bg-shark-700/50 text-shark-300 hover:bg-shark-800 hover:text-shark-50'
            }`}
        >
          <Calendar className="w-5 h-5" />
          Обновления
        </CustomLink>
      </div>
      {children}
    </div>
  )
}
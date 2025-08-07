import { Calendar, Newspaper } from "lucide-react"
import { atom } from "@reatom/core"
import { CustomLink } from "#components/shared/link"
import { PropsWithChildren } from "react";
import { usePageContext } from "vike-react/usePageContext";

export const newsSelectedFilterAtom = atom<string>("all");

export default function LayoutNews({ children }: PropsWithChildren) {
  const pathname = usePageContext().urlPathname;

  return (
    <div className="flex flex-col gap-8 h-full w-full">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-shark-50 mb-4">Новости и обновления</h1>
        <p className="text-shark-300 text-lg max-w-2xl mx-auto">
          Будьте в курсе последних новостей событий форума
        </p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <CustomLink
          to="/news"
          className={`flex items-center gap-2 px-6 py-3 rounded-lg duration-200 ${pathname === '/news'
            ? 'bg-green-500 text-shark-50 shadow-lg shadow-green-500/25'
            : 'bg-shark-700/50 text-shark-300 hover:bg-shark-700 hover:text-shark-50'
            }`}
        >
          <Newspaper className="w-5 h-5" />
          Новости / Анонсы
        </CustomLink>
        <CustomLink
          to="/changelog"
          className={`flex items-center gap-2 px-6 py-3 rounded-lg duration-200 ${pathname === '/changelog'
            ? 'bg-green-500 text-shark-50 shadow-lg shadow-green-500/25'
            : 'bg-shark-700/50 text-shark-300 hover:bg-shark-700 hover:text-shark-50'
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
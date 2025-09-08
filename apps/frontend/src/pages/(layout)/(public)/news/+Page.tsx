import { reatomAsync, withCache, withStatusesAtom } from "@reatom/async";
import { atom, batch, onConnect } from "@reatom/framework";
import { reatomComponent } from "@reatom/npm-react";
import { Bug, Newspaper, Sparkles, Zap } from "lucide-react"
import { SectionSkeleton } from "#components/templates/components/section-skeleton";
import { IconClock } from "@tabler/icons-react";
import { ContentNotFound } from "#components/templates/components/content-not-found";
import { sharedClient } from "#shared/forum-client";
import dayjs from "@repo/shared/constants/dayjs-instance"
import { Typography } from "@repo/ui/src/components/typography";

type NewsPayload = Awaited<ReturnType<typeof newsAction>>;
type NewsItem = NewsPayload["data"][number]

const newsDataAtom = atom<NewsPayload["data"] | null>(null, "newsData")
const newsMetaAtom = atom<NewsPayload["meta"] | null>(null, "newsMeta")

const getTypeIcon = (type: NewsItem["type"]) => TYPE_ICON[type] ?? TYPE_ICON['default']
const getTypeColor = (type: NewsItem["type"]) => TYPE_COLORS[type] ?? TYPE_COLORS["default"]

const newsAction = reatomAsync(async (ctx) => {
  return await ctx.schedule(async () => {
    const res = await sharedClient.shared["updates"]["news"].$get({
      query: {
        cursor: undefined,
        ascending: "false",
        limit: "16",
      }
    }, {
      init: {
        signal: ctx.controller.signal
      }
    })

    const data = await res.json()

    if ("error" in data) throw new Error(data.error)

    return data
  })
}, {
  name: "newsAction",
  onFulfill: (ctx, res) => {
    if (!res) return;

    batch(ctx, () => {
      newsDataAtom(ctx, res.data)
      newsMetaAtom(ctx, res.meta)
    })
  },
  onReject: (_, e) => {
    if (e instanceof Error) {
      console.error(e.message)
    }
  }
}).pipe(withStatusesAtom(), withCache())

const TYPE_ICON: Record<NewsItem["type"], typeof Bug> = {
  'announcement': Newspaper,
  'feature': Sparkles,
  'update': Zap,
  'bugfix': Bug,
  'default': Newspaper
} as const;

const TYPE_COLORS: Record<NewsItem["type"], string> = {
  'announcement': 'text-green-400 bg-green-500/10',
  'feature': 'text-blue-400 bg-blue-500/10',
  'update': 'text-pink-400 bg-pink-500/10',
  'bugfix': 'text-red-400 bg-red-500/10',
  'default': 'text-shark-400 bg-shark-500/10'
} as const;

const NewsCard = ({ title, created_at, description, type, tags, id, imageUrl }: NewsItem) => {
  const TypeIcon = getTypeIcon(type);

  return (
    <div className="bg-shark-900/40 rounded-lg p-6 duration-150">
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-2 rounded-lg border ${getTypeColor(type)}`}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs capitalize ${getTypeColor(type)}`}>
              {type}
            </span>
          </div>
          <h3 className="text-xl font-bold text-shark-50 mb-2">
            {title}
          </h3>
          <p className="text-shark-300 leading-relaxed mb-4">
            {description}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-shark-800/40
                text-shark-300 rounded-md text-xs select-none">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-shark-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <IconClock className="w-4 h-4" />
                {dayjs(created_at).format("DD.MM.YYYY")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

onConnect(newsDataAtom, newsAction)

const NewsList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(newsDataAtom);
  const isEmpty = data && data.length === 0;

  if (ctx.spy(newsAction.statusesAtom).isPending) {
    return <SectionSkeleton />
  }

  if (!data || isEmpty) return <ContentNotFound title="Новостей еще нет" />

  return (
    <div className="flex flex-col gap-4 w-full h-fit">
      {data.map((news) => <NewsCard key={news.id} {...news} />)}
    </div>
  )
}, "News")

export default function Page() {
  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <Typography className="page-title">
        Новости и обновления
      </Typography>
      <NewsList />
    </div>
  )
}
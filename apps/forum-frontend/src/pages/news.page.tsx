import { Bug, Calendar, Clock, Filter, Heart, MessageCircle, Newspaper, Share2, Shield, Sparkles, Star, Zap } from "lucide-react"
import { atom } from "@reatom/core"
import { reatomComponent } from "@reatom/npm-react"
import { Outlet, useLocation } from "@tanstack/react-router"
import { CustomLink } from "#components/shared/link"

export const newsSelectedFilterAtom = atom<string>("all")

export const NewsLayoutRouteComponent = () => {
  return (
    <Layout />
  )
}

const Layout = () => {
  const pathname = useLocation().pathname

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
          to="/news/changelog"
          className={`flex items-center gap-2 px-6 py-3 rounded-lg duration-200 ${pathname === '/news/changelog'
            ? 'bg-green-500 text-shark-50 shadow-lg shadow-green-500/25'
            : 'bg-shark-700/50 text-shark-300 hover:bg-shark-700 hover:text-shark-50'
            }`}
        >
          <Calendar className="w-5 h-5" />
          Обновления
        </CustomLink>
      </div>
      <Outlet />
    </div>
  )
}

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Fasberry 0.1 Released - Enhanced User Experience',
    content: 'We\'re excited to announce the release of Forum 3.2.0! This major update brings significant improvements to user experience, including a redesigned interface, better mobile responsiveness, and enhanced performance. The new biloba flower theme adds a touch of elegance while maintaining excellent readability.',
    type: 'announcement',
    date: '2025-01-15T10:00:00Z',
    author: 'Admin Team',
    likes: 0,
    comments: 0,
    tags: ['release', 'ui', 'performance'],
    featured: true,
    version: '0.1'
  },
];

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'announcement': return Newspaper;
    case 'feature': return Sparkles;
    case 'update': return Zap;
    case 'bugfix': return Bug;
    case 'security': return Shield;
    default: return Newspaper;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'announcement': return 'text-green-400 bg-green-500/10 border-green-500/20';
    case 'feature': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'update': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
    case 'bugfix': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
    case 'security': return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: return 'text-green-400 bg-green-500/10 border-green-500/20';
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: 'announcement' | 'update' | 'feature' | 'bugfix' | 'security';
  date: string;
  author: string;
  likes: number;
  comments: number;
  tags: string[];
  featured: boolean;
  version?: string;
}

const NewsCard = ({ item }: { item: NewsItem }) => {
  const TypeIcon = getTypeIcon(item.type);

  return (
    <article className={`bg-shark-800/50 backdrop-blur-sm border border-shark-700/50 rounded-xl p-6 hover:bg-shark-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10 ${item.featured ? 'ring-2 ring-green-500/30' : ''}`}>
      {item.featured && (
        <div className="flex items-center gap-2 mb-4 text-green-400">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-sm font-medium">Featured</span>
        </div>
      )}
      <div className="flex items-start gap-4 mb-4">
        <div className={`p-2 rounded-lg border ${getTypeColor(item.type)}`}>
          <TypeIcon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize border ${getTypeColor(item.type)}`}>
              {item.type}
            </span>
            {item.version && (
              <span className="px-2 py-1 bg-shark-700/50 text-shark-300 rounded-full text-xs font-medium">
                v{item.version}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-shark-50 mb-2 hover:text-green-400 transition-colors cursor-pointer">
            {item.title}
          </h3>
          <p className="text-shark-300 leading-relaxed mb-4">{item.content}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-shark-700/30 text-shark-300 rounded text-xs hover:bg-shark-700/50 transition-colors cursor-pointer">
                #{tag}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between text-sm text-shark-300">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(item.date)}
              </span>
              <span>by {item.author}</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <Heart className="w-4 h-4" />
                {item.likes}
              </button>
              <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <MessageCircle className="w-4 h-4" />
                {item.comments}
              </button>
              <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export const NewsRouteComponent = () => {
  return (
    <News />
  )
}

const News = reatomComponent(({ ctx }) => {
  const selectedFilter = ctx.spy(newsSelectedFilterAtom)

  const filteredNews = selectedFilter === 'all'
    ? mockNews
    : mockNews.filter(item => item.type === selectedFilter);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 justify-center">
        <Filter className="w-5 h-5 text-shark-400" />
        <div className="flex gap-2">
          {['all', 'announcement', 'feature', 'update', 'bugfix', 'security'].map((filter) => (
            <button
              key={filter}
              onClick={() => newsSelectedFilterAtom(ctx, filter)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 capitalize ${selectedFilter === filter
                ? 'bg-green-500 text-shark-50 shadow-lg shadow-green-500/25'
                : 'bg-shark-700/50 text-shark-300 hover:bg-shark-700 hover:text-shark-50'
                }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-6">
        {filteredNews.map((item) => (
          <NewsCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}, "News")
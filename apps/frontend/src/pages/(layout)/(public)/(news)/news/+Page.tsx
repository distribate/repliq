import { atom } from "@reatom/core";
import { reatomComponent } from "@reatom/npm-react";
import { Bug, Clock, Filter, Heart, MessageCircle, Newspaper, Share2, Shield, Sparkles, Star, Zap } from "lucide-react"

const newsSelectedFilterAtom = atom<string>("all");

export default function NewsRouteComponent() {
  return <News />
}

const mockNews: NewsItem[] = [];

const TYPE_ICON: Record<string, typeof Bug> = {
  'announcement': Newspaper,
  'feature': Sparkles,
  'update': Zap,
  'bugfix': Bug,
  'security': Shield,
  'default': Newspaper
} as const;

const TYPE_COLORS: Record<string, string> = {
  'announcement': 'text-green-400 bg-green-500/10 border-green-500/20',
  'feature': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'update': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'bugfix': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'security': 'text-red-400 bg-red-500/10 border-red-500/20',
  'default': 'text-green-400 bg-green-500/10 border-green-500/20'
} as const;

const getTypeIcon = (type: string) => TYPE_ICON[type] ?? TYPE_ICON['default']
const getTypeColor = (type: string) => TYPE_COLORS[type] ?? TYPE_COLORS["default"]

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  return date.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
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
    <article
      className={`bg-shark-800/50 backdrop-blur-sm 
      border border-shark-700/50 rounded-xl 
      p-6 hover:bg-shark-800/70 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/10
     ${item.featured ? 'ring-2 ring-green-500/30' : ''}`}
    >
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
          <p className="text-shark-300 leading-relaxed mb-4">
            {item.content}
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, i) => (
              <span key={i} className="px-2 py-1 bg-shark-700/30 
                text-shark-300 rounded text-xs hover:bg-shark-700/50 transition-colors cursor-pointer">
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


const News = reatomComponent(({ ctx }) => {
  return (
    <div className="flex flex-col gap-6 w-full h-fit">
      {mockNews.map((item) => (
        <NewsCard key={item.id} item={item} />
      ))}
    </div>
  )
}, "News")
import { Tag, Zap, Shield, Bug, Plus } from 'lucide-react';

export default function ChangelogPage() {
  return (
    <div className="flex flex-col gap-6 h-full w-full">
      {mockChangelog.map((entry, idx) => <ChangelogCard key={idx} entry={entry} />)}
    </div>
  )
}

type ChangelogEntry = {
  version: string;
  date: string;
  changes: Array<{
    type: 'added' | 'changed' | 'fixed' | 'removed' | 'security';
    description: string;
  }>;
}

const mockChangelog: ChangelogEntry[] = [];

const TYPE_ICON: Record<string, typeof Plus | string> = {
  'added': Plus,
  'changed': Zap,
  'fixed': Bug,
  'removed': 'X',
  'security': Shield,
  'default': Plus
} as const

const TYPE_COLORS: Record<string, string> = {
  'added': 'text-green-400',
  'changed': 'text-blue-400',
  'fixed': 'text-orange-400',
  'removed': 'text-red-400',
  'security': 'text-purple-400',
  'default': "text-green-400"
} as const;

const getChangeTypeIcon = (type: string) => TYPE_ICON[type] ?? TYPE_ICON['default']
const getChangeTypeColor = (type: string) => TYPE_COLORS[type] ?? TYPE_COLORS['default']

const ChangelogCard = ({ entry }: { entry: ChangelogEntry }) => {
  return (
    <div
      className="flex flex-col gap-2 w-full bg-shark-800/50 
        backdrop-blur-sm border border-shark-700/50 rounded-xl p-6 hover:bg-shark-800/70 duration-300"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <Tag className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-shark-50">
            Версия {entry.version}
          </h3>
          <p className="text-shark-400 text-sm">{entry.date}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 h-full w-full">
        {entry.changes.map((change, idx) => {
          const ChangeIcon = getChangeTypeIcon(change.type);

          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-shark-700/30 rounded-lg">
              <div className={`p-1 rounded ${getChangeTypeColor(change.type)}`}>
                {typeof ChangeIcon === 'string' ? (
                  <span className="w-4 h-4 text-xs font-bold">×</span>
                ) : (
                  <ChangeIcon className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1">
                <span className={`text-xs font-medium uppercase tracking-wide ${getChangeTypeColor(change.type)}`}>
                  {change.type}
                </span>
                <p className="text-shark-300 text-sm mt-1">{change.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
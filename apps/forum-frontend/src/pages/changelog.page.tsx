import {
  Tag,
  Zap,
  Shield,
  Bug,
  Plus,
} from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: {
    type: 'added' | 'changed' | 'fixed' | 'removed' | 'security';
    description: string;
  }[];
}

const mockChangelog: ChangelogEntry[] = [
  {
    version: '3.2.0',
    date: '2025-03-15',
    changes: [
      { type: 'added', description: 'New biloba flower theme with green color scheme' },
      { type: 'added', description: 'Real-time notification system' },
      { type: 'added', description: 'Enhanced mobile responsiveness' },
      { type: 'changed', description: 'Redesigned user interface for better accessibility' }
    ]
  },
];

const getChangeTypeIcon = (type: string) => {
  switch (type) {
    case 'added': return Plus;
    case 'changed': return Zap;
    case 'fixed': return Bug;
    case 'removed': return 'X';
    case 'security': return Shield;
    default: return Plus;
  }
};

const getChangeTypeColor = (type: string) => {
  switch (type) {
    case 'added': return 'text-green-400';
    case 'changed': return 'text-blue-400';
    case 'fixed': return 'text-orange-400';
    case 'removed': return 'text-red-400';
    case 'security': return 'text-purple-400';
    default: return 'text-green-400';
  }
};

const ChangelogCard = ({ entry }: { entry: ChangelogEntry }) => {
  return (
    <div className="flex flex-col gap-2 w-full bg-shark-800/50 backdrop-blur-sm border border-shark-700/50 rounded-xl p-6 hover:bg-shark-800/70 duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-green-500/10 rounded-lg border border-green-500/20">
          <Tag className="w-5 h-5 text-green-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-shark-50">Version {entry.version}</h3>
          <p className="text-shark-400 text-sm">{entry.date}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3 h-full w-full">
        {entry.changes.map((change, i) => {
          const ChangeIcon = getChangeTypeIcon(change.type);
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-shark-700/30 rounded-lg">
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

export const ChangelogRouteComponent = () => {
  return (
    <div className="flex flex-col gap-6 h-full w-full">
      {mockChangelog.map((entry, i) => (
        <ChangelogCard key={i} entry={entry} />
      ))}
    </div>
  )
}
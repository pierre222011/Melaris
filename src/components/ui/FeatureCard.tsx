import { Feature } from '@/types';
import InfoTooltip from './InfoTooltip';
import { 
  ArrowUp,
  Video, Magnet, Hash, Lightbulb, FileText, Calendar, 
  FileQuestion, GraduationCap, Gamepad2, Sparkles, 
  Camera, BrainCircuit, MessageSquare, Database, 
  Code2, Map, Globe, Palette, Film, Smartphone
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Video, Magnet, Hash, Lightbulb, FileText, Calendar, 
  FileQuestion, GraduationCap, Gamepad2, Sparkles, 
  Camera, BrainCircuit, MessageSquare, Database, 
  Code2, Map, Globe, Palette, Film, Smartphone
};

export default function FeatureCard({ feature, onVote }: { feature: Feature, onVote?: () => void }) {
  const Icon = iconMap[feature.icon] || Sparkles;

  // Render different styles based on status
  const isLabs = feature.status === 'Labs';
  const isVision = feature.status === 'Vision';
  const isDev = feature.status === 'In Development';

  let borderGlow = 'border-white/10 hover:border-white/30';
  let badgeColor = 'bg-white/10 text-white';

  if (isLabs) {
    borderGlow = 'border-orange-500/30 hover:border-orange-500/70 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
    badgeColor = 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
  } else if (isVision) {
    borderGlow = 'border-purple-500/30 hover:border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-gradient-to-br from-purple-900/20 to-blue-900/20';
    badgeColor = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
  } else if (isDev) {
    borderGlow = 'border-blue-500/20 hover:border-blue-500/50';
    badgeColor = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
  } else {
    badgeColor = 'bg-green-500/20 text-green-400 border border-green-500/30';
  }

  return (
    <div className={`relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border transition-all duration-300 group ${borderGlow} flex flex-col h-full`}>
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-white/10">
          <Icon className={`w-6 h-6 ${isVision ? 'text-purple-400' : isLabs ? 'text-orange-400' : 'text-neon-blue'}`} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            {feature.status}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-syne font-bold text-lg text-white group-hover:text-neon-blue transition-colors">
            {feature.title}
          </h3>
          <InfoTooltip text={feature.tooltipText} />
        </div>
        <p className="text-sm text-gray-400 line-clamp-2 mb-4">
          {feature.description}
        </p>
      </div>

      {isDev && feature.progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span>Development Progress</span>
            <span>{feature.progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-neon-blue to-neon-purple rounded-full"
              style={{ width: `${feature.progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
        <span className="text-xs text-gray-500 font-medium">
          {feature.category}
        </span>
        <button 
          onClick={onVote}
          className="group/vote flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-neon-blue/10 text-gray-300 hover:text-neon-blue transition-colors border border-white/5 hover:border-neon-blue/30 text-sm font-medium relative overflow-hidden"
        >
          <ArrowUp className="w-4 h-4 group-hover/vote:-translate-y-0.5 transition-transform" />
          <span className="relative z-10">{feature.votes.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}

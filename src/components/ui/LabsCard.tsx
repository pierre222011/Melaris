import { Feature } from '@/types';
import InfoTooltip from './InfoTooltip';
import { 
  ArrowUp, Video, Magnet, Hash, Lightbulb, FileText, Calendar, 
  FileQuestion, GraduationCap, Gamepad2, Sparkles, Camera, BrainCircuit, 
  MessageSquare, Database, Code2, Map, Globe, Palette, Film, Smartphone,
  Image, Network, TrendingUp, LayoutDashboard, Utensils, Users, Clock,
  Target, Plane, List, Wallet, GitMerge, Folder, Smile, User, Music,
  ScrollText, Languages, Lock
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Video, Magnet, Hash, Lightbulb, FileText, Calendar, FileQuestion, GraduationCap, 
  Gamepad2, Sparkles, Camera, BrainCircuit, MessageSquare, Database, Code2, Map, 
  Globe, Palette, Film, Smartphone, Image, Network, TrendingUp, LayoutDashboard, 
  Utensils, Users, Clock, Target, Plane, List, Wallet, GitMerge, Folder, Smile, 
  User, Music, ScrollText, Languages
};

export default function LabsCard({ feature }: { feature: Feature }) {
  const Icon = iconMap[feature.icon] || Sparkles;
  const isVision = feature.status === 'Vision';

  // Base glitch/mysterious styles
  const glowColor = isVision ? 'rgba(168,85,247,0.15)' : 'rgba(249,115,22,0.15)';
  const borderGlow = isVision 
    ? 'border-purple-500/40 hover:border-purple-500/80 shadow-[0_0_20px_rgba(168,85,247,0.2)] bg-gradient-to-br from-[#1a0b2e]/80 to-[#050816]/90'
    : 'border-orange-500/40 hover:border-orange-500/80 shadow-[0_0_20px_rgba(249,115,22,0.2)] bg-gradient-to-br from-[#2a1205]/80 to-[#050816]/90';
  
  const badgeColor = isVision 
    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
    : 'bg-orange-500/20 text-orange-400 border border-orange-500/40';

  return (
    <div className={`relative p-5 rounded-2xl backdrop-blur-xl border transition-all duration-500 group overflow-hidden ${borderGlow} flex flex-col h-full`}>
      {/* Background static noise effect */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />
      
      {/* Hover scanner line */}
      <div className="absolute left-0 right-0 h-[2px] top-0 bg-white/20 opacity-0 group-hover:opacity-100 group-hover:animate-scan" />

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="p-2 rounded-lg bg-black/40 border border-white/5 backdrop-blur-md">
          <Icon className={`w-6 h-6 ${isVision ? 'text-purple-400' : 'text-orange-400'}`} />
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${badgeColor} animate-pulse`}>
            {isVision ? 'Concept' : 'Unstable'}
          </span>
        </div>
      </div>

      <div className="flex-1 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <h3 className={`font-syne font-bold text-lg transition-colors ${isVision ? 'text-purple-100 group-hover:text-purple-300' : 'text-orange-100 group-hover:text-orange-300'}`}>
            {feature.title}
          </h3>
          <InfoTooltip text={feature.tooltipText} />
        </div>
        <p className="text-sm text-gray-400 line-clamp-3 mb-6 relative">
          {feature.description}
          {/* Faded overlay at bottom of text to make it look "redacted" or incomplete */}
          <span className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-transparent to-transparent group-hover:from-transparent" />
        </p>
      </div>

      <div className="mt-auto pt-4 flex justify-between items-center relative z-10">
        <span className="text-xs text-gray-500 font-mono tracking-wider opacity-60">
          SEC::{feature.id.substring(0, 8).toUpperCase()}
        </span>
        <button className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
          isVision 
            ? 'bg-purple-500/10 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 hover:border-purple-500/60'
            : 'bg-orange-500/10 hover:bg-orange-500/30 text-orange-400 border border-orange-500/30 hover:border-orange-500/60'
        }`}>
          <Lock className="w-3.5 h-3.5" />
          Request Access
        </button>
      </div>
    </div>
  );
}

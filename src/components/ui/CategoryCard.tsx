import { Category } from '@/types';
import { 
  Gamepad2, Pickaxe, Box, GraduationCap, Briefcase, 
  MessageSquare, Video, Camera, BookOpen, TestTubes, Eye, PenTool
} from 'lucide-react';
import { Link } from '@/i18n/routing';

const categoryConfig: Record<string, { icon: any, desc: string, color: string, badge: string, path: string }> = {
  'Content Creation': { icon: PenTool, desc: 'Next-gen tools to create viral content.', color: 'text-neon-blue', badge: 'Available', path: '/app/c/content' },
  'Gaming': { icon: Gamepad2, desc: 'Elevate your gaming experience with AI.', color: 'text-blue-400', badge: 'In Development', path: '/app/c/gaming' },
  'Fortnite': { icon: Pickaxe, desc: 'Challenges, strat analysis and more.', color: 'text-blue-500', badge: 'In Development', path: '/app/c/fortnite' },
  'Roblox': { icon: Box, desc: 'Generate Luau code and worlds instantly.', color: 'text-purple-400', badge: 'Vision', path: '/app/c/roblox' },
  'Minecraft': { icon: Pickaxe, desc: 'AI-generated lore, quests and maps.', color: 'text-green-500', badge: 'Vision', path: '/app/c/minecraft' },
  'Education': { icon: GraduationCap, desc: 'Smart tutoring and document analysis.', color: 'text-emerald-400', badge: 'In Development', path: '/app/c/education' },
  'Productivity': { icon: Briefcase, desc: 'Automate your daily workflows.', color: 'text-blue-300', badge: 'Vision', path: '/app/c/productivity' },
  'Discord Tools': { icon: MessageSquare, desc: 'Community management powered by AI.', color: 'text-indigo-400', badge: 'Labs', path: '/app/c/discord' },
  'AI Video': { icon: Video, desc: 'Auto-editing and montage generation.', color: 'text-red-400', badge: 'Vision', path: '/app/c/video' },
  'Real Life Tools': { icon: Camera, desc: 'Scan the real world for instant answers.', color: 'text-orange-300', badge: 'Vision', path: '/app/c/real-life' },
  'Storytelling': { icon: BookOpen, desc: 'Branching narratives and worldbuilding.', color: 'text-amber-400', badge: 'Vision', path: '/app/c/storytelling' },
  'Labs': { icon: TestTubes, desc: 'Highly experimental, unstable features.', color: 'text-orange-500', badge: 'Labs', path: '/app/labs' },
  'Vision': { icon: Eye, desc: 'Concepts for the distant future of Melaris.', color: 'text-purple-500', badge: 'Vision', path: '/app/vision' },
};

export default function CategoryCard({ category }: { category: Category }) {
  const config = categoryConfig[category];
  if (!config) return null;
  const Icon = config.icon;

  let badgeColor = 'bg-white/10 text-white border-white/20';
  let borderGlow = 'border-white/10 hover:border-white/30';

  if (config.badge === 'Labs') {
    badgeColor = 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    borderGlow = 'border-orange-500/30 hover:border-orange-500/70 shadow-[0_0_15px_rgba(249,115,22,0.1)]';
  } else if (config.badge === 'Vision') {
    badgeColor = 'bg-purple-500/20 text-purple-300 border border-purple-500/30';
    borderGlow = 'border-purple-500/30 hover:border-purple-500/70 shadow-[0_0_15px_rgba(168,85,247,0.15)] bg-gradient-to-br from-purple-900/10 to-transparent';
  } else if (config.badge === 'In Development') {
    badgeColor = 'bg-blue-500/20 text-blue-300 border border-blue-500/30';
    borderGlow = 'border-blue-500/20 hover:border-blue-500/50';
  } else if (config.badge === 'Available') {
    badgeColor = 'bg-green-500/20 text-green-400 border border-green-500/30';
  }

  return (
    <Link href={config.path} className={`block relative p-6 rounded-3xl bg-white/5 backdrop-blur-md border transition-all duration-300 group ${borderGlow}`}>
      <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-20 transition-opacity">
        <Icon className={`w-32 h-32 ${config.color}`} />
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-12">
          <div className="p-3 rounded-xl bg-white/10">
            <Icon className={`w-8 h-8 ${config.color}`} />
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${badgeColor}`}>
            {config.badge}
          </span>
        </div>

        <div className="mt-auto">
          <h3 className="font-syne font-bold text-2xl text-white group-hover:text-white/80 transition-colors mb-2">
            {category}
          </h3>
          <p className="text-gray-400">
            {config.desc}
          </p>
        </div>
      </div>
    </Link>
  );
}

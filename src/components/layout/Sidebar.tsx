'use client';

import { Link, usePathname } from '@/i18n/routing';
import { 
  Home, Map, LayoutGrid, Gamepad2, Pickaxe, Box, 
  GraduationCap, Briefcase, MessageSquare, Video, 
  Camera, BookOpen, TestTubes, Eye 
} from 'lucide-react';

import GlobalSearch from '@/components/ui/GlobalSearch';

export const CATEGORIES = [
  { name: 'Dashboard', icon: Home, path: '/app', exact: true },
  { name: 'Roadmap', icon: Map, path: '/app/roadmap', exact: false },
  { name: 'All Categories', icon: LayoutGrid, path: '/app/categories', exact: false },
  { name: 'Gaming', icon: Gamepad2, path: '/app/c/gaming', exact: false },
  { name: 'Fortnite', icon: Pickaxe, path: '/app/c/fortnite', exact: false },
  { name: 'Roblox', icon: Box, path: '/app/c/roblox', exact: false },
  { name: 'Minecraft', icon: Pickaxe, path: '/app/c/minecraft', exact: false }, 
  { name: 'Education', icon: GraduationCap, path: '/app/c/education', exact: false },
  { name: 'Productivity', icon: Briefcase, path: '/app/c/productivity', exact: false },
  { name: 'Discord Tools', icon: MessageSquare, path: '/app/c/discord', exact: false },
  { name: 'AI Video', icon: Video, path: '/app/c/video', exact: false },
  { name: 'Real Life Tools', icon: Camera, path: '/app/c/real-life', exact: false },
  { name: 'Storytelling', icon: BookOpen, path: '/app/c/storytelling', exact: false },
  { name: 'Labs', icon: TestTubes, path: '/app/labs', exact: false },
  { name: 'Vision', icon: Eye, path: '/app/vision', exact: false },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen fixed left-0 top-0 border-r border-white/10 bg-[#050816]/80 backdrop-blur-2xl flex flex-col z-40">
      <div className="p-6 pb-2">
        <Link href="/" className="font-syne text-2xl font-bold neon-text inline-block mb-6">
          Melaris
        </Link>
        <GlobalSearch />
      </div>
      
      <nav className="flex-1 overflow-y-auto px-3 pb-4 space-y-1 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = cat.exact 
            ? pathname === cat.path 
            : pathname.startsWith(cat.path);
            
          const Icon = cat.icon;

          return (
            <Link
              key={cat.name}
              href={cat.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-neon-blue' : 'text-gray-500 group-hover:text-gray-300'} transition-colors`} />
              <span className="font-medium">{cat.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
          <p className="text-xs text-gray-400 mb-2">Platform Status</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm text-white font-medium">All systems operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

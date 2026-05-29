import { ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from '@/i18n/routing';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050816] flex items-center justify-center relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      {/* Background ambient effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-neon-blue/10 blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/10 blur-[100px] -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none -z-10" />

      <div className="w-full max-w-md relative z-10 flex flex-col items-center">
        {/* Logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 group">
          <Sparkles className="w-6 h-6 text-neon-blue group-hover:text-neon-purple transition-colors" />
          <span className="font-syne text-2xl font-bold tracking-tight text-white group-hover:neon-text transition-all">
            Melaris
          </span>
        </Link>
        
        {/* Form Container */}
        <div className="w-full relative">
          {/* Glowing border effect */}
          <div className="absolute -inset-[1px] bg-gradient-to-r from-neon-blue/50 via-purple-500/50 to-neon-purple/50 rounded-2xl blur-sm opacity-50" />
          
          <div className="relative bg-[#0a0f24]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

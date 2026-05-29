import { UserButton } from "@clerk/nextjs";
import { auth } from '@clerk/nextjs/server';
import {Link} from '@/i18n/routing';
import {getTranslations} from 'next-intl/server';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default async function Navbar() {
  const { userId } = await auth();
  const t = await getTranslations('Navigation');

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-[#050816]/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="font-syne text-2xl font-bold neon-text">
              Melaris
            </Link>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/features" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                {t('features')}
              </Link>
              <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                {t('pricing')}
              </Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors px-3 py-2 rounded-md text-sm font-medium">
                {t('about')}
              </Link>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            
            <div className="hidden md:flex items-center gap-3">
              {!userId ? (
                <Link href="/sign-in" className="px-4 py-1.5 rounded-full text-sm font-medium text-white hover:bg-white/10 border border-transparent hover:border-white/10 transition-all">
                  Log In
                </Link>
              ) : (
                <div className="flex items-center gap-3">
                  <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-full border border-white/20" } }} />
                </div>
              )}

              <Link href="/app" className="px-4 py-2 rounded-full text-sm font-medium text-white bg-gradient-to-r from-neon-blue to-neon-purple hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(79,142,247,0.3)] hover:shadow-[0_0_20px_rgba(79,142,247,0.5)]">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

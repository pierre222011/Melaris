import {getTranslations, setRequestLocale} from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Sparkles, TestTubes, Map } from 'lucide-react';

export default async function MarketingHomePage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  const t = await getTranslations('Marketing');

  return (
    <main className="flex flex-col items-center justify-center relative overflow-hidden pb-32">
      {/* Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#4F8EF7]/20 blur-[120px] -z-10" />
      <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#9333EA]/20 blur-[120px] -z-10" />
      
      {/* Hero Section */}
      <section className="w-full max-w-7xl px-4 pt-32 pb-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          <span className="text-sm font-medium text-gray-300">{t('badge')}</span>
        </div>
        
        <h1 className="font-syne text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500 max-w-4xl">
          {t('title')}
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/app" className="group flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#4F8EF7] to-[#9333EA] text-white font-medium hover:opacity-90 transition-opacity">
            {t('enter_dashboard')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/app/roadmap" className="px-8 py-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white font-medium hover:bg-white/10 transition-colors">
            {t('view_roadmap')}
          </Link>
        </div>
      </section>

      {/* Ecosystem Preview */}
      <section className="w-full max-w-7xl px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Categories Card */}
          <Link href="/app/categories" className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/30 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-32 h-32 text-neon-blue" />
            </div>
            <h3 className="font-syne text-2xl font-bold text-white mb-4">{t('card_categories_title')}</h3>
            <p className="text-gray-400 mb-8 relative z-10">
              {t('card_categories_desc')}
            </p>
            <span className="text-neon-blue font-medium flex items-center gap-2">
              {t('card_categories_link')} <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Labs Card */}
          <Link href="/app/labs" className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-orange-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <TestTubes className="w-32 h-32 text-orange-500" />
            </div>
            <h3 className="font-syne text-2xl font-bold text-white mb-4">{t('card_labs_title')}</h3>
            <p className="text-gray-400 mb-8 relative z-10">
              {t('card_labs_desc')}
            </p>
            <span className="text-orange-400 font-medium flex items-center gap-2">
              {t('card_labs_link')} <ArrowRight className="w-4 h-4" />
            </span>
          </Link>

          {/* Roadmap Card */}
          <Link href="/app/roadmap" className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-purple-500/50 transition-colors">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Map className="w-32 h-32 text-purple-500" />
            </div>
            <h3 className="font-syne text-2xl font-bold text-white mb-4">{t('card_roadmap_title')}</h3>
            <p className="text-gray-400 mb-8 relative z-10">
              {t('card_roadmap_desc')}
            </p>
            <span className="text-purple-400 font-medium flex items-center gap-2">
              {t('card_roadmap_link')} <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </div>
      </section>
    </main>
  );
}

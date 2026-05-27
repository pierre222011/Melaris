import { featuresData } from '@/data/features';
import FeatureCard from '@/components/ui/FeatureCard';
import { getTranslations, setRequestLocale } from 'next-intl/server';

export default async function AppDashboard({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Dashboard');

  // Group features by status for the main dashboard view
  const availableFeatures = featuresData.filter(f => f.status === 'Available');
  const devFeatures = featuresData.filter(f => f.status === 'In Development');
  const labsFeatures = featuresData.filter(f => f.status === 'Labs');
  const visionFeatures = featuresData.filter(f => f.status === 'Vision');

  return (
    <div className="p-8 pb-24">
      <header className="mb-12">
        <h1 className="font-syne text-4xl font-bold text-white mb-4">{t('title')}</h1>
        <p className="text-gray-400 max-w-2xl">
          {t('subtitle')}
        </p>
      </header>

      {/* Available Tools */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
          <h2 className="font-syne text-2xl font-bold text-white">{t('active_tools')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {availableFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      {/* In Development Roadmap */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h2 className="font-syne text-2xl font-bold text-white">{t('in_dev')}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {devFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      {/* Labs */}
      <section className="mb-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
          <h2 className="font-syne text-2xl font-bold text-white">{t('experimental')}</h2>
          <span className="px-2 py-1 rounded text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
            {t('unstable')}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {labsFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      {/* Vision */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]" />
          <h2 className="font-syne text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
            {t('future_vision')}
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visionFeatures.map(feature => (
            <FeatureCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>
    </div>
  );
}

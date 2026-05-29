import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeatures } from '@/app/actions/features';
import LabsCard from '@/components/ui/LabsCard';

export default async function LabsPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Dashboard'); 

  const allFeatures = await getFeatures();
  const labsFeatures = allFeatures.filter(f => f.status === 'Labs');
  const visionFeatures = allFeatures.filter(f => f.status === 'Vision');

  return (
    <div className="p-8 pb-32 min-h-screen relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#f97316]/5 blur-[150px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#a855f7]/5 blur-[150px] -z-10 pointer-events-none" />

      <header className="mb-16 border-b border-white/5 pb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.8)]" />
          <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Restricted Area</span>
        </div>
        <h1 className="font-syne text-5xl font-bold text-white mb-6 tracking-tight">Melaris Labs</h1>
        <p className="text-gray-400 max-w-2xl text-lg leading-relaxed">
          Welcome to the experimental division. The concepts here are highly unstable, currently in research, or part of our distant vision for the future. Access is strictly limited to early adopters.
        </p>
      </header>

      {/* Experimental Labs */}
      <section className="mb-20">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-orange-500/50" />
          <h2 className="font-syne text-3xl font-bold text-orange-50">Active Experiments</h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-orange-500/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {labsFeatures.map(feature => (
            <LabsCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>

      {/* Vision */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-purple-500/50" />
          <h2 className="font-syne text-3xl font-bold text-purple-50">Future Vision</h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-purple-500/10 to-transparent" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {visionFeatures.map(feature => (
            <LabsCard key={feature.id} feature={feature} />
          ))}
        </div>
      </section>
    </div>
  );
}

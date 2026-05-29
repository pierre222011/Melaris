import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getFeatures } from '@/app/actions/features';
import RoadmapBoard from '@/components/ui/RoadmapBoard';

export default async function RoadmapPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Dashboard'); // Reuse dashboard translations or create Roadmap namespace

  // Fetch from Supabase
  const featuresData = await getFeatures();

  return (
    <div className="p-8 pb-24">
      <header className="mb-12">
        <h1 className="font-syne text-4xl font-bold text-white mb-4">Public Roadmap</h1>
        <p className="text-gray-400 max-w-2xl">
          Vote on upcoming features, track development progress, and shape the future of Melaris.
          Your feedback directly influences what we build next.
        </p>
      </header>

      <RoadmapBoard initialFeatures={featuresData} />
    </div>
  );
}

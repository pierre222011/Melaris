import { getTranslations, setRequestLocale } from 'next-intl/server';
import CategoryCard from '@/components/ui/CategoryCard';
import { CATEGORIES } from '@/components/layout/Sidebar';
import { Category } from '@/types';

// Extract the primary categories to display (filtering out Dashboard, All Categories, Roadmap, Labs, Vision)
const mainCategories: Category[] = [
  'Content Creation', 'Gaming', 'Fortnite', 'Roblox', 'Minecraft', 
  'Education', 'Productivity', 'Discord Tools', 'AI Video', 
  'Real Life Tools', 'Storytelling'
];

export default async function CategoriesPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Dashboard'); // Reuse dashboard translations or create Categories namespace

  return (
    <div className="p-8 pb-24">
      <header className="mb-12">
        <h1 className="font-syne text-4xl font-bold text-white mb-4">Explore Categories</h1>
        <p className="text-gray-400 max-w-2xl">
          Browse all AI ecosystems inside Melaris. Find exactly what you need to elevate your game,
          create better content, or automate your life.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mainCategories.map(cat => (
          <CategoryCard key={cat} category={cat} />
        ))}
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, X, ArrowRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import { Feature } from '@/types';
import { CATEGORIES } from '@/components/layout/Sidebar';

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [allFeatures, setAllFeatures] = useState<Feature[]>([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  // Handle Cmd+K / Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Fetch features from API when modal opens
  useEffect(() => {
    if (isOpen && !loaded) {
      fetch('/api/features')
        .then(res => res.json())
        .then(data => {
          setAllFeatures(data);
          setLoaded(true);
        })
        .catch(err => console.error('Failed to load features for search', err));
    }
  }, [isOpen, loaded]);

  // Filter results
  const q = query.toLowerCase();
  const filteredFeatures = q 
    ? allFeatures.filter(f => f.title.toLowerCase().includes(q) || f.description.toLowerCase().includes(q))
    : [];
  
  const filteredCategories = q
    ? CATEGORIES.filter(c => c.name.toLowerCase().includes(q) && c.name !== 'Dashboard' && c.name !== 'All Categories')
    : [];

  const handleSelect = (path: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(path);
  };

  return (
    <>
      {/* Search Trigger Button for Sidebar */}
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-colors mb-6 group"
      >
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500 group-hover:text-gray-300" />
          <span>Search...</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </button>

      {/* Command Palette Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-2xl bg-[#0a0f24] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Search Input */}
              <div className="flex items-center px-4 py-4 border-b border-white/10">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input 
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search tools, categories, roadmap..."
                  className="flex-1 bg-transparent text-white placeholder-gray-500 outline-none font-syne text-lg"
                />
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-hide">
                {!query && (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    Type to search through the entire Melaris ecosystem...
                  </div>
                )}

                {query && filteredCategories.length === 0 && filteredFeatures.length === 0 && (
                  <div className="p-8 text-center text-gray-500 text-sm">
                    No results found for "{query}"
                  </div>
                )}

                {filteredCategories.length > 0 && (
                  <div className="mb-4">
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Categories
                    </div>
                    {filteredCategories.map(cat => {
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.name}
                          onClick={() => handleSelect(cat.path)}
                          className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-white/5 text-left group transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-white/5 text-gray-400 group-hover:text-neon-blue transition-colors">
                              <Icon className="w-5 h-5" />
                            </div>
                            <span className="text-gray-300 group-hover:text-white font-medium">{cat.name}</span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-transparent group-hover:text-white/50 transition-colors" />
                        </button>
                      )
                    })}
                  </div>
                )}

                {filteredFeatures.length > 0 && (
                  <div>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      AI Tools & Features
                    </div>
                    {filteredFeatures.map(feature => {
                      const transKey = feature.title.toLowerCase().replace(/[^a-z0-9]/g, '_');
                      let tTitle = feature.title;
                      let tDesc = feature.description;
                      try {
                        tTitle = t(`${transKey}.title`);
                        tDesc = t(`${transKey}.description`);
                      } catch (e) {}

                      return (
                        <button
                          key={feature.id}
                          onClick={() => handleSelect(feature.status === 'Vision' || feature.status === 'Labs' ? '/app/labs' : '/app')}
                          className="w-full flex flex-col px-3 py-3 rounded-xl hover:bg-white/5 text-left group transition-colors mb-1"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-gray-300 group-hover:text-white font-medium">{tTitle}</span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              feature.status === 'Available' ? 'border-green-500/30 text-green-400 bg-green-500/10' :
                              feature.status === 'Labs' ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' :
                              feature.status === 'Vision' ? 'border-purple-500/30 text-purple-400 bg-purple-500/10' :
                              'border-blue-500/30 text-blue-400 bg-blue-500/10'
                            }`}>
                              {feature.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1">{tDesc}</p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

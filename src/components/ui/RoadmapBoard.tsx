'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Feature } from '@/types';
import FeatureCard from './FeatureCard';
import { voteForFeature } from '@/app/actions/features';

export default function RoadmapBoard({ initialFeatures }: { initialFeatures: Feature[] }) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [sortBy, setSortBy] = useState<'votes' | 'progress'>('votes');
  const [filterStatus, setFilterStatus] = useState<string>('All');

  const handleVote = async (id: string) => {
    // Check if already voted to prevent unnecessary network requests
    const feature = features.find(f => f.id === id);
    if (feature?.user_has_voted) return;

    // Optimistic UI update
    setFeatures(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, votes: f.votes + 1, user_has_voted: true };
      }
      return f;
    }));

    try {
      await voteForFeature(id);
    } catch (error: any) {
      // Revert optimistic update on failure
      setFeatures(prev => prev.map(f => {
        if (f.id === id) {
          return { ...f, votes: f.votes - 1, user_has_voted: false };
        }
        return f;
      }));
      // Alert the user (simple fallback, ideally use a toast component)
      alert(error.message);
    }
  };

  const filteredFeatures = features.filter(f => {
    if (filterStatus === 'All') return true;
    return f.status === filterStatus;
  });

  const sortedFeatures = [...filteredFeatures].sort((a, b) => {
    if (sortBy === 'votes') {
      return b.votes - a.votes;
    } else {
      return (b.progress || 0) - (a.progress || 0);
    }
  });

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex gap-2">
          {['All', 'In Development', 'Labs', 'Vision'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                filterStatus === status 
                  ? 'bg-white/20 text-white border border-white/30' 
                  : 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="flex gap-2 bg-white/5 p-1 rounded-full border border-white/10">
          <button
            onClick={() => setSortBy('votes')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'votes' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Trending
          </button>
          <button
            onClick={() => setSortBy('progress')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              sortBy === 'progress' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            Progress
          </button>
        </div>
      </div>

      <motion.div 
        layout 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {sortedFeatures.map(feature => (
            <motion.div
              key={feature.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {/* Wrapping FeatureCard to pass down a custom onVote prop */}
              <FeatureCard feature={feature} onVote={() => handleVote(feature.id)} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

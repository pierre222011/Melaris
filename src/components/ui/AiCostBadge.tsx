'use client';

import { Coins } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function AiCostBadge({ cost }: { cost: number }) {
  const t = useTranslations('Features');

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 border border-yellow-500/20 rounded-full w-fit">
      <Coins className="w-4 h-4 text-yellow-500" />
      <span className="text-xs font-semibold text-yellow-400">
        {cost} {cost > 1 ? 'Melacoins' : 'Melacoin'}
      </span>
    </div>
  );
}

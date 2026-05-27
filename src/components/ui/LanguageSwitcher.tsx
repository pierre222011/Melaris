'use client';

import {useTransition} from 'react';
import {useRouter, usePathname, routing} from '@/i18n/routing';
import {useLocale} from 'next-intl';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const pathname = usePathname();
  const locale = useLocale();

  function onSelectChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as any;
    startTransition(() => {
      router.replace(pathname, {locale: nextLocale});
    });
  }

  return (
    <div className="relative flex items-center">
      <Globe className="absolute left-2 w-4 h-4 text-gray-400" />
      <select
        className="pl-8 pr-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm text-white appearance-none cursor-pointer hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-neon-blue disabled:opacity-50"
        defaultValue={locale}
        disabled={isPending}
        onChange={onSelectChange}
      >
        <option value="en" className="bg-navy">English</option>
        <option value="fr" className="bg-navy">Français</option>
        <option value="es" className="bg-navy">Español</option>
        <option value="de" className="bg-navy">Deutsch</option>
        <option value="zh" className="bg-navy">中文</option>
      </select>
    </div>
  );
}

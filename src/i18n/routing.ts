import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const locales = ['en', 'fr', 'es', 'de', 'zh'] as const;
export const defaultLocale = 'en' as const;

export const routing = defineRouting({
  locales,
  defaultLocale
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);

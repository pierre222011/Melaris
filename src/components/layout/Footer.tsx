import {Link} from '@/i18n/routing';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050816]/50 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="font-syne text-2xl font-bold neon-text mb-2">
            Melaris
          </Link>
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Melaris. All rights reserved.
          </p>
        </div>
        
        <div className="flex gap-6">
          <Link href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">
            About
          </Link>
          <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}

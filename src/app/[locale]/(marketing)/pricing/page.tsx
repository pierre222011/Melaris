import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Check, Sparkles, Zap, Star } from 'lucide-react';
import { Link } from '@/i18n/routing';

export const dynamic = 'force-dynamic';

export default async function PricingPage({params}: {params: Promise<{locale: string}>}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('Pricing');

  const plans = [
    {
      name: 'Free',
      description: t('Free_desc'),
      price: '$0',
      icon: Star,
      features: [
        t('Free_feat_1'),
        t('Free_feat_2'),
      ],
      cta: t('Free_cta'),
      link: '/sign-up',
      popular: false,
      tier: 'free',
    },
    {
      name: 'Premium',
      description: t('Premium_desc'),
      price: '$9',
      period: '/mo',
      icon: Zap,
      features: [
        t('Premium_feat_1'),
        t('Premium_feat_2'),
        t('Premium_feat_3'),
      ],
      cta: t('Premium_cta'),
      link: '/api/stripe/checkout?tier=premium',
      popular: true,
      tier: 'premium',
    },
    {
      name: 'Supporter',
      description: t('Supporter_desc'),
      price: '$29',
      period: '/mo',
      icon: Sparkles,
      features: [
        t('Supporter_feat_1'),
        t('Supporter_feat_2'),
        t('Supporter_feat_3'),
      ],
      cta: t('Supporter_cta'),
      link: '/api/stripe/checkout?tier=supporter',
      popular: false,
      tier: 'supporter',
    }
  ];

  return (
    <div className="min-h-screen bg-[#050816] pt-32 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-neon-blue/10 blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '4s' }} />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] rounded-full bg-neon-purple/10 blur-[120px] -z-10 animate-pulse" style={{ animationDuration: '6s' }} />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="font-syne text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            {t('Title')}
          </h1>
          <p className="text-xl text-gray-400 font-inter">
            {t('Subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => {
            const Icon = plan.icon;
            return (
              <div 
                key={plan.name}
                className={`relative group rounded-3xl p-8 backdrop-blur-xl border transition-all duration-300 flex flex-col ${
                  plan.popular 
                    ? 'bg-white/10 border-neon-blue/50 shadow-[0_0_40px_rgba(79,142,247,0.15)] transform md:-translate-y-4' 
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="bg-gradient-to-r from-neon-blue to-neon-purple text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full shadow-[0_0_15px_rgba(79,142,247,0.5)]">
                      {t('Most Popular')}
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                    plan.popular ? 'bg-gradient-to-br from-neon-blue to-neon-purple text-white' : 'bg-white/10 text-gray-300'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-syne font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-gray-400 mb-6">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    {plan.period && <span className="text-gray-400 font-medium">{plan.period}</span>}
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <div key={j} className="flex items-start gap-3">
                      <div className={`mt-0.5 p-0.5 rounded-full ${plan.popular ? 'bg-neon-blue/20 text-neon-blue' : 'bg-white/10 text-gray-400'}`}>
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Link 
                  href={plan.link}
                  className={`w-full py-3 px-6 rounded-xl text-center font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_20px_rgba(79,142,247,0.3)] hover:shadow-[0_0_30px_rgba(79,142,247,0.5)]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

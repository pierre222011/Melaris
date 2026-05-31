import { createAdminClient } from './supabase/admin';
import { SUBSCRIPTION_PLANS } from '@/config/economy';
import { currentUser } from '@clerk/nextjs/server';

export async function isAdmin() {
  const user = await currentUser();
  if (!user) return false;
  
  const email = user.emailAddresses[0]?.emailAddress;
  return email === 'pierreberanger83@gmail.com';
}

// Simple in-memory rate limiting (Works per-instance. For multi-region Vercel, consider Redis/Vercel KV)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(userId: string, tier: string) {
  const limits: Record<string, number> = {
    free: 5,
    pro: 25,
    premium: 60,
    supporter: 60,
  };

  const maxRequests = limits[tier] || limits.free;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute

  const userRecord = rateLimits.get(userId);

  if (!userRecord || now > userRecord.resetAt) {
    rateLimits.set(userId, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (userRecord.count >= maxRequests) {
    throw new Error(`Rate limit exceeded. You are allowed ${maxRequests} requests per minute on the ${tier} plan.`);
  }

  userRecord.count += 1;
  return true;
}

export async function grantFreeTierIfEligible(userId: string) {
  const supabase = createAdminClient();
  const currentMonth = new Date().toISOString().slice(0, 7); // Format: YYYY-MM

  // Try to insert a grant record for this month.
  // Because of the UNIQUE constraint on (user_id, month), this will safely fail if already granted.
  const { data, error } = await supabase
    .from('monthly_grants')
    .insert({
      user_id: userId,
      month: currentMonth,
      coins_granted: SUBSCRIPTION_PLANS.free.coinsPerMonth
    })
    .select()
    .single();

  // If insertion succeeds without error, we know this is the first time this month
  if (data && !error) {
    // Add the coins safely
    await supabase.rpc('add_melacoins', {
      user_id_param: userId,
      amount_param: SUBSCRIPTION_PLANS.free.coinsPerMonth,
      type_param: 'grant',
      description_param: `Monthly free tier grant for ${currentMonth}`
    });
    console.log(`Granted ${SUBSCRIPTION_PLANS.free.coinsPerMonth} free Melacoins to ${userId} for month ${currentMonth}`);
  }
}

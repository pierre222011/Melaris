'use server';

import { createAdminClient } from '@/utils/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { checkRateLimit, grantFreeTierIfEligible } from '@/utils/security';

export async function consumeAiAction(cost: number, actionName: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error('Unauthorized');
  }

  const supabase = createAdminClient();

  // 1. Get user details
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('subscription_tier')
    .eq('id', userId)
    .single();

  if (userError || !user) {
    throw new Error('User not found in DB');
  }

  // 2. Rate Limiting
  await checkRateLimit(userId, user.subscription_tier);

  // 3. Free tier monthly grant
  await grantFreeTierIfEligible(userId);

  // 4. Secure atomic deduction
  const { data: success, error } = await supabase.rpc('deduct_melacoins', {
    user_id_param: userId,
    amount_param: cost,
    type_param: 'ai_usage',
    description_param: `Used AI Action: ${actionName}`
  });

  if (error || !success) {
    throw new Error('Insufficient Melacoins balance');
  }

  return true;
}

// Example usage function (mock AI response)
export async function generateTextWithAi(prompt: string) {
  // Example cost from our economy config: 2 for simple chat
  await consumeAiAction(2, 'CHAT_SIMPLE');

  // Proceed with actual AI call...
  // const response = await openai.chat.completions.create({...})

  return { success: true, text: `AI response to: ${prompt}` };
}

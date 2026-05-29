'use server'

import { createAdminClient } from '@/utils/supabase/admin';
import { auth } from '@clerk/nextjs/server';
import { Feature, Category } from '@/types';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Helper to get userId including dev bypass
async function getEffectiveUserId() {
  let { userId } = await auth();
  
  if (process.env.NODE_ENV === 'development' && !userId) {
    const cookieStore = await cookies();
    if (cookieStore.get('melaris_dev_admin')?.value === 'true') {
      userId = 'dev_admin_bypass';
    }
  }
  return userId;
}

// Fetch all features from Supabase
export async function getFeatures(): Promise<Feature[]> {
  const supabase = createAdminClient();
  const userId = await getEffectiveUserId();

  // Fetch features with their category name
  const { data: featuresData, error: featuresError } = await supabase
    .from('features')
    .select(`
      id,
      title,
      description,
      tooltip_text,
      icon,
      status,
      progress,
      vote_count,
      categories ( name )
    `);

  if (featuresError) {
    console.error('Error fetching features:', featuresError);
    return [];
  }

  // If user is logged in, fetch their votes
  let userVotes = new Set<string>();
  if (userId) {
    const { data: votesData, error: votesError } = await supabase
      .from('votes')
      .select('feature_id')
      .eq('user_id', userId);

    if (!votesError && votesData) {
      votesData.forEach(v => userVotes.add(v.feature_id));
    }
  }

  // Map to frontend Feature type
  return featuresData.map((f: any) => ({
    id: f.id,
    title: f.title,
    description: f.description,
    tooltipText: f.tooltip_text || '',
    icon: f.icon,
    status: f.status,
    progress: f.progress,
    votes: f.vote_count,
    category: f.categories?.name as Category,
    user_has_voted: userVotes.has(f.id)
  }));
}

// Vote for a feature
export async function voteForFeature(featureId: string) {
  const userId = await getEffectiveUserId();
  
  if (!userId) {
    throw new Error('You must be logged in to vote');
  }

  const supabase = createAdminClient();

  // Ensure user exists in our DB to satisfy foreign key constraints
  // Since we use Clerk, users might vote before they exist in the Supabase 'users' table.
  // We can upsert the user here safely.
  await supabase.from('users').upsert({ id: userId, email: `user_${userId}@clerk.local` }, { onConflict: 'id', ignoreDuplicates: true });

  // Check if already voted
  const { data: existingVote } = await supabase
    .from('votes')
    .select('id')
    .eq('user_id', userId)
    .eq('feature_id', featureId)
    .single();

  if (existingVote) {
    throw new Error('You have already voted for this feature');
  }

  // Insert vote
  const { error: voteError } = await supabase
    .from('votes')
    .insert({ user_id: userId, feature_id: featureId });

  if (voteError) {
    console.error('Vote error:', voteError);
    throw new Error('Failed to register vote');
  }

  // Increment vote count on feature
  // We can do this by calling a Postgres RPC or just selecting and updating.
  // The simplest way without RPC is just fetch current and increment, though RPC is better for concurrency.
  // Let's do a simple update for now.
  const { data: currentFeature } = await supabase
    .from('features')
    .select('vote_count')
    .eq('id', featureId)
    .single();

  if (currentFeature) {
    await supabase
      .from('features')
      .update({ vote_count: currentFeature.vote_count + 1 })
      .eq('id', featureId);
  }

  revalidatePath('/[locale]/app/roadmap', 'page');
  return { success: true };
}

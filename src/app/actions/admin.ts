'use server';

import { cookies } from 'next/headers';
import { createAdminClient } from '@/utils/supabase/admin';
import { revalidatePath } from 'next/cache';

export async function grantAdminPrivileges() {
  // 1. Strict security check: only in development
  if (process.env.NODE_ENV !== 'development') {
    return { success: false, error: 'Not available in this environment' };
  }

  try {
    const supabase = createAdminClient();
    const fakeId = 'dev_admin_bypass';

    // 2. Ensure fake dev user exists in Supabase
    const { error } = await supabase
      .from('users')
      .upsert(
        { 
          id: fakeId, 
          email: 'admin@dev.local',
          role: 'admin' 
        },
        { onConflict: 'id' }
      );

    if (error) {
      console.error('Error granting admin privileges:', error);
      return { success: false, error: error.message };
    }

    // 3. Set a cookie to identify the dev admin session
    const cookieStore = await cookies();
    cookieStore.set('melaris_dev_admin', 'true', { 
      maxAge: 60 * 60 * 24, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('Admin backdoor error:', error);
    return { success: false, error: error.message };
  }
}

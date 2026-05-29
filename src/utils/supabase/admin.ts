// Dev-only workaround for self-signed/intermediate certificate issues on local networks.
// Remove this when deploying to production.
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

import { createClient } from '@supabase/supabase-js'

// This client uses the SERVICE ROLE KEY, which bypasses Row Level Security (RLS).
// NEVER expose this client or the service role key to the frontend.
// Only use this in Next.js Server Actions or API Routes where it is completely hidden from the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}

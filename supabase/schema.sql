-- Supabase Schema for Melaris
-- We use Clerk for Authentication, so the users table uses a TEXT id that matches clerk_user_id.

-- 1. Users Table (Synchronized with Clerk)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk User ID (e.g. user_2...)
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'elite')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 3. Features Table (Roadmap Items)
CREATE TABLE IF NOT EXISTS public.features (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tooltip_text TEXT,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  icon TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Available', 'In Development', 'Labs', 'Vision')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  vote_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Votes Table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  feature_id UUID NOT NULL REFERENCES public.features(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, feature_id) -- A user can only vote once per feature
);

-- Note: Since we don't use Supabase Auth, Row Level Security (RLS) is optional 
-- but recommended if you want to expose the DB directly to the client. 
-- Since we are doing Server Actions, we can use the Service Role Key or bypass RLS securely on the server.
-- However, enabling RLS and writing policies using Clerk's JWT is also an option if needed later.

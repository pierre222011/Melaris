-- Supabase Schema for Melaris
-- We use Clerk for Authentication, so the users table uses a TEXT id that matches clerk_user_id.

-- 1. Users Table (Synchronized with Clerk)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY, -- Clerk User ID (e.g. user_2...)
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'premium', 'supporter')),
  melacoins_balance INTEGER DEFAULT 0 CHECK (melacoins_balance >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 1.5 Economy & Security Tables
CREATE TABLE IF NOT EXISTS public.monthly_grants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- Format YYYY-MM
  coins_granted INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, month) -- Empêcher le double crédit
);

CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positif ou Négatif
  type TEXT NOT NULL, -- ai_usage, purchase, subscription, grant
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id TEXT PRIMARY KEY,
  processed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RPC Function for atomic deduction
CREATE OR REPLACE FUNCTION deduct_melacoins(user_id_param TEXT, amount_param INTEGER, type_param TEXT, description_param TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  current_balance INTEGER;
BEGIN
  -- Lock the row for update to prevent race conditions
  SELECT melacoins_balance INTO current_balance
  FROM public.users
  WHERE id = user_id_param
  FOR UPDATE;

  IF current_balance IS NULL THEN
    RETURN FALSE; -- User not found
  END IF;

  IF current_balance < amount_param THEN
    RETURN FALSE; -- Insufficient funds
  END IF;

  -- Deduct balance
  UPDATE public.users
  SET melacoins_balance = melacoins_balance - amount_param
  WHERE id = user_id_param;

  -- Log transaction
  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (user_id_param, -amount_param, type_param, description_param);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC Function for atomic addition
CREATE OR REPLACE FUNCTION add_melacoins(user_id_param TEXT, amount_param INTEGER, type_param TEXT, description_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Add balance
  UPDATE public.users
  SET melacoins_balance = melacoins_balance + amount_param
  WHERE id = user_id_param;

  -- Log transaction
  INSERT INTO public.transactions (user_id, amount, type, description)
  VALUES (user_id_param, amount_param, type_param, description_param);

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

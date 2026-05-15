import { createClient, type SupabaseClient } from '@supabase/supabase-js';

function need(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export function anonClient(): SupabaseClient {
  return createClient(
    need('NEXT_PUBLIC_SUPABASE_URL'),
    need('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    { auth: { persistSession: false } },
  );
}

export function serviceClient(): SupabaseClient {
  return createClient(
    need('NEXT_PUBLIC_SUPABASE_URL'),
    need('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  );
}

/** Supabase 凭据是否齐全；不齐全时连通类测试应整块 skip */
export const hasSupabaseCreds = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
);

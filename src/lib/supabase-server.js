import { createClient } from '@supabase/supabase-js';

function need(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var ${name}`);
  }
  return value;
}

export function createServerClient() {
  return createClient(
    need('NEXT_PUBLIC_SUPABASE_URL'),
    need('SUPABASE_SERVICE_ROLE_KEY'),
    { auth: { persistSession: false } },
  );
}

export function toolsTable() {
  return createServerClient().from('tools');
}

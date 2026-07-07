import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string
);

/** Signs the user out of Supabase (invalidates the server-side session) */
export async function logout(): Promise<void> {
  await supabase.auth.signOut();
}

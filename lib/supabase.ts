import { createClient } from "@supabase/supabase-js";

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Public client — für lesende Zugriffe (Homepage)
export const supabase = createClient(URL, ANON);

// Admin client — für schreibende Zugriffe (Admin-Panel), nur server-side
export const supabaseAdmin = createClient(URL, SERVICE, {
  auth: { autoRefreshToken: false, persistSession: false },
});

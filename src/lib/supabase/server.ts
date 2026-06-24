import { createClient as createSb } from '@supabase/supabase-js'

export async function createClient() {
  return createSb(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,   // 伺服器端專用
    { auth: { persistSession: false } },
  )
}

import { createAdminClient } from '@/lib/supabase/server'

/**
 * Ensures the authenticated user has an ar_settings record.
 * Called on first dashboard access to support cross-SaaS login.
 */
export async function ensureUserProfile(userId: string) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('ar_settings')
    .select('user_id')
    .eq('user_id', userId)
    .single()

  if (existing) return

  await supabase.from('ar_settings').upsert(
    {
      user_id: userId,
      plan: 'free',
      calls_limit: 50,
      businesses_limit: 1,
    },
    { onConflict: 'user_id' }
  )
}

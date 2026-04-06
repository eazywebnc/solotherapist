import { createAdminClient } from '@/lib/supabase/server'

/**
 * Ensures the authenticated user has an st_settings record.
 * Called on first dashboard access to support cross-SaaS login.
 */
export async function ensureUserProfile(userId: string) {
  const supabase = createAdminClient()

  const { data: existing } = await supabase
    .from('st_settings')
    .select('user_id')
    .eq('user_id', userId)
    .single()

  if (existing) return

  await supabase.from('st_settings').upsert(
    {
      user_id: userId,
      plan: 'free',
    },
    { onConflict: 'user_id' }
  )
}

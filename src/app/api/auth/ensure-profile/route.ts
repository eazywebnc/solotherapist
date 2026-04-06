import { createClient, createAdminClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const admin = createAdminClient()

    // Ensure shared_users profile exists
    const { data: existingUser } = await admin
      .from('shared_users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      await admin.from('shared_users').upsert(
        {
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
        },
        { onConflict: 'id' }
      )
    }

    // Ensure st_settings profile exists
    const { data: existingSettings } = await admin
      .from('st_settings')
      .select('user_id')
      .eq('user_id', user.id)
      .single()

    if (!existingSettings) {
      await admin.from('st_settings').upsert(
        {
          user_id: user.id,
          plan: 'free',
        },
        { onConflict: 'user_id' }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

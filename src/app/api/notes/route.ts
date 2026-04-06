import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const clientId = searchParams.get('client_id')

    let query = supabase
      .from('st_notes')
      .select('*, st_clients(id, first_name, last_name), st_appointments(id, date, start_time, type)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ notes: data })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { client_id, appointment_id, content, mood_rating, progress_rating } = body

    if (!client_id || !content) {
      return NextResponse.json(
        { error: 'client_id and content are required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('st_notes')
      .insert({
        user_id: user.id,
        client_id,
        appointment_id: appointment_id || null,
        content,
        mood_rating: mood_rating || null,
        progress_rating: progress_rating || null,
      })
      .select('*, st_clients(id, first_name, last_name)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ note: data }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

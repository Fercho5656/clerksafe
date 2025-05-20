import { supabaseServer } from '@/lib/supabase'
import type { APIRoute } from 'astro'

// Handle share retrieval
export const GET: APIRoute = async ({ params, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = params
  const supabase = await supabaseServer(locals)

  const { data, error } = await supabase
    .from('shares')
    .select('*, files(*), users(*)')
    .eq('file_id', id)
    .eq('files.created_by', userId)

  if (error) {
    console.error('Error fetching shares:', error)
    return new Response(JSON.stringify({ error: 'Error fetching shares' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Handle share edition
export const PUT: APIRoute = async ({ params, request, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = params
  const supabase = await supabaseServer(locals)
  const body = await request.json()

  const { requires_mfa, expiration_date } = body

  const { data, error } = await supabase
    .from('shares')
    .update({
      requires_mfa,
      expiration_date,
    })
    .eq('id', id)
    .eq('file_id', body.file_id)

  if (error) {
    console.error('Error updating share:', error)
    return new Response(JSON.stringify({ error: 'Error updating share' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

// Handle share deletion
export const DELETE: APIRoute = async ({ params, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = params
  const supabase = await supabaseServer(locals)

  const { data, error } = await supabase.from('shares').delete().eq('id', id)

  if (error) {
    console.error('Error deleting share:', error)
    return new Response(JSON.stringify({ error: 'Error deleting share' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

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

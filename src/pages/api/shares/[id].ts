import { supabaseServer } from '@/lib/supabase'
import type { APIRoute } from 'astro'

export const GET: APIRoute = async ({ params, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { id } = params
  const supabase = await supabaseServer(locals)

  const { data, error } = await supabase
    .from('shares')
    .select('* , files!inner()')
    .eq('files.created_by', userId)
    .eq('shares.file_id', id)

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

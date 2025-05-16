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
    .select('*, files(*), users(*)') // ← esto es el "join"
    .eq('file_id', id) // ← filtro directo de shares
    .eq('files.created_by', userId) // ← esto hace el efecto del INNER JOIN

  if (error) {
    console.error('Error fetching shares:', error)
    return new Response(JSON.stringify({ error: 'Error fetching shares' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  console.log({ data })
  console.log({ file: data[0].files })
  console.log({ user: data[0].users })

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

import type { APIRoute } from 'astro'
import { supabaseServer } from '@/lib/supabase'

export const GET: APIRoute = async ({ params, locals }) => {
  const { name } = params
  const { userId } = locals.auth()

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = await supabaseServer(locals)

  const { data, error } = await supabase.storage
    .from('userfiles')
    .createSignedUrl(`${userId}/${name}`, 60)

  if (error) {
    console.error('Error downloading file:', error)
    return new Response(JSON.stringify({ error: 'Error downloading file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(
    JSON.stringify({
      data,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

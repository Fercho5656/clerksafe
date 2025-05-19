import { supabaseServer } from '@/lib/supabase'
import type { APIRoute } from 'astro'

// Handle share creation
export const POST: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = await supabaseServer(locals)

  try {
    const formData = await request.formData()
    const { data, error } = await supabase
      .from('shares')
      .insert({
        file_id: formData.get('file_id'),
        shared_with: formData.get('shared_with'),
      })
      .select('*, users(*)')

    if (error) {
      console.error('Error creating share:', error)
      return new Response(JSON.stringify({ error: 'Error creating share' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in share creation:', error)
    return new Response(JSON.stringify({ error: 'Error creating share' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

import type { APIRoute } from 'astro'
import { createClient } from '@supabase/supabase-js'

// Handle Clerk webhook events
export const POST: APIRoute = async ({ request }) => {
  const { data } = await request.json()

  const supabase = createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
  )

  // add user to supabase
  const { error: userError } = await supabase.from('users').upsert({
    id: data.id,
    email: data.email_addresses[0].email_address,
    username: data.username,
    first_name: data.first_name,
    last_name: data.last_name,
    image_url: data.profile_image_url,
  })

  if (userError) {
    console.error('Error adding user to Supabase:', userError)
    return new Response(JSON.stringify({ error: 'Error adding user' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ message: 'User added successfully' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

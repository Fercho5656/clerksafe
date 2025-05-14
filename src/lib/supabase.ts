import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_ANON_KEY,
)

export async function supabaseServer(locals: App.Locals) {
  const { userId, getToken } = locals.auth()

  if (!userId) {
    throw new Error('No user ID provided')
  }

  return createClient(
    import.meta.env.SUPABASE_URL,
    import.meta.env.SUPABASE_ANON_KEY,
    {
      async accessToken() {
        return await getToken()
      },
    },
  )
}

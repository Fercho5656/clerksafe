import type { SupabaseClient } from '@supabase/supabase-js'

export const fetchUserFiles = async (
  userId: string,
  supabaseClient: SupabaseClient,
) => {
  if (!userId) {
    console.error('No user ID provided')
    return []
  }

  const { data, error } = await supabaseClient
    .from('files')
    .select('*')
    .eq('created_by', userId)
    .limit(50)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching files:', error)
    return []
  }

  return data
}

export const fetchFilesSharedWithUser = async (
  userEmail: string,
  supabaseClient: SupabaseClient,
) => {
  if (!userEmail) {
    console.error('No user email provided')
    return []
  }

  const { data, error } = await supabaseClient
    .from('shares')
    .select('*, files(*)') // ← esto es el "join"
    .eq('shared_with', userEmail) // ← filtro directo de shares

  console.log({ data })

  if (error) {
    console.error('Error fetching shared files:', error)
    return []
  }

  return data
}

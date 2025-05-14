import type { SupabaseClient } from '@supabase/supabase-js'

export const fetchUserFiles = async (
  userId: string,
  supabaseClient: SupabaseClient,
) => {
  if (!userId) {
    console.error('No user ID provided')
    return []
  }

  const { data, error } = await supabaseClient.storage
    .from('userfiles')
    .list(userId, {
      limit: 50,
      offset: 0,
    })

  if (error) {
    console.error('Error fetching files:', error)
    return []
  }

  return data
}

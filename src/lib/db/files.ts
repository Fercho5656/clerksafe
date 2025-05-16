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

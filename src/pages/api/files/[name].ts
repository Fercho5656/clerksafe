import type { APIRoute } from 'astro'
import { supabaseServer } from '@/lib/supabase'
import { clerkClient } from '@clerk/astro/server'

// Handles file downloads
export const GET: APIRoute = async (context) => {
  const { params, locals } = context
  const { name } = params
  const { userId } = locals.auth()

  if (!name) {
    return new Response(JSON.stringify({ error: 'File name is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = await supabaseServer(locals)

  const { data: file, error: fileError } = await supabase
    .from('files')
    .select('object_path, id, created_by')
    .eq('id', name)
    .single()

  if (fileError) {
    console.error('Error fetching file:', fileError)
    return new Response(JSON.stringify({ error: 'Error fetching file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Check if the file-share needs MFA to download it

  const { data: fileShare, error: fileShareError } = await supabase
    .from('shares')
    .select('requires_mfa, expires_at, users(*)')
    .eq('file_id', file.id)
    .eq('users.id', userId)

  if (fileShareError) {
    console.error('Error fetching file share:', fileShareError)
    return new Response(
      JSON.stringify({ error: 'Error fetching file share' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  // If MFA is required, check if the user has MFA enabled
  // Only check MFA for users who didn't create the file
  if (file.created_by !== userId && fileShare[0]?.requires_mfa) {
    try {
      const clerkUser = await clerkClient(context).users.getUser(userId)

      if (!clerkUser) {
        return new Response('Unauthorized', { status: 401 })
      }

      if (!clerkUser.twoFactorEnabled) {
        return new Response(JSON.stringify({ error: 'MFA is required' }), {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        })
      }
    } catch (e) {
      console.error('Error fetching MFA:', e)
      return new Response(JSON.stringify({ error: 'Error fetching MFA' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }

  if (new Date(fileShare[0]?.expires_at) < new Date()) {
    return new Response(JSON.stringify({ error: 'File share has expired' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // if the user is not the owner of the file and the share doesn't include the user

  if (
    file.created_by !== userId &&
    (!fileShare[0]?.users || fileShare[0]?.users?.id !== userId)
  ) {
    console.log('userId', userId)
    return new Response(
      JSON.stringify({ error: 'File is not being shared with you anymore' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }

  const { object_path } = file

  const { data, error } = await supabase.storage
    .from('userfiles')
    .download(object_path)

  if (error) {
    console.error('Error downloading file:', error)
    return new Response(JSON.stringify({ error: 'Error downloading file' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return new Response(data, {
    status: 200,
    headers: {
      'Content-Type': data.type,
      'Content-Disposition': `attachment; filename="${name}"`,
    },
  })
}

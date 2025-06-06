import type { APIRoute } from 'astro'
import { supabaseServer } from '@/lib/supabase'

const IMAGE_THUMBNAIL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWltYWdlLWljb24gbHVjaWRlLWltYWdlIj48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIiByeT0iMiIvPjxjaXJjbGUgY3g9IjkiIGN5PSI5IiByPSIyIi8+PHBhdGggZD0ibTIxIDE1LTMuMDg2LTMuMDg2YTIgMiAwIDAgMC0yLjgyOCAwTDYgMjEiLz48L3N2Zz4='

const VIDEO_THUMBNAIL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXNxdWFyZS1wbGF5LWljb24gbHVjaWRlLXNxdWFyZS1wbGF5Ij48cmVjdCB3aWR0aD0iMTgiIGhlaWdodD0iMTgiIHg9IjMiIHk9IjMiIHJ4PSIyIi8+PHBhdGggZD0ibTkgOCA2IDQtNiA0WiIvPjwvc3ZnPg=='

const PDF_THUMBNAIL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtdGV4dC1pY29uIGx1Y2lkZS1maWxlLXRleHQiPjxwYXRoIGQ9Ik0xNSAySDZhMiAyIDAgMCAwLTIgMnYxNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWN1oiLz48cGF0aCBkPSJNMTQgMnY0YTIgMiAwIDAgMCAyIDJoNCIvPjxwYXRoIGQ9Ik0xMCA5SDgiLz48cGF0aCBkPSJNMTYgMTNIOCIvPjxwYXRoIGQ9Ik0xNiAxN0g4Ii8+PC9zdmc+'

const FILE_THUMBNAIL =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLWZpbGUtaWNvbiBsdWNpZGUtZmlsZSI+PHBhdGggZD0iTTE1IDJINmEyIDIgMCAwIDAtMiAydjE2YTIgMiAwIDAgMCAyIDJoMTJhMiAyIDAgMCAwIDItMlY3WiIvPjxwYXRoIGQ9Ik0xNCAydjRhMiAyIDAgMCAwIDIgMmg0Ii8+PC9zdmc+'

const TEMP_THUMBNAILS: Record<string, string> = {
  image: IMAGE_THUMBNAIL,
  video: VIDEO_THUMBNAIL,
  application: PDF_THUMBNAIL,
  generic: FILE_THUMBNAIL,
}

/**
 * Handles file uploads
 */
export const POST: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = await supabaseServer(locals)

  const data = await request.formData()
  const uploadedData = []

  for (const [key, value] of data.entries()) {
    if (!(value instanceof File)) {
      console.error(`Expected a file, but got ${typeof value} for key ${key}`)
      continue
    }

    const file = value as File
    const fileName = file.name
    const fileType = file.type
    console.log(fileType.split('/')[0])
    const thumbnail =
      TEMP_THUMBNAILS[fileType.split('/')[0]] || TEMP_THUMBNAILS.generic

    const filePath = `${userId}/${fileName}`
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('userfiles')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        metadata: {
          thumbnail,
        },
      })

    if (uploadError) {
      console.error('Error uploading file:', uploadError)
      return new Response('Error uploading file', { status: 500 })
    }

    // Add to file table
    const { data: uploadFileData, error: insertError } = await supabase
      .from('files')
      .insert([
        {
          created_by: userId,
          bucket_name: 'userfiles',
          object_path: filePath,
          file_name: fileName,
          size: file.size,
          thumbnail,
        },
      ])
      .select()

    if (insertError) {
      console.error('Error inserting file record:', insertError)
      return new Response(
        JSON.stringify({ error: 'Error inserting file record' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    console.log('File uploaded successfully:', uploadData)
    uploadedData.push({
      ...uploadFileData[0],
    })
  }

  return new Response(
    JSON.stringify({
      message: 'Files uploaded successfully',
      data: uploadedData,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

/**
 * Handles file deletion
 */
export const DELETE: APIRoute = async ({ request, locals }) => {
  const { userId } = locals.auth()
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const supabase = await supabaseServer(locals)

  const { fileName } = await request.json()
  const filePath = `${userId}/${fileName}`

  const { error } = await supabase.storage.from('userfiles').remove([filePath])

  if (error) {
    console.error('Error deleting file:', error)
    return new Response('Error deleting file', {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  // Remove from file table
  const { error: deleteError } = await supabase
    .from('files')
    .delete()
    .eq('object_path', filePath)
    .eq('created_by', userId)

  if (deleteError) {
    console.error('Error deleting file record:', deleteError)
    return new Response(
      JSON.stringify({ error: 'Error deleting file record' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }

  return new Response(
    JSON.stringify({ message: 'File deleted successfully' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
}

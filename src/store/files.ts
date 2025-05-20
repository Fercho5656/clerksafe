import { map } from 'nanostores'

export interface File {
  id: string
  created_by: string
  bucket_name: string
  object_path: string
  is_anon: boolean
  expires_at: Date
  created_at: Date
  thumbnail: string
  file_name: string
  size: number
}

export const $newFile = map<File[]>([])

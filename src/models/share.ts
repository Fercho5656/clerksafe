import type { User } from '@/models/user'
type AccessType = 'RESTRICTED' | 'PUBLIC' | 'AUTH'

export interface Share {
  id: string
  shared_with: string[]
  requires_mfa: boolean
  expires_at: string | null
  created_at: string
  access_type: AccessType
}

/*
 * The `ShareWithUser` interface extends the `Share` interface and adds a `user` property.
 * This is used to represent a share that is associated with a specific user.
 */

export interface ShareWithUserAndFile extends Share {
  files: File
  users: User
}

type AccessType = 'RESTRICTED' | 'PUBLIC' | 'AUTH'

export interface Share {
  id: string
  shared_with: string[]
  requires_mfa: boolean
  expires_at: string | null
  created_at: string
  access_type: AccessType
}

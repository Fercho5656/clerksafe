interface ImportMetaEnv {
  readonly SUPABASE_URL: string
  readonly SUPABASE_ANON_KEY: string
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY: string
  readonly CLERK_SECRET_KEY: string
  readonly CLERK_WEBHOOK_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

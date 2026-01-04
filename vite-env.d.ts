/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_GEMINI_API_KEY: string
  readonly VITE_REDTEA_API_KEY?: string
  readonly VITE_REDTEA_API_SECRET?: string
  readonly VITE_REDTEA_BASE_URL?: string
  readonly VITE_TELNYX_API_KEY?: string
  readonly VITE_TELNYX_BASE_URL?: string
  readonly VITE_TELNYX_VERIFY_PROFILE_ID?: string
  readonly VITE_AIRALO_API_KEY?: string
  readonly VITE_AIRALO_BASE_URL?: string
  readonly VITE_VPN_API_KEY?: string
  readonly VITE_VPN_API_SECRET?: string
  readonly VITE_VPN_BASE_URL?: string
  readonly VITE_VPN_PROVIDER?: string
  readonly VITE_ESIMGO_API_KEY?: string
  readonly VITE_ESIMGO_API_SECRET?: string
  readonly VITE_ESIMGO_BASE_URL?: string
  readonly VITE_ESIMGO_TIER?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


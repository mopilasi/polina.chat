/// <reference types="vite/client" />

interface ImportMetaEnv {
  // OpenAI Configuration
  readonly VITE_OPENAI_API_KEY: string
  
  // Application Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: string
  
  // Analytics (Optional)
  readonly VITE_GOOGLE_ANALYTICS_ID?: string
  readonly VITE_PLAUSIBLE_DOMAIN?: string
  
  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_OPENAI: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 
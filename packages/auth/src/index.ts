// Auth Package - Main exports

// Supabase clients
export { createClient as createBrowserClient } from './lib/supabase/client'
export { createClient as createServerClient } from './lib/supabase/server'
export { updateSession } from './lib/supabase/middleware'

// Auth service
export { AuthService } from './lib/auth'

// Types
export type {
  UserRole,
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthError,
  AuthResponse,
} from './types'

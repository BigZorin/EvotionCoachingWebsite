// Auth Types
export type UserRole = 'CLIENT' | 'COACH' | 'ADMIN'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  firstName?: string
  lastName?: string
  avatarUrl?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  role: UserRole
}

export interface AuthError {
  message: string
  code?: string
}

export interface AuthResponse {
  user: AuthUser | null
  error: AuthError | null
}

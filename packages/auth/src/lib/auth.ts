// Auth utilities
import type {
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthUser
} from '../types'

export class AuthService {
  private supabase: any

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient
  }

  /**
   * Sign in with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (error) {
        return {
          user: null,
          error: { message: error.message, code: error.code },
        }
      }

      // Fetch user profile from our database
      const user = await this.getUserProfile(data.user.id)

      return {
        user,
        error: null,
      }
    } catch (error: any) {
      return {
        user: null,
        error: { message: error.message || 'Login failed' },
      }
    }
  }

  /**
   * Sign up with email and password
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
          },
        },
      })

      if (authError) {
        return {
          user: null,
          error: { message: authError.message, code: authError.code },
        }
      }

      // 2. User profile will be created via database trigger
      // Wait a moment for the trigger to complete
      await new Promise(resolve => setTimeout(resolve, 500))

      const user = await this.getUserProfile(authData.user!.id)

      return {
        user,
        error: null,
      }
    } catch (error: any) {
      return {
        user: null,
        error: { message: error.message || 'Registration failed' },
      }
    }
  }

  /**
   * Sign out
   */
  async logout(): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.signOut()
    return { error }
  }

  /**
   * Get current user
   */
  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()

      if (error || !user) {
        return null
      }

      return await this.getUserProfile(user.id)
    } catch {
      return null
    }
  }

  /**
   * Get user profile from auth metadata
   */
  private async getUserProfile(userId: string): Promise<AuthUser | null> {
    try {
      const { data: { user }, error } = await this.supabase.auth.getUser()

      if (error || !user || user.id !== userId) {
        return null
      }

      // Get role from user_metadata, default to CLIENT if not set
      const role = user.user_metadata?.role || 'CLIENT'
      const firstName = user.user_metadata?.first_name || user.user_metadata?.firstName
      const lastName = user.user_metadata?.last_name || user.user_metadata?.lastName

      return {
        id: user.id,
        email: user.email!,
        role: role,
        firstName: firstName,
        lastName: lastName,
        avatarUrl: user.user_metadata?.avatar_url,
      }
    } catch {
      return null
    }
  }

  /**
   * Reset password
   */
  async resetPassword(email: string): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })
    return { error }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error: any }> {
    const { error } = await this.supabase.auth.updateUser({
      password: newPassword,
    })
    return { error }
  }
}

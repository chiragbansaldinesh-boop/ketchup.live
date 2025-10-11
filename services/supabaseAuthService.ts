import { supabase } from '@/config/supabase';
import { AuthError, Session, User } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: string;
}

class SupabaseAuthService {
  async signUp(
    email: string,
    password: string,
    metadata?: {
      full_name?: string;
      phone?: string;
      photo_url?: string;
    }
  ): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
        },
      });

      if (error) throw error;

      if (data.user && data.session) {
        await this.createUserProfile(data.user.id, email, metadata);
      }

      return {
        success: true,
        user: data.user ?? undefined,
        session: data.session ?? undefined,
      };
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      return {
        success: true,
        user: data.user,
        session: data.session,
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  async signInWithGoogle(): Promise<AuthResult> {
    try {
      const redirectUrl = Linking.createURL('/auth/callback');

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: Platform.OS !== 'web',
        },
      });

      if (error) throw error;

      if (Platform.OS !== 'web' && data.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success') {
          const url = result.url;
          const params = new URLSearchParams(url.split('#')[1]);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            const { data: sessionData, error: sessionError } =
              await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken,
              });

            if (sessionError) throw sessionError;

            if (sessionData.user) {
              await this.createUserProfile(
                sessionData.user.id,
                sessionData.user.email || '',
                {
                  full_name: sessionData.user.user_metadata?.full_name,
                  photo_url: sessionData.user.user_metadata?.avatar_url,
                }
              );
            }

            return {
              success: true,
              user: sessionData.user,
              session: sessionData.session ?? undefined,
            };
          }
        }

        return {
          success: false,
          error: 'Authentication was cancelled or failed',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      console.error('Google sign in error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  async signOut(): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  async resetPassword(email: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: Linking.createURL('/auth/reset-password'),
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      return {
        success: false,
        error: this.getErrorMessage(error as AuthError),
      };
    }
  }

  async getSession(): Promise<Session | null> {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    } catch (error) {
      console.error('Get session error:', error);
      return null;
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  onAuthStateChange(callback: (user: User | null) => void) {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user ?? null);
    });

    return data.subscription;
  }

  private async createUserProfile(
    userId: string,
    email: string,
    metadata?: {
      full_name?: string;
      phone?: string;
      photo_url?: string;
    }
  ): Promise<void> {
    try {
      const { error } = await supabase.from('profiles').upsert(
        {
          id: userId,
          email: email,
          full_name: metadata?.full_name || '',
          display_name: metadata?.full_name || '',
          phone: metadata?.phone || '',
          photo_url: metadata?.photo_url || '',
          photos: metadata?.photo_url ? [metadata.photo_url] : [],
          is_online: true,
          last_seen: new Date().toISOString(),
        },
        {
          onConflict: 'id',
        }
      );

      if (error) throw error;
    } catch (error) {
      console.error('Error creating user profile:', error);
    }
  }

  private getErrorMessage(error: AuthError | any): string {
    if (!error) return 'An unknown error occurred';

    if (error.message) {
      const message = error.message.toLowerCase();

      if (message.includes('invalid login credentials')) {
        return 'Invalid email or password';
      }
      if (message.includes('email not confirmed')) {
        return 'Please verify your email address';
      }
      if (message.includes('user already registered')) {
        return 'An account with this email already exists';
      }
      if (message.includes('invalid email')) {
        return 'Invalid email address';
      }
      if (message.includes('password')) {
        return 'Password must be at least 6 characters';
      }

      return error.message;
    }

    return 'An error occurred. Please try again.';
  }
}

export const supabaseAuthService = new SupabaseAuthService();

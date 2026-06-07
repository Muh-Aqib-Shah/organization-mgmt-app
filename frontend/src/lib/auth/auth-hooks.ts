import { useCallback, useState } from 'react';
import { supabase } from '../supabase';
import type { AuthError, SignInFormData, SignUpFormData } from '../types/auth-types';

export const useAuth = () => {
  const [error, setError] = useState<AuthError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const signIn = useCallback(async (data: SignInFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

      if (authError) {
        setError({
          message: authError.message || 'Failed to sign in. Please try again.',
          code: authError.code,
        });
        return null;
      }

      return authData.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError({ message });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signUp = useCallback(async (data: SignUpFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        setError({
          message: authError.message || 'Failed to sign up. Please try again.',
          code: authError.code,
        });
        return null;
      }

      return authData.user;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError({ message });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError({
          message: signOutError.message || 'Failed to sign out',
          code: signOutError.code,
        });
        return false;
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred';
      setError({ message });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      return user;
    } catch (err) {
      console.error('Error getting current user:', err);
      return null;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signIn,
    signUp,
    signOut,
    getCurrentUser,
    error,
    isLoading,
    clearError,
  };
};

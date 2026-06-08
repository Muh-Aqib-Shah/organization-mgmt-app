import z from 'zod';
import type { signInSchema, signUpSchema } from '../schema/auth-schemas';
import type { User } from '@supabase/supabase-js';

export type AuthMode = 'signin' | 'signup';

export type SignUpFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface AuthError {
  message: string;
  code?: string;
}

export type AuthFormData = SignInFormData & Partial<SignUpFormData>;

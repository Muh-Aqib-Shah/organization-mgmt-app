import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Loader2, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import { type UseFormReturn } from 'react-hook-form';
import type {
  AuthFormData,
  AuthMode,
  SignInFormData,
  SignUpFormData,
} from '@/lib/types/auth-types';
import React, { useState } from 'react';
import { useAuth } from '@/lib/auth/auth-hooks';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthFormProps {
  form: UseFormReturn<AuthFormData>;
  isSignIn: boolean;
  mode: AuthMode;
  setMode: React.Dispatch<React.SetStateAction<AuthMode>>;
  setServerError: React.Dispatch<React.SetStateAction<string | null>>;
  setSignUpSuccess: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthForm: React.FC<AuthFormProps> = ({
  form,
  isSignIn,
  mode,
  setMode,
  setServerError,
  setSignUpSuccess,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  const { signIn, signUp, isLoading, error: authError } = useAuth();

  async function onSubmit(data: AuthFormData) {
    setServerError(null);

    if (mode === 'signin') {
      const user = await signIn(data as SignInFormData);
      if (user) {
        toast.success('Sign Up Successful', {
          description: 'Your Account has been created',
        });
        navigate('/dashboard');
      } else if (authError) {
        setServerError(authError.message);
      }
    } else {
      const user = await signUp(data as SignUpFormData);
      if (user) {
        toast.success('Sign In Successful', {
          description: 'Your Account has been logged in',
        });
        setSignUpSuccess(true);
        setTimeout(() => {
          setMode('signin');
          form.reset();
          setSignUpSuccess(false);
        }, 2000);
      } else if (authError) {
        setServerError(authError.message);
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel className="text-xs text-slate-900 font-semibold tracking-wide">
                Email address
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="you@email.com"
                    type="email"
                    disabled={isLoading}
                    autoComplete="email"
                    className="h-10 pl-10 rounded-lg border-slate-200 bg-white shadow-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <div className="flex items-center justify-between">
                <FormLabel className="text-xs text-slate-900 font-semibold tracking-wide">
                  Password
                </FormLabel>
                {isSignIn && (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-xs text-purple-600 font-semibold hover:text-purple-700 hover:no-underline"
                  >
                    Forgot password?
                  </Button>
                )}
              </div>
              <FormControl>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Enter your password"
                    type={showPassword ? 'text' : 'password'}
                    disabled={isLoading}
                    autoComplete={
                      isSignIn ? 'current-password' : 'new-password'
                    }
                    className="h-10 pl-10 pr-10 rounded-lg border-slate-200 bg-white shadow-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage className="text-xs" />
              {!isSignIn && (
                <FormDescription className="text-[11px] text-slate-500 font-medium leading-none pt-0.5">
                  Must include uppercase, lowercase, number, and 8+ characters
                </FormDescription>
              )}
            </FormItem>
          )}
        />

        {!isSignIn && (
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel className="text-xs text-slate-900 font-semibold tracking-wide">
                  Confirm Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="••••••••"
                      type={showConfirmPassword ? 'text' : 'password'}
                      disabled={isLoading}
                      autoComplete="new-password"
                      className="h-10 pl-10 pr-10 rounded-lg border-slate-200 bg-white shadow-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        )}

        <Button
          type="submit"
          className="w-full h-10 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition-colors mt-4 text-sm shadow-sm"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isSignIn ? 'Signing in...' : 'Creating account...'}
            </>
          ) : isSignIn ? (
            'Sign In'
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </Form>
  );
};

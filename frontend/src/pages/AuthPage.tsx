import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Loader2,
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  Zap,
  Target,
  BarChart3,
  LockIcon,
} from 'lucide-react';

import { signInSchema, signUpSchema } from '@/lib/schema/auth-schemas';
import {
  type SignInFormData,
  type SignUpFormData,
} from '@/lib/types/auth-types';
import { useAuth } from '@/lib/auth/auth-hooks';
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
import { toast } from 'sonner';
import welcomeImg from '@/assets/welcome.png';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const navigate = useNavigate();
  const { signIn, signUp, isLoading, error: authError } = useAuth();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  type AuthFormData = SignInFormData & Partial<SignUpFormData>;

  const featureList = [
    {
      icon: BarChart3,
      title: 'Centralized Management',
      desc: 'View and manage all your organizations from a single dashboard.',
    },
    {
      icon: LockIcon,
      title: 'Secure & Private',
      desc: 'Your data is encrypted and your privacy is our top priority.',
    },
    {
      icon: Target,
      title: 'Built for Growth',
      desc: 'Designed to scale with your organization, no matter the size.',
    },
  ];

  const form = useForm<AuthFormData>({
    resolver: zodResolver(mode === 'signin' ? signInSchema : signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setServerError(null);
    setSignUpSuccess(false);
    form.reset();
  };

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

  const isSignIn = mode === 'signin';

  return (
    <div className="min-h-screen w-full flex bg-[#fbfbfe]">
      <div className="hidden lg:flex lg:w-1/2 flex-col p-6 xl:p-8 justify-center items-center border-r border-slate-100">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-950 mb-0.5">
                Secure. Simple. Scalable.
              </h1>
              <p className="text-xs text-slate-600 leading-normal">
                Manage your organizations and team members in one place.
              </p>
            </div>
          </div>

          <div className="w-full flex justify-center py-2">
            <img
              src={welcomeImg}
              alt="Welcome Illustration"
              className="max-w-[70%] h-auto object-contain"
            />
          </div>

          <div className="space-y-4">
            {featureList.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="p-2 bg-purple-50 rounded-lg text-purple-600 shrink-0">
                  <feature.icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-950 mb-0.5">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-normal">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white relative">
        <div className="w-full max-w-sm">
          {signUpSuccess && (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-2xl text-green-600">✓</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">
                Account Created!
              </h2>
              <p className="text-sm text-slate-600 font-medium">
                Redirecting to sign in...
              </p>
            </div>
          )}

          {!signUpSuccess && (
            <>
              <div className="mb-6 relative pr-10">
                <h2 className="text-2xl font-extrabold text-slate-950 mb-1 tracking-tight">
                  {isSignIn ? 'Welcome back' : 'Get started'}
                </h2>
                <p className="text-xs font-medium text-slate-600">
                  {isSignIn
                    ? 'Sign in to continue to Organization Manager'
                    : 'Create your account to join Organization Manager'}
                </p>

                <div className="absolute top-1 right-0 flex items-center justify-center w-8 h-8 bg-purple-50 rounded-lg border border-purple-100">
                  <span className="text-lg">👋</span>
                </div>
              </div>

              {serverError && (
                <div className="mb-4 flex items-center gap-2.5 rounded-lg bg-red-50 p-3 border border-red-200">
                  <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <p className="text-xs font-medium text-red-800">
                    {serverError}
                  </p>
                </div>
              )}

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-3"
                >
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
                            Must include uppercase, lowercase, number, and 8+
                            characters
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

              <div className="mt-4 text-center">
                <p className="text-sm font-medium text-slate-600">
                  {isSignIn
                    ? "Don't have an account? "
                    : 'Already have an account? '}
                  <button
                    onClick={toggleMode}
                    className="font-semibold text-purple-600 hover:text-purple-700 transition-colors cursor-pointer"
                  >
                    {isSignIn ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>

              <div className="mt-8 text-center text-[11px] text-slate-400 font-medium">
                By signing in, you agree to our{' '}
                <a
                  href="#"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a
                  href="#"
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

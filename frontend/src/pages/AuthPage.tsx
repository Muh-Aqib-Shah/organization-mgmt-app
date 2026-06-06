import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

import { signInSchema, signUpSchema, type SignInFormData, type SignUpFormData } from '@/lib/auth-schemas'
import { useAuth } from '@/lib/auth-hooks'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import background from '@/assets/background.jpg'

type AuthMode = 'signin' | 'signup'

export function AuthPage() {
  const navigate = useNavigate()
  const { signIn, signUp, isLoading, error: authError } = useAuth()
  const [mode, setMode] = useState<AuthMode>('signin')
  const [serverError, setServerError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  // Unified form that handles both modes
  type AuthFormData = SignInFormData & Partial<SignUpFormData>
  
  const form = useForm<AuthFormData>({
    resolver: zodResolver(mode === 'signin' ? signInSchema : signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin')
    setServerError(null)
    setSignUpSuccess(false)
    form.reset()
  }

  async function onSubmit(data: AuthFormData) {
    setServerError(null)

    if (mode === 'signin') {
      const user = await signIn(data as SignInFormData)
      if (user) {
        navigate('/dashboard')
      } else if (authError) {
        setServerError(authError.message)
      }
    } else {
      const user = await signUp(data as SignUpFormData)
      if (user) {
        setSignUpSuccess(true)
        setTimeout(() => {
          setMode('signin')
          form.reset()
          setSignUpSuccess(false)
        }, 2000)
      } else if (authError) {
        setServerError(authError.message)
      }
    }
  }

  const isSignIn = mode === 'signin'

  return (
    <div 
      className="min-h-screen w-full flex relative bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${background})` }}
    >
      
      {/* Left Side - Background with Text Overlay */}
      <div className="hidden lg:flex lg:w-3/5 relative overflow-hidden">
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-r from-slate-900 via-slate-900/60 to-transparent" />
        
        {/* Text Content */}
        <div className="absolute inset-0 flex flex-col justify-end items-start p-12 z-10">
          <div className="max-w-lg absolute">
            <p className="text-sm text-start font-bold text-white mb-4 leading-tight">
              Manage Organizations. Effortlessly.
            </p>
            <p className="text-sm text-start text-slate-200 mb-8 leading-relaxed">
              Streamline team management, invite members with ease, and grow your organizations faster.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                <span>Invite members instantly</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                <span>Track member status in real-time</span>
              </div>
              <div className="flex items-center text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                <span>Multiple organization types supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section - Right Side */}
      <div className="m-9 rounded-md w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-md">
          {/* Success Message */}
          {signUpSuccess && (
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Account Created!</h2>
              <p className="text-slate-600">Redirecting to sign in...</p>
            </div>
          )}

          {!signUpSuccess && (
            <>
              {/* Header */}
              <div className="m-4">
                <h3 className="text-2xl text-start font-bold text-slate-900 mb-1">
                  {isSignIn ? 'Welcome Back!' : 'Get Started'}
                </h3>
                <p className="text-slate-600 text-[13px] text-start">
                  {isSignIn
                    ? 'Sign in to manage your organizations and team members'
                    : 'Create an account to start managing organizations'}
                </p>
              </div>

              {/* Error Alert */}
              {serverError && (
                <div className="mb-6 flex items-center gap-3 rounded-lg bg-red-50 p-4 border border-red-200">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-800">{serverError}</p>
                </div>
              )}

              {/* Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="you@company.com"
                            type="email"
                            disabled={isLoading}
                            autoComplete="email"
                            className="h-11 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-medium">Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="••••••••"
                              type={showPassword ? 'text' : 'password'}
                              disabled={isLoading}
                              autoComplete={isSignIn ? 'current-password' : 'new-password'}
                              className="h-11 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                              {...field}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5" />
                              ) : (
                                <Eye className="h-5 w-5" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage />
                        {!isSignIn && (
                          <FormDescription className="text-xs mt-2 text-slate-600">
                            Must include uppercase, lowercase, number, and 8+ characters
                          </FormDescription>
                        )}
                      </FormItem>
                    )}
                  />

                  {/* Confirm Password - Sign Up Only */}
                  {!isSignIn && (
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-700 font-medium">Confirm Password</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="••••••••"
                                type={showConfirmPassword ? 'text' : 'password'}
                                disabled={isLoading}
                                autoComplete="new-password"
                                className="h-11 rounded-lg border-slate-300 focus:border-blue-500 focus:ring-blue-500 pr-10"
                                {...field}
                              />
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                              >
                                {showConfirmPassword ? (
                                  <EyeOff className="h-5 w-5" />
                                ) : (
                                  <Eye className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-10 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors mt-6"
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

                  {/* Divider */}
                  <div className="relative my-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-slate-500">or</span>
                    </div>
                  </div>

                  
                </form>
              </Form>

              {/* Toggle Link */}
              <div className="mt-4 text-center">
                <p className="text-slate-600">
                  {isSignIn ? "Don't have an account? " : 'Already have an account? '}
                  <button
                    onClick={toggleMode}
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
                  >
                    {isSignIn ? 'Sign up' : 'Sign in'}
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

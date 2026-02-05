import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Shield,
  Users,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  EyeOff,
  Loader2,
  Zap
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const response = await apiRequest('POST', '/api/auth/login', data);
      const result = await response.json();

      if (result.success) {
        toast({
          title: "Welcome back!",
          description: "Logging you in...",
        });

        await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });

        if (result.user.hasCompletedOnboarding) {
          setLocation('/dashboard');
        } else {
          setLocation('/onboarding');
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Invalid email or password";
      
      if (error.message && error.message.includes('verify your email')) {
        toast({
          title: "Email Verification Required",
          description: (
            <div className="space-y-2">
              <p>{errorMessage}</p>
              <Button
                variant="link"
                className="p-0 h-auto text-white hover:text-white/80"
                onClick={() => setLocation('/resend-verification')}
              >
                Resend verification email
              </Button>
            </div>
          ),
          variant: "destructive",
        });
      } else if (error.message && error.message.includes('locked')) {
        toast({
          title: "Account Locked",
          description: errorMessage,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login failed",
          description: errorMessage,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-primary">
                  <Zap className="w-5 h-5 text-primary-foreground" fill="currentColor" />
                </div>
                <span className="text-xl font-bold text-white">PartnerConnector</span>
              </div>
            </Link>
            <Button 
              variant="ghost" 
              asChild 
              className="text-gray-400 hover:text-white hover:bg-[hsl(200,15%,12%)]"
              data-testid="button-back-home"
            >
              <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="min-h-screen flex">
        {/* Left Side - Login Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-md w-full">
            <div className="text-center mb-8">
              <p className="text-cyan-400 text-sm font-medium tracking-wide uppercase mb-3">Secure Login</p>
              <h1 className="text-3xl font-bold text-white mb-3">
                Welcome Back
              </h1>
              <p className="text-gray-500">
                Sign in to access your partner dashboard
              </p>
            </div>

            <div className="rocket-card p-6">
              <div className="mb-6">
                <h2 className="text-white font-semibold text-lg">Sign In</h2>
                <p className="text-gray-500 text-sm">Enter your credentials to continue</p>
              </div>

              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    disabled={isLoading}
                    data-testid="input-email"
                    className="bg-[hsl(200,18%,8%)] border-[hsl(174,40%,18%)] text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                    {...form.register("email")}
                  />
                  {form.formState.errors.email && (
                    <p className="text-sm text-red-400">{form.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-300">Password</Label>
                    <Link href="/forgot-password">
                      <button
                        type="button"
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                        data-testid="link-forgot-password"
                      >
                        Forgot password?
                      </button>
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      disabled={isLoading}
                      data-testid="input-password"
                      className="bg-[hsl(200,18%,8%)] border-[hsl(174,40%,18%)] text-white placeholder:text-gray-500 focus:border-cyan-400 focus:ring-cyan-400/20"
                      {...form.register("password")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      data-testid="button-toggle-password"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-sm text-red-400">{form.formState.errors.password.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full h-12 font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
                  disabled={isLoading}
                  data-testid="button-submit-login"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <Separator className="my-6 bg-[hsl(174,40%,18%)]" />

              {/* Create New Account */}
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-3">Don't have an account?</p>
                <Button 
                  variant="outline"
                  className="w-full h-12 border-cyan-400 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300"
                  asChild
                  data-testid="button-create-account"
                >
                  <Link href="/signup">
                    Create New Account
                  </Link>
                </Button>
              </div>

              <Separator className="my-6 bg-[hsl(174,40%,18%)]" />

              {/* Security Notice */}
              <div className="rounded-lg p-4 border border-border bg-primary/5">
                <div className="flex items-start gap-2">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-foreground mb-1">100% Secure & Private</p>
                    <p className="text-muted-foreground">Your data is protected with enterprise-grade encryption.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="text-center mt-4">
              <p className="text-xs text-gray-500">
                Need help?{' '}
                <a 
                  href="mailto:support@partnerconnector.co.uk"
                  className="text-cyan-400 hover:text-cyan-300"
                  data-testid="link-support"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Benefits */}
        <div className="hidden lg:flex flex-1 items-center justify-center px-8 bg-card">
          <div className="max-w-md">
            <p className="text-cyan-400 text-sm font-medium tracking-wide uppercase mb-4">Partner Benefits</p>
            <h2 className="text-3xl font-bold mb-6 text-white">
              Your Partner Dashboard Awaits
            </h2>
            <p className="text-gray-500 mb-8">
              Access your earnings, track deals, and manage your growing partner network.
            </p>

            <div className="space-y-4">
              <div className="rocket-card p-4">
                <div className="flex items-start gap-3">
                  <div className="rocket-icon-box flex-shrink-0 !w-10 !h-10">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">60% Commission Rate</h3>
                    <p className="text-gray-500 text-sm">Earn industry-leading commissions on every successful deal</p>
                  </div>
                </div>
              </div>

              <div className="rocket-card p-4">
                <div className="flex items-start gap-3">
                  <div className="rocket-icon-box flex-shrink-0 !w-10 !h-10">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Build Your Team</h3>
                    <p className="text-gray-500 text-sm">Earn additional income from your team's successful connections</p>
                  </div>
                </div>
              </div>

              <div className="rocket-card p-4">
                <div className="flex items-start gap-3">
                  <div className="rocket-icon-box flex-shrink-0 !w-10 !h-10">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">Track Your Success</h3>
                    <p className="text-gray-500 text-sm">Real-time dashboard to monitor your earnings and performance</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-[hsl(174,40%,18%)]" />

            {/* Social Proof */}
            <div className="rocket-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: 'hsl(200, 15%, 20%)', borderColor: 'hsl(174, 40%, 20%)' }}></div>
                  <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: 'hsl(200, 15%, 20%)', borderColor: 'hsl(174, 40%, 20%)' }}></div>
                  <div className="w-8 h-8 rounded-full border-2" style={{ backgroundColor: 'hsl(200, 15%, 20%)', borderColor: 'hsl(174, 40%, 20%)' }}></div>
                </div>
                <span className="text-sm font-medium text-white">1,000+ Active Partners</span>
              </div>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                ))}
                <span className="text-sm ml-2 text-gray-400">4.9/5 Partner Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

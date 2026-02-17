import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  UserIcon,
  LockIcon,
  Loader2,
  Eye,
  EyeOff,
  StarIcon,
  Sparkles,
  Shield,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface SignupData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  password: string;
  confirmPassword: string;
  referralCode: string;
}

const steps = [
  { id: 'details', title: 'Your Details', icon: UserIcon, description: 'Tell us who you are' },
  { id: 'password', title: 'Secure Account', icon: LockIcon, description: 'Create your login' },
];

export default function SignupPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<SignupData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get('email');
    const nameParam = params.get('name');
    const refCode = params.get('ref');

    if (emailParam) {
      setFormData(prev => ({ ...prev, email: emailParam }));
      if (nameParam) {
        const nameParts = nameParam.split(' ');
        setFormData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || ''
        }));
      }
    }

    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
      // Persist referral code in localStorage for OAuth recovery
      localStorage.setItem('pendingReferralCode', refCode.toUpperCase());
    }
  }, []);

  const updateFormData = (field: keyof SignupData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          toast({ title: "Please enter a valid email address", variant: "destructive" });
          return false;
        }
        if (!formData.firstName || !formData.lastName) {
          toast({ title: "Please enter your full name", variant: "destructive" });
          return false;
        }
        break;
      case 1:
        if (!formData.password || formData.password.length < 8) {
          toast({ title: "Password must be at least 8 characters", variant: "destructive" });
          return false;
        }
        if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
          toast({ title: "Password must contain at least one letter and one number", variant: "destructive" });
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          toast({ title: "Passwords don't match", variant: "destructive" });
          return false;
        }
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        referralCode: formData.referralCode || undefined,
        onboardingCompleted: false, // Will complete profile later in-app
      };

      const response = await apiRequest('POST', '/api/auth/register', payload);
      const result = await response.json();

      if (result.success) {
        // Clear persisted referral code
        localStorage.removeItem('pendingReferralCode');

        toast({
          title: "Welcome to PartnerConnector! 🎉",
          description: "Your account has been created. Let's get you started!",
        });
        setLocation('/dashboard');
      }
    } catch (error: any) {
      const message = error.message || "Unable to create account";
      setErrorMessage(message);
      toast({
        title: "Registration failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6" onKeyDown={handleKeyPress}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Join PartnerConnector</h2>
              <p className="text-gray-400">Create your account in under 60 seconds</p>
            </div>

            {formData.referralCode && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
                <div className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5" style={{ color: '#00d4aa' }} />
                  <div>
                    <p className="text-sm text-gray-400">Joining with referral code</p>
                    <p className="text-lg font-bold font-mono" style={{ color: '#00d4aa' }}>{formData.referralCode}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Label className="text-gray-300">Email Address</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="mt-2 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">First Name</Label>
                <Input
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="mt-2 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg"
                />
              </div>
              <div>
                <Label className="text-gray-300">Last Name</Label>
                <Input
                  placeholder="Smith"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  className="mt-2 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Phone Number <span className="text-gray-500">(optional)</span></Label>
              <Input
                type="tel"
                placeholder="+44 7XXX XXX XXX"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                className="mt-2 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg"
              />
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6" onKeyDown={handleKeyPress}>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Secure Your Account</h2>
              <p className="text-gray-400">Create a password to protect your account</p>
            </div>

            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                <p className="text-red-400 text-sm">{errorMessage}</p>
              </div>
            )}

            <div>
              <Label className="text-gray-300">Password</Label>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">At least 8 characters with a letter and number</p>
            </div>
            <div>
              <Label className="text-gray-300">Confirm Password</Label>
              <div className="relative mt-2">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                  className="h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { icon: Shield, label: 'Secure & encrypted' },
                { icon: TrendingUp, label: 'Start earning today' },
                { icon: Sparkles, label: 'Free to join' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl text-center"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <item.icon className="w-4 h-4 text-[#00d4aa]" />
                  <span className="text-xs text-gray-400 leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a1014' }}>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(10, 16, 20, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-xl font-bold text-white tracking-tight">
                  PARTNER<span style={{ color: '#00d4aa' }}>•</span>
                </span>
              </div>
            </Link>
            <Link href="/login" className="text-gray-400 hover:text-white text-sm">
              Already have an account?
            </Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${i <= currentStep
                        ? 'bg-[#00d4aa] text-[#0a1014]'
                        : 'bg-white/10 text-gray-500'
                      }`}
                  >
                    {i < currentStep ? (
                      <CheckIcon className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className="w-16 sm:w-24 h-0.5 mx-2"
                      style={{ backgroundColor: i < currentStep ? '#00d4aa' : 'rgba(255,255,255,0.1)' }}
                    />
                  )}
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-1 bg-white/10" />
          </div>

          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-between mt-8 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="text-gray-400 hover:text-white hover:bg-white/5"
              >
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLoading}
                className="px-8 py-6 font-bold rounded-full"
                style={{ backgroundColor: '#00d4aa', color: '#0a1014' }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating account...
                  </>
                ) : currentStep === steps.length - 1 ? (
                  <>
                    Create Account
                    <CheckIcon className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="text-[#00d4aa] hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link href="/privacy" className="text-[#00d4aa] hover:underline">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckIcon,
  UserIcon,
  BriefcaseIcon,
  UsersIcon,
  TargetIcon,
  LockIcon,
  Loader2,
  Eye,
  EyeOff,
  StarIcon
} from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

interface OnboardingData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  profession: string;
  experience: string;
  currentRole: string;
  companyName: string;
  networkSize: string;
  dealsExperience: string;
  monthlyEarningsGoal: string;
  timeCommitment: string;
  primaryInterest: string[];
  password: string;
  confirmPassword: string;
  referralCode: string;
}

const steps = [
  { id: 'email', title: 'Get Started', icon: StarIcon, description: 'Enter your email to begin' },
  { id: 'name', title: 'Your Name', icon: UserIcon, description: 'Tell us who you are' },
  { id: 'professional', title: 'Your Background', icon: BriefcaseIcon, description: 'Professional experience' },
  { id: 'network', title: 'Your Network', icon: UsersIcon, description: 'About your connections' },
  { id: 'goals', title: 'Your Goals', icon: TargetIcon, description: 'What you want to achieve' },
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
  
  const [formData, setFormData] = useState<OnboardingData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    profession: '',
    experience: '',
    currentRole: '',
    companyName: '',
    networkSize: '',
    dealsExperience: '',
    monthlyEarningsGoal: '',
    timeCommitment: '',
    primaryInterest: [],
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
        setCurrentStep(2);
      } else {
        setCurrentStep(1);
      }
    }
    
    if (refCode) {
      setFormData(prev => ({ ...prev, referralCode: refCode.toUpperCase() }));
    }
  }, []);

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handleArrayUpdate = (field: keyof OnboardingData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 0:
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
          toast({ title: "Please enter a valid email address", variant: "destructive" });
          return false;
        }
        break;
      case 1:
        if (!formData.firstName || !formData.lastName) {
          toast({ title: "Please enter your full name", variant: "destructive" });
          return false;
        }
        break;
      case 2:
        if (!formData.profession || !formData.experience) {
          toast({ title: "Please complete your professional background", variant: "destructive" });
          return false;
        }
        break;
      case 3:
        if (!formData.networkSize) {
          toast({ title: "Please tell us about your network", variant: "destructive" });
          return false;
        }
        break;
      case 4:
        if (!formData.monthlyEarningsGoal || formData.primaryInterest.length === 0) {
          toast({ title: "Please complete your goals", variant: "destructive" });
          return false;
        }
        break;
      case 5:
        if (!formData.password || formData.password.length < 8) {
          toast({ title: "Password must be at least 8 characters", variant: "destructive" });
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

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        profession: formData.profession,
        experience: formData.experience,
        currentRole: formData.currentRole,
        companyName: formData.companyName,
        networkSize: formData.networkSize,
        dealsExperience: formData.dealsExperience,
        monthlyEarningsGoal: formData.monthlyEarningsGoal,
        timeCommitment: formData.timeCommitment,
        primaryInterest: formData.primaryInterest,
        referralCode: formData.referralCode || undefined,
        onboardingCompleted: true,
      };

      const response = await apiRequest('POST', '/api/auth/register', payload);
      const result = await response.json();

      if (result.success) {
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
  const CurrentIcon = steps[currentStep].icon;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Let's Get Started</h2>
              <p className="text-gray-400">Enter your email to begin your partner journey</p>
            </div>
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
            {formData.referralCode && (
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.3)' }}>
                <p className="text-sm text-gray-400 mb-1">Joining with referral code</p>
                <p className="text-xl font-bold font-mono" style={{ color: '#00d4aa' }}>{formData.referralCode}</p>
              </div>
            )}
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">What's Your Name?</h2>
              <p className="text-gray-400">We'd love to know who we're working with</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-gray-300">First Name</Label>
                <Input
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  className="mt-2 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500 text-lg"
                  autoFocus
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
              <Label className="text-gray-300">Phone Number (Optional)</Label>
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

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Your Background</h2>
              <p className="text-gray-400">Tell us about your professional experience</p>
            </div>
            <div>
              <Label className="text-gray-300">What's your profession?</Label>
              <Select value={formData.profession} onValueChange={(v) => updateFormData('profession', v)}>
                <SelectTrigger className="mt-2 h-14 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select your profession" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="accountant">Accountant</SelectItem>
                  <SelectItem value="business-consultant">Business Consultant</SelectItem>
                  <SelectItem value="financial-advisor">Financial Advisor</SelectItem>
                  <SelectItem value="mortgage-broker">Mortgage Broker</SelectItem>
                  <SelectItem value="insurance-broker">Insurance Broker</SelectItem>
                  <SelectItem value="business-coach">Business Coach</SelectItem>
                  <SelectItem value="sales-professional">Sales Professional</SelectItem>
                  <SelectItem value="business-owner">Business Owner</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Years of experience</Label>
              <Select value={formData.experience} onValueChange={(v) => updateFormData('experience', v)}>
                <SelectTrigger className="mt-2 h-14 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-2">0-2 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="6-10">6-10 years</SelectItem>
                  <SelectItem value="11-15">11-15 years</SelectItem>
                  <SelectItem value="16+">16+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Company Name (Optional)</Label>
              <Input
                placeholder="Your company"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                className="mt-2 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-500"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Your Network</h2>
              <p className="text-gray-400">Help us understand your business connections</p>
            </div>
            <div>
              <Label className="text-gray-300">How many business contacts do you have?</Label>
              <Select value={formData.networkSize} onValueChange={(v) => updateFormData('networkSize', v)}>
                <SelectTrigger className="mt-2 h-14 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select network size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-10">1-10 contacts</SelectItem>
                  <SelectItem value="11-50">11-50 contacts</SelectItem>
                  <SelectItem value="51-100">51-100 contacts</SelectItem>
                  <SelectItem value="100+">100+ contacts</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300">Experience with business referrals?</Label>
              <Select value={formData.dealsExperience} onValueChange={(v) => updateFormData('dealsExperience', v)}>
                <SelectTrigger className="mt-2 h-14 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No previous experience</SelectItem>
                  <SelectItem value="some">Made a few referrals</SelectItem>
                  <SelectItem value="regular">Regular referral activity</SelectItem>
                  <SelectItem value="expert">Referrals are core to my business</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-3">Your Goals</h2>
              <p className="text-gray-400">What do you want to achieve with us?</p>
            </div>
            <div>
              <Label className="text-gray-300">Monthly earnings goal</Label>
              <Select value={formData.monthlyEarningsGoal} onValueChange={(v) => updateFormData('monthlyEarningsGoal', v)}>
                <SelectTrigger className="mt-2 h-14 bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Select your goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1000">£500 - £1,000</SelectItem>
                  <SelectItem value="1000-2500">£1,000 - £2,500</SelectItem>
                  <SelectItem value="2500-5000">£2,500 - £5,000</SelectItem>
                  <SelectItem value="5000+">£5,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-300 mb-4 block">What interests you most? (Select all that apply)</Label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { value: 'commissions', label: 'Earning commissions on referrals' },
                  { value: 'team', label: 'Building a team of partners' },
                  { value: 'clients', label: 'Helping clients access funding' },
                  { value: 'passive', label: 'Creating passive income' },
                ].map((item) => (
                  <label
                    key={item.value}
                    className="flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all"
                    style={{
                      backgroundColor: formData.primaryInterest.includes(item.value) ? 'rgba(0,212,170,0.15)' : 'rgba(255,255,255,0.03)',
                      border: formData.primaryInterest.includes(item.value) ? '1px solid rgba(0,212,170,0.5)' : '1px solid rgba(255,255,255,0.08)'
                    }}
                  >
                    <Checkbox
                      checked={formData.primaryInterest.includes(item.value)}
                      onCheckedChange={(checked) => handleArrayUpdate('primaryInterest', item.value, checked as boolean)}
                      className="border-white/30 data-[state=checked]:bg-[#00d4aa] data-[state=checked]:border-[#00d4aa]"
                    />
                    <span className="text-white">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
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
              <p className="text-xs text-gray-500 mt-2">Must be at least 8 characters</p>
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

            <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)' }}>
              <div className="flex items-start gap-3">
                <CheckIcon className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-white font-medium text-sm">Ready to start earning</p>
                  <p className="text-gray-400 text-xs mt-1">Click below to create your account and access your dashboard</p>
                </div>
              </div>
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
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                      i <= currentStep 
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
                      className="w-8 sm:w-12 h-0.5 mx-1"
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

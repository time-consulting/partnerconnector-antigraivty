import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, CreditCard, Clock, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface QuickSetupData {
  firstName: string;
  lastName: string;
  phone: string;
  companyName: string;
  hasNoCompany: boolean;
  role: string;
  country: string;
}

interface QuickSetupProps {
  onComplete: (data: QuickSetupData) => void;
  onDefer?: () => void;
  initialData?: Partial<QuickSetupData>;
}

interface FieldState {
  value: string;
  saved: boolean;
  saving: boolean;
  error?: string;
}

const ROLE_OPTIONS = [
  { value: "accountant", label: "Accountant" },
  { value: "consultant", label: "Consultant" },
  { value: "advisor", label: "Advisor" },
  { value: "other", label: "Other" }
];

const COUNTRY_OPTIONS = [
  { value: "gb", label: "United Kingdom" },
  { value: "us", label: "United States" },
  { value: "ca", label: "Canada" },
  { value: "au", label: "Australia" },
  { value: "ie", label: "Ireland" },
  { value: "other", label: "Other" }
];

export default function QuickSetup({ onComplete, onDefer, initialData }: QuickSetupProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showPayoutBanner, setShowPayoutBanner] = useState(true);
  
  const [formData, setFormData] = useState<QuickSetupData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    phone: initialData?.phone || "",
    companyName: initialData?.companyName || "",
    hasNoCompany: initialData?.hasNoCompany || false,
    role: initialData?.role || "",
    country: initialData?.country || "gb",
  });

  const [fieldStates, setFieldStates] = useState<Record<string, FieldState>>({
    firstName: { value: "", saved: false, saving: false },
    lastName: { value: "", saved: false, saving: false },
    phone: { value: "", saved: false, saving: false },
    companyName: { value: "", saved: false, saving: false },
    role: { value: "", saved: false, saving: false },
    country: { value: "", saved: false, saving: false },
  });

  // Auto-save mutation
  const saveFieldMutation = useMutation({
    mutationFn: async ({ field, value }: { field: string; value: string }) => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const response = await fetch(`/api/auth/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ [field]: value })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save field');
      }
      
      return response.json();
    },
    onSuccess: (_, { field }) => {
      setFieldStates(prev => ({
        ...prev,
        [field]: { ...prev[field], saved: true, saving: false, error: undefined }
      }));
      
      // Auto-hide saved indicator after 2 seconds
      setTimeout(() => {
        setFieldStates(prev => ({
          ...prev,
          [field]: { ...prev[field], saved: false }
        }));
      }, 2000);
    },
    onError: (error, { field }) => {
      setFieldStates(prev => ({
        ...prev,
        [field]: { ...prev[field], saving: false, error: 'Save failed' }
      }));
    }
  });

  // Save complete profile mutation with backend analytics
  const saveProfileMutation = useMutation({
    mutationFn: async (data: QuickSetupData) => {
      // First save the profile data
      const profileResponse = await fetch(`/api/auth/user`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          company: data.hasNoCompany ? null : data.companyName,
          profession: data.role,
          country: data.country,
          profileCompleted: true
        })
      });
      
      if (!profileResponse.ok) {
        throw new Error('Failed to save profile');
      }
      
      // Then track the profile completion analytics
      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'profile_completed',
            data: { currentXp: 0 } // Will be added to in backend
          })
        });
      } catch (analyticsError) {
        console.warn('Analytics tracking failed:', analyticsError);
      }
      
      return profileResponse.json();
    },
    onSuccess: () => {
      // Invalidate user query to refresh data including new XP
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Track completion locally for immediate UI updates
      localStorage.setItem('profile_submitted', Date.now().toString());
      
      // Show exact toast copy from specification
      toast({
        title: "Nice—profile set! +25 XP",
        description: "Let's show you around the platform.",
      });
      
      onComplete(formData);
    }
  });

  const handleBlur = useCallback((field: keyof QuickSetupData, value: string) => {
    if (!value.trim()) return;
    
    setFieldStates(prev => ({
      ...prev,
      [field]: { ...prev[field], saving: true, saved: false }
    }));
    
    saveFieldMutation.mutate({ field, value });
  }, [saveFieldMutation]);

  const updateField = (field: keyof QuickSetupData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldStates(prev => ({
      ...prev,
      [field]: { ...prev[field], value: value.toString() }
    }));
  };

  const isFormValid = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.phone.trim();
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      toast({
        title: "Please complete required fields",
        description: "First name, last name, and phone are required.",
        variant: "destructive",
      });
      return;
    }

    saveProfileMutation.mutate(formData);
  };

  const handlePayoutLater = () => {
    setShowPayoutBanner(false);
    if (onDefer) onDefer();
  };

  return (
    <div className="max-w-2xl mx-auto p-6" data-testid="quick-setup">
      <Card className="shadow-2xl border-0 bg-white dark:bg-gray-900 backdrop-blur-sm">
        <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-t-lg">
          <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome to PartnerConnector
          </CardTitle>
          <p className="text-gray-700 dark:text-gray-300 mt-2">
            Let's get your account set up in just a few steps. This will help us personalize your experience.
          </p>
        </CardHeader>

        <CardContent className="space-y-6 bg-white dark:bg-gray-900 p-8">
          {/* Main Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Required Fields */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-sm font-semibold text-gray-900 dark:text-white">
                  First Name *
                </Label>
                <div className="relative">
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    onBlur={(e) => handleBlur('firstName', e.target.value)}
                    placeholder="Enter your first name"
                    className="pr-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    data-testid="input-first-name"
                  />
                  {fieldStates.firstName?.saving && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                  {fieldStates.firstName?.saved && (
                    <div className="absolute right-2 top-2 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Last Name *
                </Label>
                <div className="relative">
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    onBlur={(e) => handleBlur('lastName', e.target.value)}
                    placeholder="Enter your last name"
                    className="pr-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    data-testid="input-last-name"
                  />
                  {fieldStates.lastName?.saving && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                  {fieldStates.lastName?.saved && (
                    <div className="absolute right-2 top-2 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="phone" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Phone *
                </Label>
                <div className="relative">
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    onBlur={(e) => handleBlur('phone', e.target.value)}
                    placeholder="+44 7XXX XXX XXX"
                    className="pr-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    data-testid="input-phone"
                  />
                  {fieldStates.phone?.saving && (
                    <div className="absolute right-2 top-2">
                      <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full" />
                    </div>
                  )}
                  {fieldStates.phone?.saved && (
                    <div className="absolute right-2 top-2 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Optional Fields */}
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="companyName" className="text-sm font-semibold text-gray-900 dark:text-white">
                  Company Name <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                </Label>
                <div className="relative">
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) => updateField('companyName', e.target.value)}
                    onBlur={(e) => handleBlur('companyName', e.target.value)}
                    placeholder="Your company name"
                    disabled={formData.hasNoCompany}
                    className="pr-10 h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500"
                    data-testid="input-company-name"
                  />
                  {fieldStates.companyName?.saved && (
                    <div className="absolute right-2 top-2 text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-3">
                  <Checkbox
                    id="hasNoCompany"
                    checked={formData.hasNoCompany}
                    onCheckedChange={(checked) => {
                      updateField('hasNoCompany', !!checked);
                      if (checked) updateField('companyName', '');
                    }}
                    data-testid="checkbox-no-company"
                    className="border-gray-300 dark:border-gray-600"
                  />
                  <Label htmlFor="hasNoCompany" className="text-sm text-gray-600 dark:text-gray-400">
                    I don't have a company yet
                  </Label>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Role <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                </Label>
                <div className="flex flex-wrap gap-3">
                  {ROLE_OPTIONS.map((option) => (
                    <Badge
                      key={option.value}
                      variant={formData.role === option.value ? "default" : "outline"}
                      className={`cursor-pointer transition-all duration-200 py-2 px-4 text-sm font-medium ${
                        formData.role === option.value
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:border-blue-300"
                      }`}
                      onClick={() => {
                        updateField('role', option.value);
                        handleBlur('role', option.value);
                      }}
                      data-testid={`badge-role-${option.value}`}
                    >
                      {option.label}
                    </Badge>
                  ))}
                </div>
                {fieldStates.role?.saved && (
                  <div className="flex items-center text-green-600 text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Saved ✓
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Country <span className="text-gray-500 dark:text-gray-400">(optional)</span>
                </Label>
                <Select 
                  value={formData.country} 
                  onValueChange={(value) => {
                    updateField('country', value);
                    handleBlur('country', value);
                  }}
                >
                  <SelectTrigger 
                    data-testid="select-country"
                    className="h-12 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-blue-500"
                  >
                    <SelectValue placeholder="Select your country" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                    {COUNTRY_OPTIONS.map((option) => (
                      <SelectItem 
                        key={option.value} 
                        value={option.value}
                        className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldStates.country?.saved && (
                  <div className="flex items-center text-green-600 text-xs">
                    <Check className="h-3 w-3 mr-1" />
                    Saved ✓
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Payout Banner */}
          {showPayoutBanner && (
            <Alert className="border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 dark:border-amber-700">
              <CreditCard className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  💰 Add payout details to get paid faster when deals convert.
                </span>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 px-4 text-sm font-medium border-amber-300 text-amber-700 hover:bg-amber-100 dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/40"
                    data-testid="button-add-payout"
                  >
                    Add now
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handlePayoutLater}
                    className="h-8 px-4 text-sm font-medium text-amber-600 hover:bg-amber-100 dark:text-amber-400 dark:hover:bg-amber-900/40"
                    data-testid="button-payout-later"
                  >
                    Later
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid() || saveProfileMutation.isPending}
              className="w-full md:w-auto px-12 py-3 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="button-save-continue"
            >
              {saveProfileMutation.isPending ? (
                <div className="flex items-center gap-3">
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                  Setting up your account...
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5" />
                  Complete Setup & Continue
                </div>
              )}
            </Button>
          </div>

          {/* Progress indicator */}
          <div className="text-center pt-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {isFormValid() ? (
                <span className="text-green-600 dark:text-green-400">
                  ✓ Ready to complete setup
                </span>
              ) : (
                'Complete the required fields above to continue'
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper hook for managing quick setup state
export function useQuickSetup() {
  const [setupCompleted, setSetupCompleted] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    const profileSubmitted = localStorage.getItem('profile_submitted');
    setSetupCompleted(!!profileSubmitted);
    
    // Show setup for new users who haven't completed profile
    setShowSetup(!profileSubmitted);
  }, []);

  const completeSetup = () => {
    setShowSetup(false);
    setSetupCompleted(true);
  };

  return {
    setupCompleted,
    showSetup,
    completeSetup,
  };
}
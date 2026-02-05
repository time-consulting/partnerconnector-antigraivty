import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/offline-api"; // Use offline-aware API
import { useOfflineSync } from "@/lib/offline-sync";
import SyncStatus from "@/components/sync-status";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { 
  ArrowLeftIcon, 
  CheckCircle2, 
  Mic, 
  MicOff,
  Sparkles,
  ZapIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  BuildingIcon,
  StickyNoteIcon,
  WifiOffIcon
} from "lucide-react";

// Mobile detection utility
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  
  // Check viewport width
  const isMobileWidth = window.innerWidth <= 768;
  
  // Check user agent
  const userAgent = navigator.userAgent || navigator.vendor;
  const isMobileUA = /android/i.test(userAgent) || 
                     /webOS/i.test(userAgent) || 
                     /iPhone/i.test(userAgent) || 
                     /iPad/i.test(userAgent) || 
                     /iPod/i.test(userAgent) ||
                     /BlackBerry/i.test(userAgent) ||
                     /Windows Phone/i.test(userAgent);
  
  return isMobileWidth || isMobileUA;
};

// Voice recognition hook (browser API)
const useVoiceRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(prev => prev + finalTranscript);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return { isListening, transcript, isSupported, startListening, stopListening, clearTranscript };
};

export default function QuickAddReferral() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isOnline, pendingCount } = useOfflineSync();
  const [, setLocation] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // Fetch business types to get a default one
  const { data: businessTypes } = useQuery<any[]>({
    queryKey: ["/api/business-types"],
    enabled: isAuthenticated,
  });

  // Form state
  const [formData, setFormData] = useState({
    businessName: "",
    contactName: "",
    businessPhone: "",
    businessEmail: "",
    notes: ""
  });

  // Voice recognition for notes
  const { isListening, transcript, isSupported, startListening, stopListening, clearTranscript } = useVoiceRecognition();

  // Auto-save to localStorage
  useEffect(() => {
    const savedData = localStorage.getItem("quickReferralDraft");
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to parse saved draft");
      }
    }
  }, []);

  useEffect(() => {
    // Save draft to localStorage on every change (debounced)
    const timeoutId = setTimeout(() => {
      if (formData.businessName || formData.contactName || formData.businessPhone) {
        localStorage.setItem("quickReferralDraft", JSON.stringify(formData));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Update notes with voice transcript
  useEffect(() => {
    if (transcript) {
      setFormData(prev => ({
        ...prev,
        notes: prev.notes + " " + transcript
      }));
      clearTranscript();
    }
  }, [transcript]);

  // Redirect non-mobile users
  useEffect(() => {
    if (!isLoading && !isMobileDevice()) {
      toast({
        title: "Mobile Only",
        description: "This quick form is optimized for mobile. Redirecting to full form...",
      });
      setTimeout(() => {
        setLocation("/submit-deal");
      }, 2000);
    }
  }, [isLoading, toast, setLocation]);

  // Auth check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Please login",
        description: "You need to be logged in to submit deals.",
        variant: "destructive",
      });
      setTimeout(() => {
        setLocation("/login");
      }, 1500);
    }
  }, [isAuthenticated, isLoading, toast, setLocation]);

  const submitDealMutation = useMutation({
    mutationFn: async (data: any) => {
      // Use the first business type as default, or create a fallback
      const defaultBusinessTypeId = businessTypes?.[0]?.id || "general";
      
      const response = await apiRequest("POST", "/api/deals", {
        ...data,
        businessTypeId: defaultBusinessTypeId,
        businessEmail: data.businessEmail || `${data.businessPhone}@placeholder.com`, // Email is required by API
        status: "pending",
        gdprConsent: true,
        quickAdd: true // Flag to indicate this was a quick add
      });
      return response.json();
    },
    onSuccess: (data: any, variables: any, context: any) => {
      // Clear saved draft
      localStorage.removeItem("quickReferralDraft");
      
      setShowSuccess(true);
      
      // Different message for offline vs online submission
      if (!isOnline) {
        toast({
          title: "📱 Lead Saved Offline!",
          description: "Will sync automatically when connection is restored.",
        });
      } else {
        toast({
          title: "🎉 Lead Captured!",
          description: "Referral submitted successfully.",
        });
      }

      // Redirect to dashboard after animation
      setTimeout(() => {
        setLocation("/dashboard");
      }, 2500);
    },
    onError: (error: any) => {
      // Check if it was queued offline (which appears as success in our offline API)
      if (!isOnline) {
        // Clear saved draft since it was queued
        localStorage.removeItem("quickReferralDraft");
        setShowSuccess(true);
        toast({
          title: "📱 Saved for Later",
          description: "Your lead will be submitted when you're back online.",
        });
        setTimeout(() => {
          setLocation("/dashboard");
        }, 2500);
      } else {
        toast({
          title: "Error",
          description: "Failed to submit. Your draft is saved.",
          variant: "destructive",
        });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.businessName || !formData.contactName || !formData.businessPhone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    submitDealMutation.mutate(formData);
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Calculate progress
  const progress = (currentStep / totalSteps) * 100;

  if (isLoading || !isMobileDevice()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-green-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Success animation screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="text-center"
        >
          <div className="relative">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="absolute -top-4 -right-4"
            >
              <Sparkles className="w-8 h-8 text-yellow-500" />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-4 -left-4"
            >
              <Sparkles className="w-6 h-6 text-blue-500" />
            </motion.div>
            
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle2 className="w-12 h-12 text-white" />
            </motion.div>
          </div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-900 mb-2"
          >
            Lead Captured!
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600"
          >
            Redirecting to dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-green-50">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            onClick={() => setLocation("/dashboard")}
            className="p-2 -m-2"
            data-testid="button-back"
          >
            <ArrowLeftIcon className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex items-center space-x-2">
            <ZapIcon className="w-5 h-5 text-teal-600" />
            <span className="font-semibold text-gray-900">Quick Add Lead</span>
          </div>
          {/* Offline/Online Status Indicator */}
          <SyncStatus compact />
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <motion.div 
            className="h-full bg-gradient-to-r from-teal-500 to-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex flex-col min-h-[calc(100vh-60px)]">
        <div className="flex-1 px-4 py-6 pb-24 space-y-4">
          {/* Step Indicator */}
          <div className="text-center mb-6">
            <p className="text-sm text-gray-500 mb-1">Step {currentStep} of {totalSteps}</p>
            <h2 className="text-2xl font-bold text-gray-900">
              {currentStep === 1 && "Business Details"}
              {currentStep === 2 && "Contact Info"}
              {currentStep === 3 && "Additional Notes"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Business Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <Card className="p-4 border-2 border-teal-100 rounded-2xl">
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                    <BuildingIcon className="w-4 h-4 text-teal-600" />
                    <span>Business Name *</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.businessName}
                    onChange={(e) => updateFormData("businessName", e.target.value)}
                    placeholder="e.g., Joe's Coffee Shop"
                    className="h-14 text-lg rounded-xl"
                    required
                    autoFocus
                    data-testid="input-business-name"
                  />
                </Card>

                <Card className="p-4 border-2 border-teal-100 rounded-2xl">
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="w-4 h-4 text-teal-600" />
                    <span>Contact Name *</span>
                  </label>
                  <Input
                    type="text"
                    value={formData.contactName}
                    onChange={(e) => updateFormData("contactName", e.target.value)}
                    placeholder="e.g., John Smith"
                    className="h-14 text-lg rounded-xl"
                    required
                    data-testid="input-contact-name"
                  />
                </Card>

                <Button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  disabled={!formData.businessName || !formData.contactName}
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 rounded-xl"
                  data-testid="button-next-step1"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2: Contact Info */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <Card className="p-4 border-2 border-teal-100 rounded-2xl">
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                    <PhoneIcon className="w-4 h-4 text-teal-600" />
                    <span>Phone Number *</span>
                  </label>
                  <Input
                    type="tel"
                    value={formData.businessPhone}
                    onChange={(e) => updateFormData("businessPhone", e.target.value)}
                    placeholder="07123 456789"
                    className="h-14 text-lg rounded-xl"
                    required
                    autoFocus
                    data-testid="input-phone"
                  />
                </Card>

                <Card className="p-4 border-2 border-gray-100 rounded-2xl">
                  <label className="flex items-center space-x-3 text-sm font-medium text-gray-700 mb-2">
                    <MailIcon className="w-4 h-4 text-gray-500" />
                    <span>Email (Optional)</span>
                  </label>
                  <Input
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => updateFormData("businessEmail", e.target.value)}
                    placeholder="email@business.com"
                    className="h-14 text-lg rounded-xl"
                    data-testid="input-email"
                  />
                </Card>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    variant="outline"
                    className="flex-1 h-14 text-lg rounded-xl"
                    data-testid="button-back-step2"
                  >
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    disabled={!formData.businessPhone}
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 rounded-xl"
                    data-testid="button-next-step2"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Additional Notes */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="space-y-4"
              >
                <Card className="p-4 border-2 border-gray-100 rounded-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                      <StickyNoteIcon className="w-4 h-4 text-gray-500" />
                      <span>Quick Notes (Optional)</span>
                    </label>
                    {isSupported && (
                      <Button
                        type="button"
                        onClick={toggleVoiceRecording}
                        size="sm"
                        variant={isListening ? "destructive" : "outline"}
                        className="rounded-xl"
                        data-testid="button-voice"
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4 mr-2" />
                            Stop
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4 mr-2" />
                            Voice
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    placeholder="Any important details about this lead..."
                    className="min-h-32 text-lg rounded-xl resize-none"
                    data-testid="textarea-notes"
                  />
                  {isListening && (
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-75"></span>
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse delay-150"></span>
                      </div>
                      <span className="text-sm text-gray-500">Listening...</span>
                    </div>
                  )}
                </Card>

                <div className="flex space-x-3">
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    variant="outline"
                    className="flex-1 h-14 text-lg rounded-xl"
                    data-testid="button-back-step3"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitDealMutation.isPending}
                    className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 rounded-xl"
                    data-testid="button-submit"
                  >
                    {submitDealMutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Submitting...
                      </div>
                    ) : (
                      "Submit Lead"
                    )}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Draft saved indicator */}
          {(formData.businessName || formData.contactName) && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-gray-500 mt-4"
            >
              ✓ Draft auto-saved
            </motion.p>
          )}
        </div>

        {/* Sticky Bottom Submit (Alternative for single-step form) */}
        {/* Uncomment this section if you want a single-page form instead of steps */}
        {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <Button
            type="submit"
            disabled={!formData.businessName || !formData.contactName || !formData.businessPhone || submitDealMutation.isPending}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 rounded-xl"
            data-testid="button-submit-sticky"
          >
            {submitDealMutation.isPending ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Submitting...
              </div>
            ) : (
              <>
                <ZapIcon className="w-5 h-5 mr-2" />
                Submit Lead
              </>
            )}
          </Button>
        </div> */}
      </form>
    </div>
  );
}
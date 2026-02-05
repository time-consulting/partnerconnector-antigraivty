import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { X, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface TourStep {
  id: string;
  message: string;
  element?: string; // CSS selector for highlighting
  targetArea?: string; // Main area to navigate to and highlight
  pillPosition?: {
    bottom?: string;
    left?: string;
    right?: string;
    top?: string;
  };
}

interface PopupPillTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  onDismiss?: () => void;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "welcome",
    message: "Welcome! 20-second tour of your new hub.",
    targetArea: "[data-testid='text-welcome']",
    element: "[data-testid='text-welcome']",
    pillPosition: { bottom: "24px", left: "24px" }
  },
  {
    id: "pipeline",
    message: "Your pipeline at a glance. Update deals fast.",
    targetArea: "[data-testid='card-deals-submitted']",
    element: "[data-testid='card-deals-submitted'], [data-testid='card-commission-pending'], [data-testid='card-deals-made'], [data-testid='card-monthly-earnings']",
    pillPosition: { bottom: "24px", left: "24px" }
  },
  {
    id: "submit-lead",
    message: "Submit a new lead in under a minute.",
    targetArea: "[data-testid='card-submit-deal']",
    element: "[data-testid='card-submit-deal']",
    pillPosition: { bottom: "24px", left: "24px" }
  },
  {
    id: "track-commissions",
    message: "Track commissions + tiers. Silver is 5 wins/month.",
    targetArea: "[data-testid='card-bonus-progress']",
    element: "[data-testid='card-bonus-progress'], [data-testid='card-commission-pending']",
    pillPosition: { bottom: "24px", left: "24px" }
  },
  {
    id: "invite-teammates",
    message: "Invite teammates—earn up to 3 levels down.",
    targetArea: "[data-testid='card-add-team-member']",
    element: "[data-testid='card-add-team-member'], [data-testid='button-add-team-member']",
    pillPosition: { bottom: "24px", left: "24px" }
  }
];

export default function PopupPillTour({ isVisible, onComplete, onSkip, onDismiss }: PopupPillTourProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [startTime] = useState(Date.now());

  // Analytics tracking mutations
  const trackAnalyticsMutation = useMutation({
    mutationFn: async ({ event, data }: { event: string, data?: any }) => {
      try {
        return await apiRequest('POST', `/api/analytics/track`, { event, data });
      } catch (error) {
        console.warn('Analytics tracking failed:', error);
        // Don't throw error to avoid breaking tour functionality
        return null;
      }
    },
    onError: (error) => {
      console.warn('Analytics tracking failed:', error);
    }
  });

  useEffect(() => {
    // Track tour start with backend
    if (isVisible && currentStep === 0) {
      trackAnalyticsMutation.mutate({ event: 'tour_started' });
      // Also keep localStorage for immediate state management
      localStorage.setItem('tour_started', Date.now().toString());
    }
  }, [isVisible, currentStep]);

  // Smooth scroll to target element
  const scrollToElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  };

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      const nextStepData = TOUR_STEPS[nextStep];
      
      setIsAnimating(true);
      
      // Navigate to target area with smooth scrolling
      if (nextStepData.targetArea) {
        scrollToElement(nextStepData.targetArea);
      }
      
      setTimeout(() => {
        setCurrentStep(nextStep);
        setIsAnimating(false);
      }, 300);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      const prevStepData = TOUR_STEPS[prevStep];
      
      setIsAnimating(true);
      
      // Navigate to previous target area with smooth scrolling
      if (prevStepData.targetArea) {
        scrollToElement(prevStepData.targetArea);
      }
      
      setTimeout(() => {
        setCurrentStep(prevStep);
        setIsAnimating(false);
      }, 300);
    }
  };

  const handleFinish = () => {
    const tourDuration = Date.now() - startTime;
    
    // Track completion with backend
    trackAnalyticsMutation.mutate({ 
      event: 'tour_completed', 
      data: { duration: tourDuration }
    });
    
    // Track completion locally
    localStorage.setItem('tour_completed', Date.now().toString());
    localStorage.setItem('tour_duration', tourDuration.toString());
    
    // Invalidate user query to refresh XP and analytics
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    
    toast({
      title: "Tour complete! 🎯",
      description: "You're ready to start earning commissions.",
    });
    
    onComplete();
  };

  const handleSkip = () => {
    // Track skip action with backend
    trackAnalyticsMutation.mutate({ event: 'tour_skipped' });
    
    // Track skip locally
    localStorage.setItem('tour_skipped', Date.now().toString());
    
    // Invalidate user query to refresh analytics
    queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
    
    toast({
      title: "Tour skipped",
      description: "Find 'Quick tour' in the help menu anytime.",
    });
    
    onSkip();
  };

  const handleDismiss = () => {
    if (onDismiss) {
      onDismiss();
    } else {
      handleSkip();
    }
  };

  if (!isVisible) return null;

  const step = TOUR_STEPS[currentStep];
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100;
  const isLastStep = currentStep === TOUR_STEPS.length - 1;

  return (
    <>
      {/* Enhanced highlight overlay for current element */}
      {step.element && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <style>{`
            ${step.element} {
              position: relative;
              z-index: 41;
              transition: all 0.3s ease-in-out;
            }
            ${step.element}::after {
              content: '';
              position: absolute;
              inset: -4px;
              border: 3px solid #3b82f6;
              border-radius: 12px;
              background: rgba(59, 130, 246, 0.08);
              pointer-events: none;
              animation: tourHighlight 2.5s ease-in-out infinite;
              box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
            }
            ${step.element}::before {
              content: '';
              position: absolute;
              inset: -8px;
              border: 1px solid rgba(59, 130, 246, 0.2);
              border-radius: 16px;
              pointer-events: none;
              animation: tourHighlightOuter 2.5s ease-in-out infinite;
            }
            @keyframes tourHighlight {
              0%, 100% { 
                opacity: 1;
                transform: scale(1);
                border-color: #3b82f6;
              }
              50% { 
                opacity: 0.7;
                transform: scale(1.02);
                border-color: #60a5fa;
              }
            }
            @keyframes tourHighlightOuter {
              0%, 100% { 
                opacity: 0.3;
                transform: scale(1);
              }
              50% { 
                opacity: 0.1;
                transform: scale(1.01);
              }
            }
          `}</style>
        </div>
      )}

      {/* Tour Pill - Dynamic positioning */}
      <div 
        className="fixed z-50 max-w-sm" 
        style={{
          bottom: step.pillPosition?.bottom || '24px',
          left: step.pillPosition?.left || '24px',
          right: step.pillPosition?.right || 'auto',
          top: step.pillPosition?.top || 'auto',
        }}
        data-testid="popup-pill-tour"
      >
        <Card className={`bg-white shadow-2xl border-2 border-blue-200 transition-all duration-300 ${
          isAnimating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
        } hover:shadow-3xl`}>
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-blue-600">
                  {currentStep + 1} of {TOUR_STEPS.length}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
                data-testid="button-dismiss-tour"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Progress Bar */}
            <Progress 
              value={progress} 
              className="h-1 mb-3"
              data-testid="tour-progress"
            />

            {/* Message */}
            <p className="text-sm text-gray-800 font-medium mb-4 leading-relaxed" data-testid="tour-message">
              {step.message}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {/* Back button - only show from step 2 onwards */}
                {currentStep > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="text-xs text-gray-600 hover:text-gray-800 px-2"
                    data-testid="button-back-tour"
                  >
                    <ArrowLeft className="mr-1 h-3 w-3" />
                    Back
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSkip}
                  className="text-xs text-gray-500 hover:text-gray-700 px-2"
                  data-testid="button-skip-tour"
                >
                  Skip
                </Button>
              </div>

              <Button
                onClick={handleNext}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-xs font-medium transition-all duration-200 hover:scale-105"
                data-testid="button-next-tour"
              >
                {isLastStep ? (
                  <>
                    Finish
                    <RotateCcw className="ml-1 h-3 w-3" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </>
                )}
              </Button>
            </div>

            {/* Timer indicator with 30s constraint */}
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-400">
                ≈ {Math.max(1, (TOUR_STEPS.length - currentStep - 1) * 4)}s remaining (max 30s total)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

// Helper hook for tour management
export function useTourState() {
  const [isTourVisible, setIsTourVisible] = useState(false);
  const [tourCompleted, setTourCompleted] = useState(false);
  const [tourSkipped, setTourSkipped] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('tour_completed');
    const skipped = localStorage.getItem('tour_skipped');
    const hasCompletedOnboarding = localStorage.getItem('hasCompletedOnboarding');
    
    setTourCompleted(!!completed);
    setTourSkipped(!!skipped);
    
    // Show tour for new users who haven't completed it or skipped it
    const shouldShowTour = !completed && !skipped && hasCompletedOnboarding !== 'true';
    setIsTourVisible(shouldShowTour);
  }, []);

  const startTour = () => setIsTourVisible(true);
  const completeTour = () => {
    setIsTourVisible(false);
    setTourCompleted(true);
  };
  const skipTour = () => {
    setIsTourVisible(false);
    setTourSkipped(true);
  };

  return {
    isTourVisible,
    tourCompleted,
    tourSkipped,
    startTour,
    completeTour,
    skipTour,
  };
}
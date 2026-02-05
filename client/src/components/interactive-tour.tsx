import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  XIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  MapPinIcon,
  StarIcon,
  TrophyIcon,
  UserPlusIcon,
  CreditCardIcon,
  UsersIcon,
  BookOpenIcon,
  HelpCircleIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TourStep {
  id: string;
  title: string;
  description: string;
  element?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
  highlight?: boolean;
}

interface InteractiveTourProps {
  isVisible: boolean;
  onComplete: () => void;
  onSkip: () => void;
  startStep?: string;
}

export default function InteractiveTour({ isVisible, onComplete, onSkip, startStep = "welcome" }: InteractiveTourProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const tourSteps: TourStep[] = [
    {
      id: "welcome",
      title: "Welcome to PartnerConnector! 🎉",
      description: "Let's take a quick tour to help you get started earning commissions. This will only take 2 minutes!",
      action: "start-tour"
    },
    {
      id: "dashboard-overview",
      title: "Your Partner Dashboard",
      description: "This is your command center! Here you can see your earnings, track deals, and monitor your progress toward the next partner level.",
      element: "[data-testid='dashboard-stats']",
      position: "bottom"
    },
    {
      id: "submit-deals",
      title: "Submit Your First Deal",
      description: "Click here to submit deals for businesses that need payment processing or funding. Each successful deals earns you substantial commissions!",
      element: "[data-testid='link-submit-deals']",
      position: "bottom",
      highlight: true
    },
    {
      id: "earnings-tracker",
      title: "Track Your Earnings",
      description: "Keep an eye on your commission earnings here. You'll see pending payments, completed transactions, and your total lifetime earnings.",
      element: "[data-testid='commission-summary']",
      position: "left"
    },
    {
      id: "team-management",
      title: "Build Your Network",
      description: "Grow your earnings by building a team! Invite other professionals and earn override commissions on their sales.",
      element: "[data-testid='link-team-management']",
      position: "bottom"
    },
    {
      id: "training-center",
      title: "Level Up Your Skills",
      description: "Access training modules, certifications, and resources to increase your success rate and unlock higher commission tiers.",
      element: "[data-testid='link-training']",
      position: "bottom"
    },
    {
      id: "resources-dropdown",
      title: "Sales Resources",
      description: "Find everything you need to succeed: brochures, email templates, pricing guides, and the knowledge base.",
      element: "[data-testid='dropdown-resources']",
      position: "bottom"
    },
    {
      id: "help-support",
      title: "Get Help Anytime",
      description: "Need assistance? Click here for instant support, or use the chat feature for quick questions.",
      element: "[data-testid='button-help']",
      position: "left"
    },
    {
      id: "first-action",
      title: "Ready to Start Earning?",
      description: "Let's get you started with your first action! Choose what you'd like to do first:",
      action: "choose-first-action"
    }
  ];

  useEffect(() => {
    if (isVisible && startStep) {
      const stepIndex = tourSteps.findIndex(step => step.id === startStep);
      setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
      setIsActive(true);
    }
  }, [isVisible, startStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsActive(false);
    onComplete();
    toast({
      title: "Tour Complete! 🎯",
      description: "You're all set to start earning commissions with PartnerConnector!",
    });
  };

  const handleSkip = () => {
    setIsActive(false);
    onSkip();
  };

  const handleFirstAction = (action: string) => {
    switch (action) {
      case 'submit-deals':
        window.location.href = '/submit-deal';
        break;
      case 'training':
        window.location.href = '/training';
        break;
      case 'team':
        window.location.href = '/team-management';
        break;
      case 'resources':
        // Trigger resources dropdown
        const resourcesButton = document.querySelector('[data-testid="dropdown-resources"]') as HTMLElement;
        resourcesButton?.click();
        break;
    }
    handleComplete();
  };

  if (!isVisible || !isActive) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  // Render overlay and tour card
  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-50" onClick={handleSkip}>
        <div className="absolute inset-0" />
      </div>

      {/* Tour Card */}
      <div className="fixed z-50 max-w-md" style={{
        top: step.element ? 'auto' : '50%',
        left: step.element ? 'auto' : '50%',
        transform: step.element ? 'none' : 'translate(-50%, -50%)',
        // Position relative to highlighted element if specified
        ...(step.element && getElementPosition(step.element, step.position))
      }}>
        <Card className="bg-white shadow-2xl border-2 border-blue-200 backdrop-blur-none">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPinIcon className="w-5 h-5 text-blue-600" />
                <Badge className="bg-blue-600">
                  Step {currentStep + 1} of {tourSteps.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSkip}
                className="p-1"
                data-testid="button-skip-tour"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Special content for specific steps */}
            {step.action === "choose-first-action" && (
              <div className="space-y-3">
                <h4 className="font-medium">Choose your first action:</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleFirstAction('submit-deals')}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    data-testid="button-first-action-deals"
                  >
                    <CreditCardIcon className="w-5 h-5 text-green-600" />
                    <span className="text-xs">Submit Deal</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFirstAction('training')}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    data-testid="button-first-action-training"
                  >
                    <BookOpenIcon className="w-5 h-5 text-blue-600" />
                    <span className="text-xs">Start Training</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFirstAction('team')}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    data-testid="button-first-action-team"
                  >
                    <UsersIcon className="w-5 h-5 text-purple-600" />
                    <span className="text-xs">Build Team</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleFirstAction('resources')}
                    className="flex flex-col items-center gap-1 h-auto py-3"
                    data-testid="button-first-action-resources"
                  >
                    <HelpCircleIcon className="w-5 h-5 text-orange-600" />
                    <span className="text-xs">Get Resources</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-2">
              <Button
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-1"
                data-testid="button-tour-previous"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Previous
              </Button>

              {step.action !== "choose-first-action" && (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-1"
                  data-testid="button-tour-next"
                >
                  {currentStep === tourSteps.length - 1 ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4" />
                      Complete
                    </>
                  ) : (
                    <>
                      Next
                      <ArrowRightIcon className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Highlight overlay for specific elements */}
      {step.element && step.highlight && (
        <div className="fixed inset-0 pointer-events-none z-40">
          <div 
            className="absolute border-4 border-blue-400 rounded-lg shadow-lg animate-pulse"
            style={getHighlightStyle(step.element)}
          />
        </div>
      )}
    </>
  );
}

// Helper function to position tour card relative to target element
function getElementPosition(selector: string, position?: string) {
  if (typeof window === 'undefined') return {};
  
  const element = document.querySelector(selector);
  if (!element) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
  
  const rect = element.getBoundingClientRect();
  const offset = 20;
  
  switch (position) {
    case 'top':
      return {
        top: rect.top - offset,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, -100%)'
      };
    case 'bottom':
      return {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, 0)'
      };
    case 'left':
      return {
        top: rect.top + rect.height / 2,
        left: rect.left - offset,
        transform: 'translate(-100%, -50%)'
      };
    case 'right':
      return {
        top: rect.top + rect.height / 2,
        left: rect.right + offset,
        transform: 'translate(0, -50%)'
      };
    default:
      return {
        top: rect.bottom + offset,
        left: rect.left + rect.width / 2,
        transform: 'translate(-50%, 0)'
      };
  }
}

// Helper function to get highlight overlay position
function getHighlightStyle(selector: string) {
  if (typeof window === 'undefined') return {};
  
  const element = document.querySelector(selector);
  if (!element) return {};
  
  const rect = element.getBoundingClientRect();
  return {
    top: rect.top - 4,
    left: rect.left - 4,
    width: rect.width + 8,
    height: rect.height + 8
  };
}
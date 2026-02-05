import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  UserIcon, 
  BuildingIcon, 
  TargetIcon, 
  BookOpenIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  StarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface OnboardingData {
  personalInfo: {
    firstName: string;
    lastName: string;
    phone: string;
    experienceLevel: string;
    preferredContact: string;
  };
  businessInfo: {
    companyName: string;
    industry: string;
    clientTypes: string[];
    avgDealSize: string;
  };
  goals: {
    monthlyTarget: string;
    primaryServices: string[];
    supportNeeds: string[];
  };
  preferences: {
    trainingFormat: string;
    communicationFrequency: string;
    marketingMaterials: boolean;
  };
}

interface OnboardingWizardProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function OnboardingWizard({ onComplete, onSkip }: OnboardingWizardProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      phone: "",
      experienceLevel: "",
      preferredContact: "email"
    },
    businessInfo: {
      companyName: "",
      industry: "",
      clientTypes: [],
      avgDealSize: ""
    },
    goals: {
      monthlyTarget: "",
      primaryServices: [],
      supportNeeds: []
    },
    preferences: {
      trainingFormat: "",
      communicationFrequency: "weekly",
      marketingMaterials: true
    }
  });

  const steps: OnboardingStep[] = [
    {
      id: "personal",
      title: "Personal Information",
      description: "Tell us about yourself and your experience",
      icon: <UserIcon className="w-6 h-6" />
    },
    {
      id: "business",
      title: "Business Profile", 
      description: "Help us understand your business and clients",
      icon: <BuildingIcon className="w-6 h-6" />
    },
    {
      id: "goals",
      title: "Goals & Targets",
      description: "Set your commission targets and service preferences",
      icon: <TargetIcon className="w-6 h-6" />
    },
    {
      id: "preferences",
      title: "Training Preferences",
      description: "Customize your learning experience",
      icon: <BookOpenIcon className="w-6 h-6" />
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
      toast({
        title: "Welcome to PartnerConnector!",
        description: "Your onboarding is complete. Let's start earning commissions together!",
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.personalInfo.firstName && formData.personalInfo.lastName;
      case 1:
        return formData.businessInfo.industry && formData.businessInfo.clientTypes.length > 0;
      case 2:
        return formData.goals.monthlyTarget && formData.goals.primaryServices.length > 0;
      case 3:
        return formData.preferences.trainingFormat;
      default:
        return true;
    }
  };

  const updateFormData = (section: keyof OnboardingData, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const toggleArrayField = (section: keyof OnboardingData, field: string, value: string) => {
    setFormData(prev => {
      const currentArray = (prev[section] as any)[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: newArray
        }
      };
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => updateFormData('personalInfo', 'firstName', e.target.value)}
                  placeholder="Enter your first name"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => updateFormData('personalInfo', 'lastName', e.target.value)}
                  placeholder="Enter your last name"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.personalInfo.phone}
                onChange={(e) => updateFormData('personalInfo', 'phone', e.target.value)}
                placeholder="Your contact number"
                data-testid="input-phone"
              />
            </div>

            <div>
              <Label>Experience Level</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['Beginner', 'Intermediate', 'Expert'].map((level) => (
                  <Button
                    key={level}
                    variant={formData.personalInfo.experienceLevel === level ? "default" : "outline"}
                    onClick={() => updateFormData('personalInfo', 'experienceLevel', level)}
                    className="w-full"
                    data-testid={`button-experience-${level.toLowerCase()}`}
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        const industries = [
          "Accounting & Finance", "Business Consulting", "Healthcare", 
          "Retail & E-commerce", "Professional Services", "Technology",
          "Manufacturing", "Hospitality", "Other"
        ];
        
        const clientTypes = [
          "Small Business (1-10 employees)",
          "Medium Business (11-50 employees)", 
          "Large Business (50+ employees)",
          "Startups",
          "Established Companies",
          "Non-profits"
        ];

        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.businessInfo.companyName}
                onChange={(e) => updateFormData('businessInfo', 'companyName', e.target.value)}
                placeholder="Your company or practice name"
                data-testid="input-company-name"
              />
            </div>

            <div>
              <Label>Primary Industry *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {industries.map((industry) => (
                  <Button
                    key={industry}
                    variant={formData.businessInfo.industry === industry ? "default" : "outline"}
                    onClick={() => updateFormData('businessInfo', 'industry', industry)}
                    className="text-sm"
                    data-testid={`button-industry-${industry.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {industry}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Client Types (Select all that apply) *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {clientTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.businessInfo.clientTypes.includes(type)}
                      onCheckedChange={() => toggleArrayField('businessInfo', 'clientTypes', type)}
                      data-testid={`checkbox-client-${type.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label htmlFor={type} className="text-sm">
                      {type}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        const services = [
          "Card Payment Processing",
          "Business Funding & Loans", 
          "Merchant Cash Advance",
          "Business Insurance",
          "Utility Supply",
          "Equipment Financing"
        ];

        return (
          <div className="space-y-4">
            <div>
              <Label>Commission Target Per Sale</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {['£500', '£1,000', '£2,500', '£5,000+'].map((target) => (
                  <Button
                    key={target}
                    variant={formData.goals.monthlyTarget === target ? "default" : "outline"}
                    onClick={() => updateFormData('goals', 'monthlyTarget', target)}
                    className="text-sm"
                    data-testid={`button-target-${target.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`}
                  >
                    {target}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Primary Services to Focus On *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {services.map((service) => (
                  <div key={service} className="flex items-center space-x-2">
                    <Checkbox
                      id={service}
                      checked={formData.goals.primaryServices.includes(service)}
                      onCheckedChange={() => toggleArrayField('goals', 'primaryServices', service)}
                      data-testid={`checkbox-service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label htmlFor={service} className="text-sm">
                      {service}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Support Areas Needed</Label>
              <div className="space-y-2 mt-2">
                {['Sales Training', 'Product Knowledge', 'Marketing Materials', 'Client Objection Handling', 'Commission Optimization'].map((need) => (
                  <div key={need} className="flex items-center space-x-2">
                    <Checkbox
                      id={need}
                      checked={formData.goals.supportNeeds.includes(need)}
                      onCheckedChange={() => toggleArrayField('goals', 'supportNeeds', need)}
                      data-testid={`checkbox-support-${need.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label htmlFor={need} className="text-sm">
                      {need}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label>Preferred Training Format *</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {['Interactive Modules', 'Video Tutorials', 'Live Webinars', 'Written Guides'].map((format) => (
                  <Button
                    key={format}
                    variant={formData.preferences.trainingFormat === format ? "default" : "outline"}
                    onClick={() => updateFormData('preferences', 'trainingFormat', format)}
                    className="text-sm"
                    data-testid={`button-format-${format.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {format}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <Label>Communication Frequency</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                  <Button
                    key={freq}
                    variant={formData.preferences.communicationFrequency === freq.toLowerCase() ? "default" : "outline"}
                    onClick={() => updateFormData('preferences', 'communicationFrequency', freq.toLowerCase())}
                    className="text-sm"
                    data-testid={`button-frequency-${freq.toLowerCase()}`}
                  >
                    {freq}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={formData.preferences.marketingMaterials}
                onCheckedChange={(checked) => updateFormData('preferences', 'marketingMaterials', checked)}
                data-testid="checkbox-marketing-materials"
              />
              <Label htmlFor="marketing" className="text-sm">
                Send me marketing materials and sales resources
              </Label>
            </div>

            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <StarIcon className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">You're almost ready!</span>
              </div>
              <p className="text-sm text-green-700">
                After completing onboarding, you'll get access to your personalized dashboard, 
                training modules, and can start submitting deals immediately.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Welcome to PartnerConnector</span>
            <Button variant="ghost" onClick={onSkip} data-testid="button-skip-onboarding">
              Skip Setup
            </Button>
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progress} className="w-full" />
            <p className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}: {steps[currentStep].title}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step Navigation */}
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  index === currentStep ? 'text-blue-600' : 
                  index < currentStep ? 'text-green-600' : 'text-gray-400'
                }`}
              >
                {index < currentStep ? (
                  <CheckCircleIcon className="w-5 h-5" />
                ) : (
                  step.icon
                )}
                <span className="text-sm font-medium hidden md:block">
                  {step.title}
                </span>
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="min-h-[300px]">
            <div className="mb-4">
              <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].description}
              </p>
            </div>
            {renderStepContent()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              data-testid="button-previous-step"
            >
              <ArrowLeftIcon className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              data-testid="button-next-step"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircleIcon className="w-4 h-4 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
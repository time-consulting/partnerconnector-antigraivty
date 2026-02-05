import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  UserIcon,
  BriefcaseIcon,
  UsersIcon,
  TargetIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  StarIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional Background
  profession: string;
  experience: string;
  currentRole: string;
  companyName: string;
  
  // Network & Relationships
  businessContacts: string;
  industryExperience: string[];
  networkSize: string;
  dealsExperience: string;
  
  // Goals & Preferences
  monthlyEarningsGoal: string;
  timeCommitment: string;
  primaryInterest: string[];
  communicationPreference: string;
  
  // Additional Information
  specialSkills: string;
  challenges: string;
  hearAboutUs: string;
  additionalComments: string;
}

interface OnboardingQuestionnaireProps {
  onComplete: (data: OnboardingData) => void;
  onSkip: () => void;
}

export default function OnboardingQuestionnaire({ onComplete, onSkip }: OnboardingQuestionnaireProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OnboardingData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    experience: '',
    currentRole: '',
    companyName: '',
    businessContacts: '',
    industryExperience: [],
    networkSize: '',
    dealsExperience: '',
    monthlyEarningsGoal: '',
    timeCommitment: '',
    primaryInterest: [],
    communicationPreference: '',
    specialSkills: '',
    challenges: '',
    hearAboutUs: '',
    additionalComments: ''
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to PartnerConnector',
      icon: <StarIcon className="w-6 h-6" />,
      description: 'Empower your clients while building your income'
    },
    {
      id: 'personal',
      title: 'Your Details',
      icon: <UserIcon className="w-6 h-6" />,
      description: 'Let us get to know you better'
    },
    {
      id: 'professional',
      title: 'Professional Background',
      icon: <BriefcaseIcon className="w-6 h-6" />,
      description: 'Tell us about your professional experience'
    },
    {
      id: 'network',
      title: 'Network & Relationships',
      icon: <UsersIcon className="w-6 h-6" />,
      description: 'Help us understand your business network'
    },
    {
      id: 'goals',
      title: 'Goals & Preferences',
      icon: <TargetIcon className="w-6 h-6" />,
      description: 'What are you hoping to achieve?'
    },
    {
      id: 'additional',
      title: 'Final Details',
      icon: <CheckCircleIcon className="w-6 h-6" />,
      description: 'Final questions to personalize your experience'
    }
  ];

  const handleNext = () => {
    // Validate current step
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < steps.length - 1) {
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

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Welcome step - no validation needed
        return true;
      case 1: // Personal Information
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in all required personal information fields.",
            variant: "destructive",
          });
          return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
          toast({
            title: "Invalid Email",
            description: "Please enter a valid email address.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2: // Professional Background
        if (!formData.profession || !formData.experience) {
          toast({
            title: "Required Fields Missing",
            description: "Please fill in your profession and experience level.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 3: // Network & Relationships
        if (!formData.networkSize || !formData.dealsExperience) {
          toast({
            title: "Required Fields Missing",
            description: "Please provide information about your network and deals experience.",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 4: // Goals & Preferences
        if (!formData.monthlyEarningsGoal || !formData.timeCommitment || formData.primaryInterest.length === 0) {
          toast({
            title: "Required Fields Missing",
            description: "Please complete your goals and preferences.",
            variant: "destructive",
          });
          return false;
        }
        break;
    }
    return true;
  };

  const handleComplete = () => {
    onComplete(formData);
    toast({
      title: "Welcome to PartnerConnector! 🎉",
      description: "Your profile has been created. Let's show you around the platform!",
    });
  };

  const updateFormData = (field: keyof OnboardingData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayUpdate = (field: keyof OnboardingData, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter(item => item !== value)
    }));
  };

  const progress = ((currentStep + 1) / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Welcome Step
        return (
          <div className="space-y-8 text-center">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Empower Your Clients, Grow Your Income
              </h3>
              <p className="text-lg text-gray-700 mb-6">
                Connect your clients with the funding and payment solutions they already need – while you remain their trusted advisor and we handle all the delivery.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border-2 border-blue-100 p-6 rounded-xl">
                <div className="text-blue-600 text-3xl font-bold mb-2">60%</div>
                <div className="font-semibold text-gray-900 mb-2">Commission Rate</div>
                <div className="text-sm text-gray-600 mb-4">Earn up to 60% commission on all successful deals</div>
                <div className="text-sm bg-blue-50 p-3 rounded-lg">
                  <strong>Example:</strong> £75,000 business funding = <strong>£1,350</strong> commission to you
                </div>
              </div>

              <div className="bg-white border-2 border-green-100 p-6 rounded-xl">
                <div className="text-green-600 text-3xl font-bold mb-2">Team</div>
                <div className="font-semibold text-gray-900 mb-2">Building Rewards</div>
                <div className="text-sm text-gray-600 mb-4">Invite team members and earn from their deals too</div>
                <div className="text-sm bg-green-50 p-3 rounded-lg">
                  <strong>Growth:</strong> Build a network and earn passive income from your team's success
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-3">How It Works:</h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <span>You refer clients needing funding or payment solutions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <span>We handle all the application and delivery process</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <span>You earn substantial commissions while remaining their trusted advisor</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 text-left">
              <p className="text-sm text-yellow-800">
                <strong>Your Role:</strong> Stay the trusted advisor your clients rely on. We handle the technical delivery, paperwork, and ongoing support – you focus on the relationship and earn from services they genuinely need.
              </p>
            </div>
          </div>
        );

      case 1: // Personal Information
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  data-testid="input-first-name"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  data-testid="input-last-name"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="your.email@example.com"
                data-testid="input-email"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+44 7XXX XXX XXX"
                data-testid="input-phone"
              />
            </div>
          </div>
        );

      case 2: // Professional Background
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="profession">Current Profession *</Label>
              <Select value={formData.profession} onValueChange={(value) => updateFormData('profession', value)}>
                <SelectTrigger data-testid="select-profession">
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
              <Label htmlFor="experience">Years of Experience *</Label>
              <Select value={formData.experience} onValueChange={(value) => updateFormData('experience', value)}>
                <SelectTrigger data-testid="select-experience">
                  <SelectValue placeholder="Select your experience level" />
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
              <Label htmlFor="currentRole">Current Role/Position</Label>
              <Input
                id="currentRole"
                value={formData.currentRole}
                onChange={(e) => updateFormData('currentRole', e.target.value)}
                placeholder="e.g., Senior Accountant, Managing Director"
                data-testid="input-current-role"
              />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => updateFormData('companyName', e.target.value)}
                placeholder="Your current company"
                data-testid="input-company-name"
              />
            </div>
          </div>
        );

      case 3: // Network & Relationships
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="networkSize">Size of Your Business Network *</Label>
              <Select value={formData.networkSize} onValueChange={(value) => updateFormData('networkSize', value)}>
                <SelectTrigger data-testid="select-network-size">
                  <SelectValue placeholder="How many business contacts do you have?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-25">0-25 contacts</SelectItem>
                  <SelectItem value="26-50">26-50 contacts</SelectItem>
                  <SelectItem value="51-100">51-100 contacts</SelectItem>
                  <SelectItem value="101-250">101-250 contacts</SelectItem>
                  <SelectItem value="250+">250+ contacts</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Industry Experience (Select all that apply)</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {['Retail', 'Restaurants', 'Professional Services', 'Healthcare', 'Construction', 'Technology', 'Manufacturing', 'E-commerce'].map((industry) => (
                  <div key={industry} className="flex items-center space-x-2">
                    <Checkbox
                      id={`industry-${industry}`}
                      checked={formData.industryExperience.includes(industry)}
                      onCheckedChange={(checked) => handleArrayUpdate('industryExperience', industry, !!checked)}
                      data-testid={`checkbox-industry-${industry.toLowerCase()}`}
                    />
                    <Label htmlFor={`industry-${industry}`} className="text-sm">{industry}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="dealsExperience">Referral/Commission Experience *</Label>
              <Select value={formData.dealsExperience} onValueChange={(value) => updateFormData('dealsExperience', value)}>
                <SelectTrigger data-testid="select-deals-experience">
                  <SelectValue placeholder="Have you earned commissions before?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No experience with deals</SelectItem>
                  <SelectItem value="some">Some deals experience</SelectItem>
                  <SelectItem value="experienced">Experienced with deals</SelectItem>
                  <SelectItem value="expert">Expert - deals are my main income</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="businessContacts">Types of Business Contacts</Label>
              <Textarea
                id="businessContacts"
                value={formData.businessContacts}
                onChange={(e) => updateFormData('businessContacts', e.target.value)}
                placeholder="Describe the types of businesses in your network (e.g., small retail shops, restaurants, professional services)"
                rows={3}
                data-testid="textarea-business-contacts"
              />
            </div>
          </div>
        );

      case 4: // Goals & Preferences
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="monthlyEarningsGoal">Monthly Earnings Goal *</Label>
              <Select value={formData.monthlyEarningsGoal} onValueChange={(value) => updateFormData('monthlyEarningsGoal', value)}>
                <SelectTrigger data-testid="select-earnings-goal">
                  <SelectValue placeholder="What would you like to earn monthly?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="500-1000">£500 - £1,000</SelectItem>
                  <SelectItem value="1000-2500">£1,000 - £2,500</SelectItem>
                  <SelectItem value="2500-5000">£2,500 - £5,000</SelectItem>
                  <SelectItem value="5000-10000">£5,000 - £10,000</SelectItem>
                  <SelectItem value="10000+">£10,000+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="timeCommitment">Time Commitment *</Label>
              <Select value={formData.timeCommitment} onValueChange={(value) => updateFormData('timeCommitment', value)}>
                <SelectTrigger data-testid="select-time-commitment">
                  <SelectValue placeholder="How much time can you dedicate?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1-5">1-5 hours per week (Side hustle)</SelectItem>
                  <SelectItem value="6-15">6-15 hours per week (Part-time)</SelectItem>
                  <SelectItem value="16-25">16-25 hours per week (Significant commitment)</SelectItem>
                  <SelectItem value="25+">25+ hours per week (Full-time focus)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Primary Interests (Select all that apply) *</Label>
              <div className="grid grid-cols-1 gap-3 mt-2">
                {[
                  'Payment Processing Solutions',
                  'Business Funding & Loans',
                  'Building a Referral Team',
                  'Training & Certification',
                  'Marketing Support'
                ].map((interest) => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={`interest-${interest}`}
                      checked={formData.primaryInterest.includes(interest)}
                      onCheckedChange={(checked) => handleArrayUpdate('primaryInterest', interest, !!checked)}
                      data-testid={`checkbox-interest-${interest.toLowerCase().replace(/\s+/g, '-')}`}
                    />
                    <Label htmlFor={`interest-${interest}`} className="text-sm">{interest}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="communicationPreference">Preferred Communication</Label>
              <Select value={formData.communicationPreference} onValueChange={(value) => updateFormData('communicationPreference', value)}>
                <SelectTrigger data-testid="select-communication-preference">
                  <SelectValue placeholder="How would you like us to contact you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone</SelectItem>
                  <SelectItem value="text">Text/SMS</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="any">Any method is fine</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 5: // Additional Information
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="specialSkills">Special Skills or Expertise</Label>
              <Textarea
                id="specialSkills"
                value={formData.specialSkills}
                onChange={(e) => updateFormData('specialSkills', e.target.value)}
                placeholder="Any special skills, certifications, or expertise that might help you succeed?"
                rows={3}
                data-testid="textarea-special-skills"
              />
            </div>

            <div>
              <Label htmlFor="challenges">Biggest Business Challenge</Label>
              <Textarea
                id="challenges"
                value={formData.challenges}
                onChange={(e) => updateFormData('challenges', e.target.value)}
                placeholder="What's the biggest challenge your clients face that our services might solve?"
                rows={3}
                data-testid="textarea-challenges"
              />
            </div>

            <div>
              <Label htmlFor="hearAboutUs">How did you hear about us?</Label>
              <Select value={formData.hearAboutUs} onValueChange={(value) => updateFormData('hearAboutUs', value)}>
                <SelectTrigger data-testid="select-hear-about-us">
                  <SelectValue placeholder="How did you discover PartnerConnector?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social-media">Social Media</SelectItem>
                  <SelectItem value="deals">Referral from colleague</SelectItem>
                  <SelectItem value="email">Email marketing</SelectItem>
                  <SelectItem value="event">Industry event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="additionalComments">Additional Comments</Label>
              <Textarea
                id="additionalComments"
                value={formData.additionalComments}
                onChange={(e) => updateFormData('additionalComments', e.target.value)}
                placeholder="Anything else you'd like us to know?"
                rows={3}
                data-testid="textarea-additional-comments"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4 bg-white border-2 border-gray-200 shadow-2xl">
        <CardHeader className="bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {steps[currentStep].icon}
              <div>
                <CardTitle className="text-xl">{steps[currentStep].title}</CardTitle>
                <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
              </div>
            </div>
            <Button variant="ghost" onClick={onSkip} className="text-muted-foreground" data-testid="button-skip-questionnaire">
              Skip for now
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStep + 1} of {steps.length}</span>
              <span>{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardHeader>

        <CardContent className="space-y-6 bg-white">
          {renderStepContent()}

          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
              data-testid="button-questionnaire-previous"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              Previous
            </Button>

            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
              data-testid="button-questionnaire-next"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <CheckCircleIcon className="w-4 h-4" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
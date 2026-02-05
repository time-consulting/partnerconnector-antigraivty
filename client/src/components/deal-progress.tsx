import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, ClockIcon, FileTextIcon } from "lucide-react";

interface DealProgressProps {
  dealId?: string;
}

export default function DealProgress({ dealId }: DealProgressProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    businessName: "",
    position: ""
  });

  const steps = [
    {
      id: 1,
      title: "Submit Deal",
      description: "Referral submitted and being processed",
      icon: FileTextIcon,
      status: currentStep > 1 ? "completed" : currentStep === 1 ? "active" : "pending"
    },
    {
      id: 2,
      title: "Quote Created",
      description: "Competitive quote generated for client",
      icon: ClockIcon,
      status: currentStep > 2 ? "completed" : currentStep === 2 ? "active" : "pending"
    },
    {
      id: 3,
      title: "Client Approval",
      description: "Waiting for client approval and details",
      icon: CheckIcon,
      status: currentStep > 3 ? "completed" : currentStep === 3 ? "active" : "pending"
    }
  ];

  const handleApproveQuote = () => {
    setShowApprovalForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the form data
    console.log("Client approval submitted:", formData);
    setCurrentStep(4);
    setShowApprovalForm(false);
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500 text-white border-green-500";
      case "active":
        return "bg-primary text-white border-primary animate-pulse";
      default:
        return "bg-gray-200 text-gray-600 border-gray-300";
    }
  };

  return (
    <Card data-testid="card-deals-progress">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Deal Progress Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">Track your deals from submission to completion</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="relative">
            {steps.map((step, index) => (
              <div key={step.id} className="relative flex items-center mb-6 last:mb-0">
                {/* Step Circle */}
                <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepClasses(step.status)}`}>
                  {step.status === "completed" ? (
                    <CheckIcon className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                
                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div className={`absolute left-6 top-12 w-0.5 h-6 transition-colors duration-300 ${
                    currentStep > step.id ? "bg-green-500" : "bg-gray-300"
                  }`} />
                )}
                
                {/* Step Content */}
                <div className="ml-4 flex-1">
                  <h4 className="font-semibold text-foreground">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {/* Loading Bar for Active Step */}
                  {step.status === "active" && step.id === 2 && (
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "75%" }} />
                    </div>
                  )}
                  
                  {/* Approve Quote Button */}
                  {step.status === "active" && step.id === 3 && !showApprovalForm && (
                    <Button 
                      onClick={handleApproveQuote}
                      className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                      data-testid="button-approve-quote"
                    >
                      Approve Quote & Submit Client Details
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Demo Controls */}
          <div className="border-t pt-4 space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">Demo Controls:</p>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
              >
                Previous Step
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                disabled={currentStep === 3}
              >
                Next Step
              </Button>
            </div>
          </div>
        </div>

        {/* Client Approval Form */}
        {showApprovalForm && (
          <div className="mt-6 p-4 border border-border rounded-lg bg-muted/20">
            <h4 className="font-semibold text-foreground mb-4">Client Approval Form</h4>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                    data-testid="input-first-name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                    data-testid="input-last-name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    data-testid="input-email"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    data-testid="input-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name *</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    required
                    data-testid="input-business-name"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Position/Title</Label>
                  <Input
                    id="position"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    data-testid="input-position"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white" data-testid="button-submit-approval">
                  Submit Client Approval
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowApprovalForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { User, Building, CreditCard, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const additionalDetailsSchema = z.object({
  // Director/Personal Details
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  homeAddress: z.string().min(10, "Please enter a complete home address"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  
  // Business Details
  legalEntity: z.enum(["sole_trader", "limited_company", "partnership"], {
    required_error: "Please select a legal entity type",
  }),
  limitedCompanyName: z.string().optional(),
  tradingName: z.string().min(2, "Trading name is required"),
  tradingAddress: z.string().min(10, "Please enter a complete trading address"),
  businessDescription: z.string().min(10, "Please describe what the business sells"),
  
  // Banking Details
  bankAccountNumber: z.string().min(8, "Account number must be at least 8 digits").max(8, "Account number must be exactly 8 digits"),
  sortCode: z.string().min(6, "Sort code must be 6 digits").max(6, "Sort code must be exactly 6 digits").regex(/^\d+$/, "Sort code must contain only numbers"),
}).refine((data) => {
  // If limited company is selected, company name is required
  if (data.legalEntity === "limited_company" && !data.limitedCompanyName) {
    return false;
  }
  return true;
}, {
  message: "Limited company name is required when legal entity is 'Limited Company'",
  path: ["limitedCompanyName"],
});

type AdditionalDetailsData = z.infer<typeof additionalDetailsSchema>;

interface AdditionalDetailsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  quoteId: string;
  deal?: {
    id: string;
    businessName: string;
    businessEmail?: string;
  };
}

export default function AdditionalDetailsForm({ 
  isOpen, 
  onClose, 
  onComplete,
  quoteId,
  deal 
}: AdditionalDetailsFormProps) {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'form' | 'success'>('form');

  const form = useForm<AdditionalDetailsData>({
    resolver: zodResolver(additionalDetailsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      homeAddress: "",
      email: deal?.businessEmail || "",
      phone: "",
      legalEntity: undefined,
      limitedCompanyName: "",
      tradingName: deal?.businessName || "",
      tradingAddress: "",
      businessDescription: "",
      bankAccountNumber: "",
      sortCode: "",
    },
  });

  const selectedLegalEntity = form.watch("legalEntity");

  const submitMutation = useMutation({
    mutationFn: async (data: AdditionalDetailsData) => {
      return apiRequest('POST', `/api/quotes/${quoteId}/signup`, data);
    },
    onSuccess: () => {
      setCurrentStep('success');
      toast({
        title: "Details Submitted",
        description: "Thank you! Your signup details have been submitted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: "Failed to submit details. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (data: AdditionalDetailsData) => {
    // Format sort code to include dashes
    const formattedData = {
      ...data,
      sortCode: data.sortCode.replace(/(\d{2})(\d{2})(\d{2})/, '$1-$2-$3'),
    };
    
    submitMutation.mutate(formattedData);
  };

  const handleComplete = () => {
    onComplete();
    onClose();
    setCurrentStep('form'); // Reset for next time
  };

  if (currentStep === 'success') {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Application Submitted!</h3>
            <p className="text-muted-foreground mb-6">
              Your application has been submitted to admin for processing. You'll be notified when it moves to the next stage.
            </p>
            <Button onClick={handleComplete} className="w-full" data-testid="button-complete">
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Complete Signup Information
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Please provide the following details to complete your signup for {deal?.businessName}
          </p>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Director Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="w-4 h-4" />
                  Director Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter first name" 
                            {...field}
                            data-testid="input-first-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter last name" 
                            {...field}
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="homeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Home Address *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter complete home address including postcode" 
                          rows={3}
                          {...field}
                          data-testid="input-home-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address *</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Enter email address" 
                            {...field}
                            data-testid="input-email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number *</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Enter phone number" 
                            {...field}
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <Separator />

            {/* Business Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building className="w-4 h-4" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="legalEntity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Legal Entity *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-legal-entity">
                            <SelectValue placeholder="Select legal entity type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="sole_trader">Sole Trader</SelectItem>
                          <SelectItem value="limited_company">Limited Company</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {selectedLegalEntity === "limited_company" && (
                  <FormField
                    control={form.control}
                    name="limitedCompanyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Limited Company Name *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter company name as registered with Companies House" 
                            {...field}
                            data-testid="input-limited-company-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="tradingName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trading Name *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter trading name" 
                          {...field}
                          data-testid="input-trading-name"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tradingAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trading Address *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter complete trading address including postcode" 
                          rows={3}
                          {...field}
                          data-testid="input-trading-address"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="businessDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What Does the Business Sell? *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the products or services your business sells" 
                          rows={3}
                          {...field}
                          data-testid="input-business-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />

            {/* Banking Details Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CreditCard className="w-4 h-4" />
                  Banking Details
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  For payment processing settlements
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="bankAccountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bank Account Number *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="12345678" 
                            maxLength={8}
                            {...field}
                            data-testid="input-account-number"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="sortCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sort Code *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="123456" 
                            maxLength={6}
                            {...field}
                            onChange={(e) => {
                              // Only allow numbers
                              const value = e.target.value.replace(/\D/g, '');
                              field.onChange(value);
                            }}
                            data-testid="input-sort-code"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Security Note:</strong> Your banking details are encrypted and stored securely. 
                    They will only be used for payment processing settlements.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Submit Buttons */}
            <div className="flex justify-between pt-6">
              <Button type="button" variant="outline" onClick={onClose} data-testid="button-cancel">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={submitMutation.isPending}
                data-testid="button-submit-signup"
              >
                {submitMutation.isPending ? "Submitting..." : "Complete Signup"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

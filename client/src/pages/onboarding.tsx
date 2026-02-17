import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { CheckCircleIcon, UserIcon, BriefcaseIcon, UsersIcon } from "lucide-react";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useAuthContext } from "@/contexts/AuthContext";

const onboardingSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  profession: z.string().min(2, "Profession is required"),
  company: z.string().min(2, "Company name is required"),
  clientBaseSize: z.string().min(1, "Please select your client base size"),
  phone: z.string().min(10, "Valid phone number is required"),
});

type OnboardingFormData = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);

  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      profession: "",
      company: "",
      clientBaseSize: "",
      phone: "",
    },
  });

  // Pre-populate form fields from existing user data
  useEffect(() => {
    if (user) {
      // If user already has completed onboarding, redirect to dashboard
      if (user.hasCompletedOnboarding) {
        setLocation("/dashboard");
        return;
      }

      // Pre-fill any existing fields so users don't re-enter data
      const existingData: Partial<OnboardingFormData> = {};
      if (user.firstName) existingData.firstName = user.firstName;
      if (user.lastName) existingData.lastName = user.lastName;
      if (user.phone) existingData.phone = user.phone;
      if (user.profession) existingData.profession = user.profession;
      if (user.company) existingData.company = user.company;
      if (user.clientBaseSize) existingData.clientBaseSize = user.clientBaseSize;

      if (Object.keys(existingData).length > 0) {
        Object.entries(existingData).forEach(([key, value]) => {
          form.setValue(key as keyof OnboardingFormData, value);
        });
      }
    }
  }, [user, setLocation, form]);

  const completeMutation = useMutation({
    mutationFn: async (data: OnboardingFormData) => {
      return await apiRequest("POST", "/api/auth/complete-onboarding", data);
    },
    onSuccess: async () => {
      toast({
        title: "Welcome to PartnerConnector!",
        description: "Your account has been set up successfully.",
      });
      await queryClient.refetchQueries({ queryKey: ["/api/auth/user"] });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete onboarding",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    completeMutation.mutate(data);
  };

  const steps = [
    {
      number: 1,
      title: "Personal Information",
      description: "Tell us about yourself",
      icon: UserIcon,
      fields: ["firstName", "lastName", "phone"],
    },
    {
      number: 2,
      title: "Professional Details",
      description: "Help us understand your practice",
      icon: BriefcaseIcon,
      fields: ["profession", "company"],
    },
    {
      number: 3,
      title: "Client Base",
      description: "Size of your client network",
      icon: UsersIcon,
      fields: ["clientBaseSize"],
    },
  ];

  const currentStepData = steps[step - 1];
  const isLastStep = step === steps.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to PartnerConnector
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Let's get your account set up in just a few steps
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${step > s.number
                    ? "bg-green-500 border-green-500 text-white"
                    : step === s.number
                      ? "bg-teal-500 border-teal-500 text-white"
                      : "bg-white border-gray-300 text-gray-500 dark:bg-gray-800 dark:border-gray-600"
                    }`}
                >
                  {step > s.number ? (
                    <CheckCircleIcon className="w-6 h-6" />
                  ) : (
                    <span className="font-semibold">{s.number}</span>
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 h-0.5 mx-2 ${step > s.number ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                      }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                <currentStepData.icon className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
            <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
            <CardDescription className="text-base">{currentStepData.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name *</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="John"
                                data-testid="input-firstName"
                                className="h-12"
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
                                {...field}
                                placeholder="Smith"
                                data-testid="input-lastName"
                                className="h-12"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+44 20 1234 5678"
                              data-testid="input-phone"
                              className="h-12"
                            />
                          </FormControl>
                          <FormDescription>For account recovery and team communication</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="profession"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Profession *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Accountant, Business Consultant, Financial Advisor..."
                              data-testid="input-profession"
                              className="h-12"
                            />
                          </FormControl>
                          <FormDescription>
                            What best describes your professional role?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="company"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Your company or practice name"
                              data-testid="input-company"
                              className="h-12"
                            />
                          </FormControl>
                          <FormDescription>Your business or practice name</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="clientBaseSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client Base Size *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-clientBaseSize" className="h-12">
                                <SelectValue placeholder="Select your client base size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="1-10">1-10 clients</SelectItem>
                              <SelectItem value="11-50">11-50 clients</SelectItem>
                              <SelectItem value="51-100">51-100 clients</SelectItem>
                              <SelectItem value="101-250">101-250 clients</SelectItem>
                              <SelectItem value="251-500">251-500 clients</SelectItem>
                              <SelectItem value="500+">500+ clients</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            This helps us understand your network potential
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="flex justify-between pt-6">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(step - 1)}
                      data-testid="button-back"
                    >
                      Back
                    </Button>
                  ) : (
                    <div />
                  )}

                  {!isLastStep ? (
                    <Button
                      type="button"
                      onClick={async () => {
                        const fields = currentStepData.fields;
                        const isValid = await form.trigger(fields as any);
                        if (isValid) {
                          setStep(step + 1);
                        }
                      }}
                      className="bg-teal-600 hover:bg-teal-700"
                      data-testid="button-next"
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={completeMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                      data-testid="button-complete"
                    >
                      {completeMutation.isPending ? "Setting up..." : "Complete Setup"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Step {step} of {steps.length}
          </p>
        </div>
      </div>
    </div>
  );
}

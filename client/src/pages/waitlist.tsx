import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertWaitlistSchema, type InsertWaitlist } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/navigation";
import { 
  CheckIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  ShieldCheckIcon, 
  ArrowRightIcon, 
  StarIcon,
  DollarSignIcon,
  NetworkIcon,
  TargetIcon,
  HandshakeIcon,
  CreditCardIcon,
  BuildingIcon,
  GraduationCapIcon,
  Users2Icon,
  BrainIcon,
  ClockIcon,
  AlertCircleIcon
} from "lucide-react";

export default function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<InsertWaitlist>({
    resolver: zodResolver(insertWaitlistSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      companyName: "",
      businessType: "",
      currentClientBase: "",
      experienceLevel: "",
      interests: [],
      howDidYouHear: "",
      additionalInfo: "",
      marketingConsent: false
    }
  });

  const waitlistMutation = useMutation({
    mutationFn: (data: InsertWaitlist) => 
      apiRequest('POST', '/api/waitlist', data),
    onSuccess: () => {
      setSubmitted(true);
      setSubmitError(null);
      toast({
        title: "Welcome to the waitlist!",
        description: "We'll be in touch soon with exciting partnership opportunities."
      });
    },
    onError: (error: any) => {
      // Extract error message from API response structure
      const errorMessage = error?.body?.message || error?.message || "Failed to join waitlist. Please try again.";
      setSubmitError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (data: InsertWaitlist) => {
    setSubmitError(null); // Clear any previous errors
    waitlistMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Navigation />
        <div className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              You're on the list!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Thank you for joining our exclusive partnership waitlist. We'll be in touch soon with exciting opportunities to grow your business through strategic partnerships.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <Card className="text-center p-6 border-0 bg-gradient-to-b from-blue-50 to-white">
                <ClockIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
                <p className="text-sm text-gray-600">We'll review your application and reach out within 48 hours</p>
              </Card>
              <Card className="text-center p-6 border-0 bg-gradient-to-b from-green-50 to-white">
                <BrainIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Get Ready</h3>
                <p className="text-sm text-gray-600">Start thinking about which clients could benefit from our services</p>
              </Card>
              <Card className="text-center p-6 border-0 bg-gradient-to-b from-purple-50 to-white">
                <Users2Icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Join the Community</h3>
                <p className="text-sm text-gray-600">Connect with other professionals in our exclusive partner network</p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzMzMzMzMyIgZmlsbC1vcGFjaXR5PSIwLjEiLz4KPC9zdmc+')] opacity-30"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-200" data-testid="badge-exclusive-access">
                Exclusive Partnership Access
              </Badge>
              
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                Join the{" "}
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Partnership Revolution
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Be among the first accountants to access our exclusive partnership program. Connect your clients with the financial services they need while earning substantial commissions.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">Early</div>
                  <div className="text-sm text-gray-600">Access Priority</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">Premium</div>
                  <div className="text-sm text-gray-600">Commission Rates</div>
                </div>
              </div>
            </div>

            {/* Partnership Visual */}
            <div className="relative">
              <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600">
                <CardContent className="p-8 relative aspect-square flex items-center justify-center">
                  <div className="relative w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center rounded-lg">
                    <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                    
                    {/* Partnership Flow Animation */}
                    <div className="relative z-10 w-full max-w-md">
                      <div className="flex items-center justify-between mb-8">
                        {/* Accountant */}
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center mb-3 shadow-lg">
                            <GraduationCapIcon className="w-8 h-8 text-blue-600" />
                          </div>
                          <p className="text-white font-semibold text-sm">You</p>
                          <p className="text-white/80 text-xs">Accountant</p>
                        </div>
                        
                        {/* Connection Line */}
                        <div className="flex-1 px-4">
                          <div className="relative">
                            <div className="h-0.5 bg-white/60"></div>
                            <HandshakeIcon className="w-6 h-6 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-1" />
                          </div>
                        </div>
                        
                        {/* Client */}
                        <div className="text-center">
                          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center mb-3 shadow-lg">
                            <BuildingIcon className="w-8 h-8 text-purple-600" />
                          </div>
                          <p className="text-white font-semibold text-sm">Clients</p>
                          <p className="text-white/80 text-xs">Your Business</p>
                        </div>
                      </div>
                      
                      {/* Services */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                          <CreditCardIcon className="w-6 h-6 text-white mx-auto mb-2" />
                          <p className="text-white text-xs font-medium">Payment Solutions</p>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 text-center">
                          <DollarSignIcon className="w-6 h-6 text-white mx-auto mb-2" />
                          <p className="text-white text-xs font-medium">Business Funding</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Form Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Secure Your Spot
            </h2>
            <p className="text-lg text-gray-600">
              Join the exclusive waitlist for accountants ready to transform client relationships into profitable partnerships.
            </p>
          </div>

          <Card className="p-8 shadow-lg border-0 bg-gradient-to-b from-gray-50 to-white">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your first name" 
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
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your last name" 
                            {...field} 
                            data-testid="input-last-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="your.email@example.com" 
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
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Your phone number" 
                            {...field}
                            value={field.value || ""} 
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Practice/Company Name (Optional)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your accounting practice" 
                            {...field}
                            value={field.value || ""} 
                            data-testid="input-company"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="businessType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Business Type (Optional)</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger data-testid="select-business-type">
                              <SelectValue placeholder="Select your business type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sole-practitioner">Sole Practitioner</SelectItem>
                              <SelectItem value="small-practice">Small Practice (2-10 staff)</SelectItem>
                              <SelectItem value="medium-practice">Medium Practice (11-50 staff)</SelectItem>
                              <SelectItem value="large-practice">Large Practice (50+ staff)</SelectItem>
                              <SelectItem value="corporate">Corporate/In-house</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="currentClientBase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Client Base Size (Optional)</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger data-testid="select-client-base">
                              <SelectValue placeholder="Select client base size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1-25">1-25 clients</SelectItem>
                              <SelectItem value="26-100">26-100 clients</SelectItem>
                              <SelectItem value="101-500">101-500 clients</SelectItem>
                              <SelectItem value="500+">500+ clients</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Partnership Experience (Optional)</FormLabel>
                        <FormControl>
                          <Select onValueChange={field.onChange} value={field.value || ""}>
                            <SelectTrigger data-testid="select-experience-level">
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="new">New to partnerships</SelectItem>
                              <SelectItem value="some">Some experience</SelectItem>
                              <SelectItem value="experienced">Very experienced</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="howDidYouHear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How did you hear about us? (Optional)</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value || ""}>
                          <SelectTrigger data-testid="select-how-hear">
                            <SelectValue placeholder="Select how you heard about us" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="deals">Referral from colleague</SelectItem>
                            <SelectItem value="online-search">Online search</SelectItem>
                            <SelectItem value="social-media">Social media</SelectItem>
                            <SelectItem value="industry-event">Industry event</SelectItem>
                            <SelectItem value="professional-network">Professional network</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell us about your goals for client partnerships or any specific questions you have..."
                          className="min-h-[100px]"
                          {...field}
                          value={field.value || ""} 
                          data-testid="textarea-additional-info"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="marketingConsent"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value || false}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-marketing-consent"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal">
                          I consent to receive marketing communications about partnership opportunities and updates from PartnerConnector. You can unsubscribe at any time.
                        </FormLabel>
                      </div>
                    </FormItem>
                  )}
                />

                {submitError && (
                  <Alert variant="destructive" className="mb-4" data-testid="alert-submit-error">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertDescription>
                      {submitError}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  size="lg"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  disabled={waitlistMutation.isPending}
                  data-testid="button-join-waitlist"
                >
                  {waitlistMutation.isPending ? "Joining..." : "Join Exclusive Waitlist"}
                  {!waitlistMutation.isPending && <ArrowRightIcon className="ml-2 w-5 h-5" />}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700">EXCLUSIVE BENEFITS</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Join Early?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Being on our waitlist gives you priority access to the most lucrative partnership opportunities in the financial services sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-b from-blue-50 to-white">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Priority Access</h3>
              <p className="text-sm text-gray-600">Be first to access the platform when we launch, ahead of general availability</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-b from-green-50 to-white">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Higher Commission Rates</h3>
              <p className="text-sm text-gray-600">Early members get access to premium commission tiers and exclusive opportunities</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-b from-purple-50 to-white">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Exclusive Community</h3>
              <p className="text-sm text-gray-600">Join a select group of forward-thinking accountants building partnership success</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-b from-yellow-50 to-white">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <GraduationCapIcon className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Training & Support</h3>
              <p className="text-sm text-gray-600">Comprehensive training program to maximize your partnership success</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-b from-red-50 to-white">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Vetted Partners</h3>
              <p className="text-sm text-gray-600">Work only with pre-qualified, trusted financial service providers</p>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300 border-0 bg-gradient-to-b from-indigo-50 to-white">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <TargetIcon className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Personalized Matching</h3>
              <p className="text-sm text-gray-600">AI-powered client-partner matching for optimal success rates</p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
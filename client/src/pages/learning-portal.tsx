import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import CommissionCalculator from "@/components/commission-calculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlayCircleIcon, ClockIcon, TrendingUpIcon, CalculatorIcon, ArrowLeftIcon, CheckCircleIcon, PhoneIcon, MailIcon, ExternalLinkIcon } from "lucide-react";

export default function LearningPortal() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  const learningModules = [
    {
      id: "commission-basics",
      title: "Commission Calculation Basics",
      description: "Learn how to calculate potential commissions for different business types",
      duration: "15 min",
      level: "Beginner",
      completed: false,
    },
    {
      id: "dojo-switcher-statements",
      title: "Dojo Switcher Statements & LTR",
      description: "Master LTR calculation and statement handling for Dojo card payment partnerships",
      duration: "35 min",
      level: "Intermediate",
      completed: false,
    },
    {
      id: "business-assessment",
      title: "Business Assessment Techniques",
      description: "Master the art of evaluating client payment processing needs",
      duration: "25 min",
      level: "Intermediate",
      completed: false,
    },
    {
      id: "negotiation-strategies",
      title: "Referral Negotiation Strategies",
      description: "Advanced techniques for presenting payment solutions to clients",
      duration: "30 min",
      level: "Advanced",
      completed: false,
    },
    {
      id: "industry-insights",
      title: "Industry-Specific Insights",
      description: "Tailored approaches for restaurants, retail, and hospitality sectors",
      duration: "20 min",
      level: "Intermediate",
      completed: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4" data-testid="text-portal-title">
            Learning Portal
          </h1>
          <p className="text-xl text-muted-foreground">
            Master the art of deals sales and maximize your commission potential
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUpIcon className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground" data-testid="text-avg-commission">£850</h3>
              <p className="text-muted-foreground">Average Commission</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <ClockIcon className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground" data-testid="text-completion-time">2-3 Days</h3>
              <p className="text-muted-foreground">Average Completion Time</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <PlayCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground" data-testid="text-success-rate">87%</h3>
              <p className="text-muted-foreground">Platform Success Rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Module View */}
        {selectedModule === "dojo-switcher-statements" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button 
                variant="outline" 
                onClick={() => setSelectedModule(null)}
                className="flex items-center gap-2"
                data-testid="button-back-to-modules"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Back to Modules
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dojo Switcher Statements & LTR</h1>
                <p className="text-lg text-muted-foreground">Master LTR calculation and statement handling for successful partnerships</p>
              </div>
            </div>

            {/* Course Content */}
            <div className="grid gap-8">
              {/* Section 1: What is LTR */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">1</span>
                    </div>
                    What is LTR (Lifetime Rate)?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg font-medium text-blue-600">LTR = Lifetime Rate</p>
                  <p className="text-muted-foreground">Calculated using a customer's card payment statement.</p>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Essential for:</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        Showing how Dojo reduces costs
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        Verifying turnover
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircleIcon className="w-4 h-4 text-green-600" />
                        Spotting high-risk/restricted category businesses
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <h4 className="font-semibold text-yellow-800 mb-1">💡 Best Practice:</h4>
                    <p className="text-yellow-700 text-sm">Always get a statement before making an offer. If needed, help the customer log in to their provider's portal or request a copy.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Section 2: Why Statements Matter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-semibold text-sm">2</span>
                    </div>
                    Why Statements Matter
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-600 mb-2">Trust</h4>
                      <p className="text-sm text-muted-foreground">Statements prove the true cost, turnover, and provider setup.</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-600 mb-2">Accuracy</h4>
                      <p className="text-sm text-muted-foreground">Prevents quoting the wrong rate.</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-600 mb-2">Conversion</h4>
                      <p className="text-sm text-muted-foreground">Make the offer while the statement is open → higher chance of sign-up.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 3: Switcher Statement Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-semibold text-sm">3</span>
                    </div>
                    Switcher Statement Comparison
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">Once you have the statement, compare the customer's current fees with Dojo's offer.</p>
                  
                  <div className="grid gap-4">
                    <h4 className="font-semibold">Highlight:</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <TrendingUpIcon className="w-5 h-5 text-green-600" />
                        <span className="text-sm">Per-transaction savings</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Monthly fixed fee reductions</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <ClockIcon className="w-5 h-5 text-purple-600" />
                        <span className="text-sm">Faster settlement (Dojo = next-day)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Section 4: Acquirer Access Guide */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600 font-semibold text-sm">4</span>
                    </div>
                    Acquirer Statement Access Guide
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">Below are the main card acquirers and how to obtain customer statements.</p>
                  
                  <Tabs defaultValue="elavon" className="w-full">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                      <TabsTrigger value="elavon" className="text-xs" data-testid="tab-elavon">Elavon</TabsTrigger>
                      <TabsTrigger value="worldpay" className="text-xs" data-testid="tab-worldpay">Worldpay</TabsTrigger>
                      <TabsTrigger value="barclaycard" className="text-xs" data-testid="tab-barclaycard">Barclaycard</TabsTrigger>
                      <TabsTrigger value="global" className="text-xs" data-testid="tab-global">Global Pay</TabsTrigger>
                    </div>
                    
                    <TabsContent value="elavon" className="space-y-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-800 mb-3">🔹 Elavon</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium mb-2">Contact Information:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>UK: 0345 850 0195</li>
                              <li>ROI: 1850 202120</li>
                              <li>RMS: 01 4854946</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Online Access:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>Portal: www.elavonconnect.com</li>
                              <li>Email: documents@elavon.com</li>
                            </ul>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <p className="font-medium mb-2">Steps:</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Sign in / Register → input customer ID & bank details</li>
                            <li>Link emailed for access</li>
                            <li>Or call support → provide MID & bank details → username + temporary password sent</li>
                          </ol>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="worldpay" className="space-y-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-3">🔹 Worldpay / IOC Save</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium mb-2">Contact Information:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>Worldpay: 1800 242 637</li>
                              <li>IOC Save: 01 254 8883</li>
                              <li>Login support: 0345 761 6263</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Online Access:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>Portal: mybusiness.worldpay.com</li>
                              <li>Email: loyalty@worldpay.com</li>
                            </ul>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <p className="font-medium mb-2">Steps:</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Login with onboarding email</li>
                            <li>If forgotten → reset via email</li>
                            <li>Go to Invoice section to view statement</li>
                            <li>Or call login support for reset + emailed statement</li>
                          </ol>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="barclaycard" className="space-y-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-3">🔹 Barclaycard Payzone</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium mb-2">Contact Information:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>Support: 0844 822 2040</li>
                              <li>Email: customerservices@payzone.co.uk</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Online Access:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>Registration/Login: Barclaycard GPA Login</li>
                            </ul>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <p className="font-medium mb-2">Steps:</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Register using customer number, invoice number, and payment details</li>
                            <li>Access Statements Section</li>
                            <li>Switch to paperless for PDFs</li>
                          </ol>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="global" className="space-y-4">
                      <div className="bg-orange-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-orange-800 mb-3">🔹 Global Payments</h4>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="font-medium mb-2">Online Access:</p>
                            <ul className="space-y-1 text-muted-foreground">
                              <li>Portal: Business View</li>
                              <li>Email: customerservices@globalpay.com</li>
                            </ul>
                          </div>
                        </div>
                        <Separator className="my-3" />
                        <div>
                          <p className="font-medium mb-2">Steps:</p>
                          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                            <li>Register with customer number & bank details</li>
                            <li>Launch Business View Lite (free)</li>
                            <li>Go to Reports → eStatement → download PDF</li>
                          </ol>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-2">Additional Providers</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">First Data / Cardnet / XLN:</p>
                        <p className="text-muted-foreground">Support: 0345 606 5055</p>
                      </div>
                      <div>
                        <p className="font-medium">SumUp:</p>
                        <p className="text-muted-foreground">UK: 020 3510 0160 | ROI: 01 6971668</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Completion */}
              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-6 text-center">
                  <CheckCircleIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-green-800 mb-2">Module Complete!</h3>
                  <p className="text-green-700 mb-4">You've mastered Dojo LTR calculation and statement handling</p>
                  <Button 
                    onClick={() => {
                      setSelectedModule(null);
                    }}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-complete-module"
                  >
                    Return to Learning Portal
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Learning Modules */}
        {!selectedModule && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learningModules.map((module) => (
            <Card 
              key={module.id} 
              className="card-hover cursor-pointer" 
              data-testid={`module-${module.id}`}
              onClick={() => setSelectedModule(module.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                    <p className="text-muted-foreground text-sm">{module.description}</p>
                  </div>
                  <PlayCircleIcon className="w-8 h-8 text-primary ml-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Badge variant={module.level === "Beginner" ? "secondary" : module.level === "Intermediate" ? "default" : "destructive"}>
                      {module.level}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center">
                      <ClockIcon className="w-4 h-4 mr-1" />
                      {module.duration}
                    </span>
                  </div>
                  {module.completed && (
                    <Badge className="bg-green-600 text-white">
                      Completed
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        )}

        {/* Commission Calculator */}
        {!selectedModule && (
        <div className="mt-16">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4">
              <CalculatorIcon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Interactive Commission Calculator
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Practice calculating commissions with our interactive tools
            </p>
          </div>

          <Tabs defaultValue="payment" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="payment" className="text-lg py-3">
                Payment Processing
              </TabsTrigger>
              <TabsTrigger value="funding" className="text-lg py-3">
                Business Funding
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="payment">
              <CommissionCalculator type="payment" />
            </TabsContent>
            
            <TabsContent value="funding">
              <CommissionCalculator type="funding" />
            </TabsContent>
          </Tabs>
        </div>
        )}
      </div>
    </div>
  );
}

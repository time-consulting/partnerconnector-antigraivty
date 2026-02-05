import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  BarChart3Icon,
  BellIcon,
  FileTextIcon,
  DollarSignIcon,
  EyeIcon,
  MessageSquareIcon
} from "lucide-react";

export default function LeadTracking() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-purple-100 text-purple-700">LEAD TRACKING</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Track every deals{" "}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                from submission to payout
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Get complete visibility into your deals pipeline with real-time tracking, 
              automated updates, and detailed analytics to optimize your partnership success.
            </p>
            <Button 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4"
              onClick={() => window.location.href = "/login"}
            >
              View Your Pipeline
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Tracking Journey */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Referral Journey Tracking</h2>
            <p className="text-xl text-gray-600">Follow your deals through every stage of the process</p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-purple-200 to-blue-200 hidden lg:block"></div>

            <div className="space-y-12">
              {/* Step 1 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card className="lg:ml-auto p-8 border-0 shadow-lg max-w-md">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                        <FileTextIcon className="w-6 h-6 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">1. Submission</h3>
                        <Badge variant="outline" className="text-purple-700 border-purple-300">Active</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Your deals is submitted and enters our verification process. 
                      Initial quality checks are performed automatically.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Instant submission confirmation</li>
                      <li>• Automated data validation</li>
                      <li>• Partner notification sent</li>
                    </ul>
                  </CardContent>
                </Card>
                <div className="hidden lg:block">
                  <div className="w-6 h-6 bg-purple-600 rounded-full border-4 border-white shadow-lg mx-auto"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="hidden lg:block lg:order-1">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg mx-auto"></div>
                </div>
                <Card className="lg:order-2 p-8 border-0 shadow-lg max-w-md">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <EyeIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">2. Review</h3>
                        <Badge variant="outline" className="text-blue-700 border-blue-300">In Progress</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Our team reviews the deals details and contacts the client 
                      to understand their specific requirements.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Client qualification call</li>
                      <li>• Needs assessment</li>
                      <li>• Solution matching</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Step 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card className="lg:ml-auto p-8 border-0 shadow-lg max-w-md">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                        <FileTextIcon className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">3. Quote</h3>
                        <Badge variant="outline" className="text-green-700 border-green-300">Generated</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      A customized quote is prepared and sent to the client. 
                      Commission estimates are calculated and shown to you.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Personalized pricing</li>
                      <li>• Commission preview</li>
                      <li>• Quote delivery tracking</li>
                    </ul>
                  </CardContent>
                </Card>
                <div className="hidden lg:block">
                  <div className="w-6 h-6 bg-green-600 rounded-full border-4 border-white shadow-lg mx-auto"></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="hidden lg:block lg:order-1">
                  <div className="w-6 h-6 bg-yellow-600 rounded-full border-4 border-white shadow-lg mx-auto"></div>
                </div>
                <Card className="lg:order-2 p-8 border-0 shadow-lg max-w-md">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                        <MessageSquareIcon className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">4. Client Decision</h3>
                        <Badge variant="outline" className="text-yellow-700 border-yellow-300">Pending</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      The client reviews the quote and makes their decision. 
                      Our team provides support throughout the decision process.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Quote follow-up</li>
                      <li>• Client questions answered</li>
                      <li>• Decision tracking</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* Step 5 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <Card className="lg:ml-auto p-8 border-0 shadow-lg max-w-md">
                  <CardContent className="p-0">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                        <CheckCircleIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">5. Completion</h3>
                        <Badge className="bg-blue-600 text-white">Live</Badge>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">
                      Service goes live and commission is processed. 
                      Payment is automatically transferred to your account.
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Service activation</li>
                      <li>• Commission calculation</li>
                      <li>• Automatic payment</li>
                    </ul>
                  </CardContent>
                </Card>
                <div className="hidden lg:block">
                  <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Real-time Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Real-time Tracking Features</h2>
            <p className="text-xl text-gray-600">Stay informed with instant updates and comprehensive analytics</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 bg-white border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BellIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Instant Notifications</h3>
                <p className="text-sm text-gray-600">
                  Get notified immediately when your deals status changes or action is required
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Performance Analytics</h3>
                <p className="text-sm text-gray-600">
                  Track conversion rates, commission trends, and identify your best-performing deals sources
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSignIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Commission Tracking</h3>
                <p className="text-sm text-gray-600">
                  Monitor estimated and actual commissions with detailed breakdowns and payment schedules
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg text-center hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Timeline View</h3>
                <p className="text-sm text-gray-600">
                  Visualize the complete journey of each deals with timestamps and milestones
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Partner Dashboard</h2>
              <p className="text-lg text-gray-600 mb-8">
                Access all your tracking tools in one comprehensive dashboard designed 
                for maximum productivity and insight.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Real-time deals status updates</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Commission calculator and forecasting</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Performance benchmarking</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircleIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Mobile-responsive tracking</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="mt-8 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => window.location.href = "/login"}
              >
                Access Dashboard
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-0">
              <CardContent className="p-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">ABC Restaurant Ltd</span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                      <span className="font-medium text-gray-900">XYZ Retail Store</span>
                    </div>
                    <Badge className="bg-blue-100 text-blue-800">In Review</Badge>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium text-gray-900">Tech Solutions Inc</span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">Quote Sent</Badge>
                  </div>
                  <div className="text-center pt-4">
                    <div className="text-2xl font-bold text-gray-900">£2,850</div>
                    <div className="text-sm text-gray-600">Pending Commissions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Take Control of Your Referral Pipeline
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Start tracking your deals with complete transparency and real-time updates
          </p>
          <Button 
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Start Tracking Today
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
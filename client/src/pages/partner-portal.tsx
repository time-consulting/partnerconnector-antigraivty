import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUpIcon,
  BarChart3Icon,
  DollarSignIcon,
  UsersIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  FileTextIcon,
  MessageSquareIcon,
  BellIcon
} from "lucide-react";

export default function PartnerPortal() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700">PARTNER PORTAL</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Your partnership{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                command center
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access everything you need to manage your partnerships, track performance, 
              and maximize your earning potential in one centralized platform.
            </p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              onClick={() => window.location.href = "/login"}
            >
              Access Your Portal
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Portal Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Portal Features</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed as a partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3Icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Dashboard</h3>
                <p className="text-gray-600 mb-6">
                  Monitor your deals performance, conversion rates, and revenue trends with interactive charts and analytics.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Real-time performance metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Conversion rate tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Revenue forecasting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <DollarSignIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Management</h3>
                <p className="text-gray-600 mb-6">
                  Track all your commissions across multiple levels, view payment history, and forecast future earnings.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Multi-level commission tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Payment history and schedules
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Earnings forecasting
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UsersIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Team Management</h3>
                <p className="text-gray-600 mb-6">
                  Manage your team members, assign roles, and track team performance with comprehensive team tools.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Role-based permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Team performance metrics
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Invitation management
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FileTextIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Referral Management</h3>
                <p className="text-gray-600 mb-6">
                  Submit new deals, track existing ones, and manage client relationships all in one place.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Quick deals submission
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Status tracking
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Client communication history
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BellIcon className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Notifications</h3>
                <p className="text-gray-600 mb-6">
                  Stay informed with intelligent notifications about deals updates, commission payments, and opportunities.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Real-time status updates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Payment notifications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Opportunity alerts
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUpIcon className="w-8 h-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth Tools</h3>
                <p className="text-gray-600 mb-6">
                  Access tools and resources designed to help you grow your partnership business and increase earnings.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Marketing materials
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Training resources
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Best practice guides
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mobile App */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Access Anywhere</h2>
              <p className="text-lg text-gray-600 mb-8">
                Your partner portal is fully responsive and optimized for mobile devices. 
                Manage your partnerships on the go with our mobile-first design.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Mobile-responsive design</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Offline capability for core features</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Push notifications</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-gray-700">Biometric authentication</span>
                </div>
              </div>

              <Button 
                size="lg"
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = "/login"}
              >
                Try Mobile Portal
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardContent className="p-0">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4 bg-white border-0 shadow-sm">
                    <div className="text-center">
                      <ClockIcon className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">24/7</div>
                      <div className="text-sm text-gray-600">Access</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border-0 shadow-sm">
                    <div className="text-center">
                      <MessageSquareIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">Live</div>
                      <div className="text-sm text-gray-600">Support</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border-0 shadow-sm">
                    <div className="text-center">
                      <BarChart3Icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">Real-time</div>
                      <div className="text-sm text-gray-600">Data</div>
                    </div>
                  </Card>
                  <Card className="p-4 bg-white border-0 shadow-sm">
                    <div className="text-center">
                      <DollarSignIcon className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                      <div className="text-lg font-bold text-gray-900">Instant</div>
                      <div className="text-sm text-gray-600">Payments</div>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Partnerships?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Access your comprehensive partner portal and start maximizing your earning potential today
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Access Portal Now
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
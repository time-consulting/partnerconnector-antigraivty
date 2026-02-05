import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckIcon, 
  ArrowRightIcon,
  UserPlusIcon,
  DollarSignIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  ClockIcon,
  UsersIcon
} from "lucide-react";

export default function PartnerOnboarding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700">PARTNER ONBOARDING</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Start earning through{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                strategic partnerships
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Join our partner network and transform your professional connections into a sustainable revenue stream. 
              We'll guide you through every step of the partnership journey.
            </p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              onClick={() => window.location.href = "/login"}
            >
              Start Your Partnership Journey
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Getting Started Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How to Get Started</h2>
            <p className="text-xl text-gray-600">Follow these simple steps to begin earning through partnerships</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UserPlusIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Sign Up & Verify</h3>
                <p className="text-gray-600 mb-6">
                  Create your partner account and complete our quick verification process. 
                  We'll review your application within 24 hours.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Complete partner application
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Verify professional credentials
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Set up banking details
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUpIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Learn & Train</h3>
                <p className="text-gray-600 mb-6">
                  Access our comprehensive training portal and learn best practices for 
                  partnership success and client relationship management.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Partnership fundamentals course
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Client communication templates
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Commission optimization strategies
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <DollarSignIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Start Earning</h3>
                <p className="text-gray-600 mb-6">
                  Begin submitting deals and watch your revenue grow. Our platform 
                  handles everything from lead tracking to commission payments.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Submit your first deals
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Track progress in real-time
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Receive automated payments
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partner Benefits</h2>
            <p className="text-xl text-gray-600">Everything you need to succeed as a partner</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <DollarSignIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">High Commissions</h3>
                <p className="text-sm text-gray-600">Earn up to £2,000 per successful deals with our competitive commission structure</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ClockIcon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Fast Payouts</h3>
                <p className="text-sm text-gray-600">Get paid within 24-48 hours of deal completion with automated payment processing</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <ShieldCheckIcon className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Full Support</h3>
                <p className="text-sm text-gray-600">Dedicated account managers and 24/7 support to help you succeed</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <UsersIcon className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Network Access</h3>
                <p className="text-sm text-gray-600">Connect with our network of verified partners and clients</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Requirements */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Partner Requirements</h2>
              <p className="text-lg text-gray-600 mb-8">
                We work with qualified professionals who understand business relationships and 
                can represent our services with integrity.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Professional Background</h4>
                    <p className="text-gray-600">Accountant, business consultant, financial advisor, or similar professional role</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Client Network</h4>
                    <p className="text-gray-600">Established relationships with business owners who could benefit from our services</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">UK Based</h4>
                    <p className="text-gray-600">Must be based in the UK with valid business credentials and banking details</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg"
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = "/login"}
              >
                Apply to Become a Partner
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center bg-gradient-to-b from-blue-50 to-white border-0">
                <div className="text-3xl font-bold text-blue-600 mb-2">£850</div>
                <div className="text-sm text-gray-600">Average Commission</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-b from-green-50 to-white border-0">
                <div className="text-3xl font-bold text-green-600 mb-2">87%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-b from-purple-50 to-white border-0">
                <div className="text-3xl font-bold text-purple-600 mb-2">24h</div>
                <div className="text-sm text-gray-600">Approval Time</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-b from-yellow-50 to-white border-0">
                <div className="text-3xl font-bold text-yellow-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Active Partners</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Partnership Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of professionals already earning through our partnership platform
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Get Started Today
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
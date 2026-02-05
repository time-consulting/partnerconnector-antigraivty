import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TargetIcon,
  TrendingUpIcon,
  UsersIcon,
  SearchIcon,
  ArrowRightIcon,
  CheckIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  NetworkIcon
} from "lucide-react";

export default function PartnerRecruitment() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700">FOR VENDORS</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Scale your business with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                strategic partners
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Access our network of qualified partners and accelerate your growth. 
              Our platform connects you with the right professionals to expand your reach.
            </p>
            <Button 
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4"
              onClick={() => window.location.href = "/login"}
            >
              Start Partner Program
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Partner Network Stats */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
            <Card className="p-6 text-center bg-gradient-to-b from-blue-50 to-white border-0">
              <UsersIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-gray-600">Active Partners</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-b from-green-50 to-white border-0">
              <TrendingUpIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">£2.5M</div>
              <div className="text-sm text-gray-600">Revenue Generated</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-b from-purple-50 to-white border-0">
              <TargetIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">85%</div>
              <div className="text-sm text-gray-600">Conversion Rate</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-b from-yellow-50 to-white border-0">
              <NetworkIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-600 mb-2">15+</div>
              <div className="text-sm text-gray-600">Industry Sectors</div>
            </Card>
          </div>

          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partner Network Overview</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our carefully curated network of professionals spans multiple industries and specializations
            </p>
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Partner Specializations</h2>
            <p className="text-xl text-gray-600">Connect with professionals who understand your industry</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Accountants & CPAs</h3>
                <p className="text-gray-600 mb-6">
                  Qualified accounting professionals with deep client relationships in business and finance sectors.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    150+ active partners
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Business tax specialists
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    SME focus
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUpIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Business Consultants</h3>
                <p className="text-gray-600 mb-6">
                  Strategic advisors helping businesses optimize operations and drive growth across industries.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    200+ consultants
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Growth strategy experts
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Multi-sector experience
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3Icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Financial Advisors</h3>
                <p className="text-gray-600 mb-6">
                  Licensed financial professionals providing comprehensive wealth management and business financial services.
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    120+ advisors
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Business banking focus
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Wealth management
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits for Vendors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Why Choose Our Partner Network?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Access pre-qualified partners who understand your business and can deliver results. 
                Our platform ensures quality connections and streamlined management.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Qualified Partners Only</h4>
                    <p className="text-gray-600">All partners are verified professionals with proven track records</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Performance Tracking</h4>
                    <p className="text-gray-600">Monitor partner performance and optimize your program</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Automated Management</h4>
                    <p className="text-gray-600">Streamlined onboarding, tracking, and commission payments</p>
                  </div>
                </div>
              </div>

              <Button 
                size="lg"
                className="mt-8 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => window.location.href = "/login"}
              >
                Launch Partner Program
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </div>

            <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0">
              <CardContent className="p-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Partner Program Benefits</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">Quality Leads</span>
                    <span className="text-green-600 font-semibold">85% conversion</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">Time to First Lead</span>
                    <span className="text-blue-600 font-semibold">&lt; 7 days</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">Partner Retention</span>
                    <span className="text-purple-600 font-semibold">94%</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                    <span className="text-gray-700">ROI Improvement</span>
                    <span className="text-yellow-600 font-semibold">3.2x average</span>
                  </div>
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
            Ready to Scale with Partners?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join leading vendors who are growing their business through our partner network
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
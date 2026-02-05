import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  UsersIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  HeartIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon,
  AwardIcon
} from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-blue-100 text-blue-700">ABOUT US</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Empowering growth through{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                strategic partnerships
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              We're on a mission to transform how businesses discover and leverage partnerships, 
              creating opportunities for sustainable growth and mutual success.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, PartnerConnector was born from a simple observation: 
                countless businesses were missing out on valuable partnerships that could 
                accelerate their growth and success.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our founders, experienced business consultants themselves, recognized the 
                challenge of connecting businesses with the right partners and saw an 
                opportunity to create a platform that would make these connections seamless, 
                transparent, and mutually beneficial.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparency First</h4>
                    <p className="text-gray-600">Every partnership is built on trust and clear communication</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Mutual Success</h4>
                    <p className="text-gray-600">We believe the best partnerships benefit everyone involved</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Continuous Innovation</h4>
                    <p className="text-gray-600">We're constantly improving our platform and processes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center bg-gradient-to-b from-blue-50 to-white border-0">
                <UsersIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-sm text-gray-600">Active Partners</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-b from-green-50 to-white border-0">
                <TrendingUpIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-green-600 mb-2">£2.5M</div>
                <div className="text-sm text-gray-600">Commissions Paid</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-b from-purple-50 to-white border-0">
                <ShieldCheckIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-purple-600 mb-2">98%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </Card>
              <Card className="p-6 text-center bg-gradient-to-b from-yellow-50 to-white border-0">
                <HeartIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <div className="text-3xl font-bold text-yellow-600 mb-2">4.9</div>
                <div className="text-sm text-gray-600">Partner Rating</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Integrity</h3>
                <p className="text-gray-600">
                  We operate with complete transparency and honesty in every interaction, 
                  building trust through consistent actions.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUpIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Excellence</h3>
                <p className="text-gray-600">
                  We strive for excellence in every aspect of our service, 
                  continuously improving to exceed expectations.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UsersIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Collaboration</h3>
                <p className="text-gray-600">
                  We believe that the best results come from working together, 
                  fostering partnerships that benefit everyone.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <HeartIcon className="w-8 h-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Impact</h3>
                <p className="text-gray-600">
                  We're committed to making a positive impact on businesses and 
                  communities through meaningful partnerships.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Leadership Team</h2>
            <p className="text-xl text-gray-600">Experienced professionals dedicated to your success</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">JS</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">James Smith</h3>
                <p className="text-blue-600 mb-4">Chief Executive Officer</p>
                <p className="text-sm text-gray-600">
                  15+ years in business development and partnerships. Former consultant at McKinsey & Company.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">EJ</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Emma Johnson</h3>
                <p className="text-green-600 mb-4">Chief Technology Officer</p>
                <p className="text-sm text-gray-600">
                  Technology leader with 12+ years building scalable platforms. Former engineering director at Stripe.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">MW</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Michael Wilson</h3>
                <p className="text-purple-600 mb-4">Chief Revenue Officer</p>
                <p className="text-sm text-gray-600">
                  Sales and revenue expert with 18+ years experience. Previously VP Sales at Salesforce.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Awards & Recognition */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Awards & Recognition</h2>
            <p className="text-xl text-gray-600">Industry recognition for our innovation and excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <AwardIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Best FinTech Platform</h3>
                <p className="text-sm text-gray-600">UK FinTech Awards 2023</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <StarIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Innovation Award</h3>
                <p className="text-sm text-gray-600">Partnership Excellence 2023</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <TrendingUpIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Fastest Growing</h3>
                <p className="text-sm text-gray-600">Tech Nation Rising 2022</p>
              </CardContent>
            </Card>

            <Card className="p-6 text-center bg-white border-0 shadow-lg">
              <CardContent className="p-0">
                <UsersIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">Customer Choice</h3>
                <p className="text-sm text-gray-600">Business Weekly 2023</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Partner with Us?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join our mission to transform business partnerships and create opportunities for growth
          </p>
          <Button 
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/login"}
          >
            Become a Partner
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
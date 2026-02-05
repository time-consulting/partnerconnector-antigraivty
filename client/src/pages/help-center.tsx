import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  SearchIcon,
  HeadphonesIcon,
  BookOpenIcon,
  MessageSquareIcon,
  HelpCircleIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  StarIcon
} from "lucide-react";

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-700">HELP CENTER</Badge>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            How can we{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              help you today?
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Find answers, get support, and learn how to maximize your partnership success
          </p>
          
          <div className="relative max-w-md mx-auto mb-8">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input 
              placeholder="Search for help..." 
              className="pl-10 py-3 text-lg border-2 border-gray-200 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Getting Started</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Commission Payments</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Referral Tracking</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-blue-50">Team Management</Badge>
          </div>
        </div>
      </section>

      {/* Quick Help Options */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <MessageSquareIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Live Chat</h3>
                <p className="text-gray-600 mb-6">
                  Get instant help from our support team. Available 24/7 for urgent issues.
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online now</span>
                </div>
              </CardContent>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <HeadphonesIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Phone Support</h3>
                <p className="text-gray-600 mb-6">
                  Speak directly with our experts. Perfect for complex questions or account issues.
                </p>
                <p className="text-gray-900 font-semibold">0800 123 4567</p>
                <p className="text-gray-600 text-sm">Mon-Fri 9AM-6PM</p>
              </CardContent>
            </Card>

            <Card className="p-8 text-center border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpenIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Knowledge Base</h3>
                <p className="text-gray-600 mb-6">
                  Browse our comprehensive guides, tutorials, and frequently asked questions.
                </p>
                <div className="text-purple-600 text-sm">
                  <span>200+ articles</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Topics */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Help Topics</h2>
            <p className="text-xl text-gray-600">Quick answers to the most common questions</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircleIcon className="w-5 h-5 text-blue-600" />
                  Getting Started
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">How to submit your first deals</h4>
                    <p className="text-sm text-gray-600">Step-by-step guide to getting started</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Setting up your partner account</h4>
                    <p className="text-sm text-gray-600">Complete your profile and verification</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Understanding commission structure</h4>
                    <p className="text-sm text-gray-600">Learn how our multi-tier system works</p>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircleIcon className="w-5 h-5 text-green-600" />
                  Payments & Commissions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">When will I receive my commission?</h4>
                    <p className="text-sm text-gray-600">Payment schedules and processing times</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">How to update banking details</h4>
                    <p className="text-sm text-gray-600">Manage your payment information</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Commission calculation methods</h4>
                    <p className="text-sm text-gray-600">Understanding how we calculate payments</p>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircleIcon className="w-5 h-5 text-purple-600" />
                  Referral Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Tracking deals status</h4>
                    <p className="text-sm text-gray-600">Monitor your deals in real-time</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">What makes a good deals?</h4>
                    <p className="text-sm text-gray-600">Tips for high-quality submissions</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Following up with clients</h4>
                    <p className="text-sm text-gray-600">Best practices for client communication</p>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircleIcon className="w-5 h-5 text-yellow-600" />
                  Team & Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Adding team members</h4>
                    <p className="text-sm text-gray-600">Invite colleagues to your account</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Managing permissions</h4>
                    <p className="text-sm text-gray-600">Control what team members can access</p>
                  </a>
                  <a href="#" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <h4 className="font-medium text-gray-900">Account security</h4>
                    <p className="text-sm text-gray-600">Keep your account safe and secure</p>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Support Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Support Promise</h2>
            <p className="text-xl text-gray-600">We're here to help you succeed</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-6 text-center bg-gradient-to-b from-blue-50 to-white border-0">
              <ClockIcon className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-blue-600 mb-2">&lt; 2min</div>
              <div className="text-sm text-gray-600">Average Response Time</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-b from-green-50 to-white border-0">
              <CheckIcon className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">First Contact Resolution</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-b from-purple-50 to-white border-0">
              <StarIcon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
              <div className="text-sm text-gray-600">Customer Satisfaction</div>
            </Card>

            <Card className="p-6 text-center bg-gradient-to-b from-yellow-50 to-white border-0">
              <HeadphonesIcon className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
              <div className="text-sm text-gray-600">Support Availability</div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Still Need Help?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Our support team is standing by to assist you with any questions or concerns
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            >
              Start Live Chat
              <MessageSquareIcon className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold"
            >
              Browse Knowledge Base
              <BookOpenIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
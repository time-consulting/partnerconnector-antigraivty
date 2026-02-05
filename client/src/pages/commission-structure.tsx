import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSignIcon,
  TrendingUpIcon,
  UsersIcon,
  CrownIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon
} from "lucide-react";

export default function CommissionStructure() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-6 bg-green-100 text-green-700">COMMISSION STRUCTURE</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Multi-tier{" "}
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                commission system
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Earn at multiple levels through our innovative partnership structure. 
              The more you grow your network, the more revenue opportunities you unlock.
            </p>
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
              onClick={() => window.location.href = "/login"}
            >
              View Your Commission Potential
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Commission Tiers */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Commission Tiers</h2>
            <p className="text-xl text-gray-600">Earn commissions across three levels of your partnership network</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Level 1 - Direct */}
            <Card className="relative p-8 border-2 border-green-200 bg-gradient-to-b from-green-50 to-white hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <DollarSignIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Level 1</h3>
                <h4 className="text-lg font-semibold text-green-600 mb-4">Direct Referrals</h4>
                <div className="text-4xl font-bold text-green-600 mb-4">60%</div>
                <p className="text-gray-600 mb-6">
                  Earn the highest commission rate on clients you directly refer to our platform
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    £150 - £800 per deal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Immediate payment processing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    Full client relationship control
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Level 2 - Network */}
            <Card className="relative p-8 border-2 border-blue-200 bg-gradient-to-b from-blue-50 to-white hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <UsersIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Level 2</h3>
                <h4 className="text-lg font-semibold text-blue-600 mb-4">Partner Network</h4>
                <div className="text-4xl font-bold text-blue-600 mb-4">20%</div>
                <p className="text-gray-600 mb-6">
                  Earn commissions from partners you've recruited to the platform
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                    £30 - £160 per deal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                    Passive income stream
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-blue-600" />
                    Network growth rewards
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Level 3 - Extended Network */}
            <Card className="relative p-8 border-2 border-purple-200 bg-gradient-to-b from-purple-50 to-white hover:shadow-xl transition-shadow">
              <CardContent className="p-0 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUpIcon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Level 3</h3>
                <h4 className="text-lg font-semibold text-purple-600 mb-4">Extended Network</h4>
                <div className="text-4xl font-bold text-purple-600 mb-4">10%</div>
                <p className="text-gray-600 mb-6">
                  Earn from your extended network as your partners recruit others
                </p>
                <ul className="text-left text-sm text-gray-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-purple-600" />
                    £15 - £80 per deal
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-purple-600" />
                    Compound network effects
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-purple-600" />
                    Leadership rewards
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Example Calculation */}
          <Card className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-0">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-bold text-gray-900">Example Monthly Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">£1,800</div>
                  <div className="text-sm text-gray-600 mb-2">3 Direct Referrals</div>
                  <div className="text-xs text-gray-500">3 × £600 average</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">£1,800</div>
                  <div className="text-sm text-gray-600 mb-2">6 Level 2 Commissions</div>
                  <div className="text-xs text-gray-500">6 × £300 average</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">£600</div>
                  <div className="text-sm text-gray-600 mb-2">6 Level 3 Commissions</div>
                  <div className="text-xs text-gray-500">6 × £100 average</div>
                </div>
              </div>
              <div className="text-center mt-8 pt-8 border-t border-gray-200">
                <div className="text-4xl font-bold text-gray-900 mb-2">£4,200</div>
                <div className="text-lg text-gray-600">Total Monthly Potential</div>
                <div className="text-sm text-gray-500 mt-2">Build your team for ongoing monthly income</div>
                <div className="text-xs text-gray-400 mt-2 italic">*Higher earnings available for switching business</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Commission Types */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Commission Types</h2>
            <p className="text-xl text-gray-600">Different services offer varying commission rates</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="p-6 bg-white border-0 shadow-lg text-center">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-blue-600 mb-2">£150-£400</div>
                <h3 className="font-semibold text-gray-900 mb-2">Card Machines</h3>
                <p className="text-sm text-gray-600">Payment processing solutions for retail businesses</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg text-center">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-green-600 mb-2">£200-£600</div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Funding</h3>
                <p className="text-sm text-gray-600">Merchant cash advances and business loans</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg text-center">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-purple-600 mb-2">£75-£250</div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Utilities</h3>
                <p className="text-sm text-gray-600">Energy, telecoms, and essential business services</p>
              </CardContent>
            </Card>

            <Card className="p-6 bg-white border-0 shadow-lg text-center">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-yellow-600 mb-2">£100-£300</div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Insurance</h3>
                <p className="text-sm text-gray-600">Comprehensive business protection packages</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Payment Information */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Payment Process</h2>
              <p className="text-lg text-gray-600 mb-8">
                Our automated commission system ensures you get paid quickly and accurately 
                for every successful deals and network activity.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Deal Completion</h4>
                    <p className="text-gray-600">Commission is calculated when the client's service goes live</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Automatic Processing</h4>
                    <p className="text-gray-600">Payments are processed automatically within 24-48 hours</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Bank Transfer</h4>
                    <p className="text-gray-600">Funds are transferred directly to your registered bank account</p>
                  </div>
                </div>
              </div>
            </div>

            <Card className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-0">
              <CardContent className="p-0">
                <div className="text-center mb-6">
                  <StarIcon className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900">Top Performer Benefits</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-3">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Monthly bonuses for top performers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Quarterly performance rewards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Annual recognition programs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckIcon className="w-4 h-4 text-green-600" />
                    <span>Exclusive partner events and training</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Start Building Your Commission Portfolio
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Join our multi-tier commission system and unlock unlimited earning potential
          </p>
          <Button 
            size="lg"
            className="bg-white text-green-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
            onClick={() => window.location.href = "/api/login"}
          >
            Calculate Your Earnings
            <ArrowRightIcon className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
import Navigation from "@/components/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  CalendarIcon, 
  CheckIcon, 
  ClockIcon, 
  HeadphonesIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
  GiftIcon
} from "lucide-react";
import { useEffect } from "react";

export default function BookDemo() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://get.partnerconnector.co.uk/js/form_embed.js";
    script.type = "text/javascript";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1419]">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div>
              <Badge className="mb-4 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-400/30" data-testid="badge-free-demo">
                <GiftIcon className="w-3 h-3 mr-1" />
                Free Demo - No Obligation
              </Badge>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight">
                See How Our{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Free Financial Tool
                </span>{" "}
                Can Transform Your Practice
              </h1>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Book a quick 15-minute demo to discover how PartnerConnector helps you connect clients with payment solutions while earning substantial commissions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-cyan-400" />
                What You'll Learn
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300">How to earn up to 60% commission on every client referral</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300">Our free tools to manage and track your client referrals</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300">Build a team and earn from their success too</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-gray-300">Get answers to all your questions from our team</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-400/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <ClockIcon className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">15 mins</p>
                  <p className="text-gray-400 text-xs">Quick Demo</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-400/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <HeadphonesIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">1-on-1</p>
                  <p className="text-gray-400 text-xs">Personal Support</p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-400/20 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <TrendingUpIcon className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                  <p className="text-white font-semibold">60%</p>
                  <p className="text-gray-400 text-xs">Commission</p>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-400/30 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">100% Free - No Strings Attached</h4>
                    <p className="text-gray-300 text-sm">
                      Our platform is completely free to use. No hidden fees, no subscription costs. You only earn - never pay.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:sticky lg:top-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Schedule Your Free Demo</h2>
                  <p className="text-blue-100">Pick a time that works for you</p>
                </div>
                
                <div className="p-6 min-h-[600px]">
                  <iframe 
                    src="https://get.partnerconnector.co.uk/widget/booking/QXgXo2TvJcFk7OqArCu2" 
                    style={{ width: "100%", minHeight: "550px", border: "none", overflow: "hidden" }}
                    scrolling="no" 
                    id="booking-calendar-embed"
                    data-testid="iframe-booking-calendar"
                    title="Book a Demo Calendar"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

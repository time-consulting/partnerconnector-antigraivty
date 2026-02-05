import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSignIcon, 
  TrendingUpIcon,
  BuildingIcon,
  CreditCardIcon,
  PiggyBankIcon,
  MapPinIcon
} from "lucide-react";

interface CommissionCalculatorProps {
  type?: "payment" | "funding";
  className?: string;
}

export default function CommissionCalculator({ type = "payment", className = "" }: CommissionCalculatorProps) {
  const [monthlyVolume, setMonthlyVolume] = useState([50000]);
  const [locations, setLocations] = useState([1]);
  const [fundingAmount, setFundingAmount] = useState([50000]);

  // Payment processing commission calculation (Level 1 upfront commissions)
  const calculatePaymentCommission = () => {
    const volume = monthlyVolume[0];
    const locationCount = locations[0];
    
    let baseCommission = 0;
    
    // Base commission based on volume
    if (volume <= 10000) baseCommission = 200;
    else if (volume <= 25000) baseCommission = 500;
    else if (volume <= 50000) baseCommission = 800;
    else if (volume <= 100000) baseCommission = 1500;
    else if (volume <= 250000) baseCommission = 3000;
    else if (volume <= 500000) baseCommission = 5000;
    else baseCommission = 8000;
    
    // Location multiplier
    const locationMultiplier = 1 + (locationCount - 1) * 0.3;
    
    // Apply Level 1 upfront commission rate
    const totalCommission = Math.round(baseCommission * locationMultiplier);
    
    return {
      baseCommission: Math.round(baseCommission * locationMultiplier),
      yourCommission: totalCommission,
      monthlyPotential: Math.round(totalCommission * 4), // Assuming 4 deals per month
    };
  };

  // Business funding commission calculation - Fixed £250 per £10,000
  const calculateFundingCommission = () => {
    const funding = fundingAmount[0];
    
    // Fixed rate: £250 commission per £10,000 funding
    const baseCommission = Math.round((funding / 10000) * 250);
    const yourCommission = Math.round(baseCommission * 0.6); // 60% commission structure
    
    return {
      baseCommission,
      yourCommission,
      monthlyPotential: Math.round(yourCommission * 2), // Assuming 2 funding deals per month
    };
  };

  const paymentResults = type === "payment" ? calculatePaymentCommission() : null;
  const fundingResults = type === "funding" ? calculateFundingCommission() : null;

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-xl ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-2">
          {type === "payment" ? (
            <CreditCardIcon className="w-8 h-8 text-blue-600" />
          ) : (
            <PiggyBankIcon className="w-8 h-8 text-green-600" />
          )}
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {type === "payment" ? "Payment Processing" : "Business Funding"} Calculator
            </CardTitle>
            <p className="text-gray-600 text-sm">
              {type === "payment" 
                ? "Calculate your commission based on business volume and locations"
                : "Calculate your commission based on funding amounts"
              }
            </p>
          </div>
        </div>
        <Badge className="w-fit bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          Level 1: Upfront Commissions
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {type === "payment" ? (
          <>
            {/* Monthly Volume Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <TrendingUpIcon className="w-5 h-5 text-blue-600" />
                  Monthly Volume
                </label>
                <span className="text-2xl font-bold text-blue-600">
                  £{monthlyVolume[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={monthlyVolume}
                onValueChange={setMonthlyVolume}
                max={1000000}
                min={5000}
                step={5000}
                className="w-full"
                data-testid="slider-monthly-volume"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>£5K</span>
                <span>£1M</span>
              </div>
            </div>

            {/* Number of Locations Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MapPinIcon className="w-5 h-5 text-green-600" />
                  Number of Locations
                </label>
                <span className="text-2xl font-bold text-green-600">
                  {locations[0]}
                </span>
              </div>
              <Slider
                value={locations}
                onValueChange={setLocations}
                max={20}
                min={1}
                step={1}
                className="w-full"
                data-testid="slider-locations"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>1 Location</span>
                <span>20+ Locations</span>
              </div>
            </div>

            {/* Commission Results */}
            {paymentResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Base Commission</div>
                  <div className="text-2xl font-bold text-gray-900" data-testid="text-base-commission">
                    £{paymentResults.baseCommission.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-xl">
                  <div className="text-sm text-blue-100 mb-1">Your Commission (60%)</div>
                  <div className="text-2xl font-bold" data-testid="text-your-commission">
                    £{paymentResults.yourCommission.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Monthly Potential</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="text-monthly-potential">
                    £{paymentResults.monthlyPotential.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Funding Amount Slider */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <DollarSignIcon className="w-5 h-5 text-green-600" />
                  Funding Amount
                </label>
                <span className="text-2xl font-bold text-green-600">
                  £{fundingAmount[0].toLocaleString()}
                </span>
              </div>
              <Slider
                value={fundingAmount}
                onValueChange={setFundingAmount}
                max={500000}
                min={10000}
                step={5000}
                className="w-full"
                data-testid="slider-funding-amount"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>£10K</span>
                <span>£500K</span>
              </div>
            </div>

            {/* Funding Examples */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-xl">
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">£10K Funded</div>
                <div className="text-xl font-bold text-green-600">£150 Commission</div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">£100K Funded</div>
                <div className="text-xl font-bold text-green-600">£1,500 Commission</div>
              </div>
            </div>

            {/* Funding Commission Results */}
            {fundingResults && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Base Commission</div>
                  <div className="text-2xl font-bold text-gray-900" data-testid="text-funding-base-commission">
                    £{fundingResults.baseCommission.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-green-500 to-blue-600 text-white rounded-xl">
                  <div className="text-sm text-green-100 mb-1">Your Commission (60%)</div>
                  <div className="text-2xl font-bold" data-testid="text-funding-your-commission">
                    £{fundingResults.yourCommission.toLocaleString()}
                  </div>
                </div>
                <div className="text-center p-4 bg-white/60 backdrop-blur-sm rounded-xl">
                  <div className="text-sm text-gray-600 mb-1">Monthly Potential</div>
                  <div className="text-2xl font-bold text-green-600" data-testid="text-funding-monthly-potential">
                    £{fundingResults.monthlyPotential.toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
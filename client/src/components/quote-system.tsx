import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle2, 
  TrendingDown, 
  CreditCard, 
  Building,
  Shield,
  Laptop,
  Calculator,
  Star
} from "lucide-react";

interface QuoteRate {
  type: string;
  currentRate: string;
  newRate: string;
  savings: string;
  icon: React.ReactNode;
  color: string;
}

interface QuoteSystemProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  deals: {
    id: string;
    businessName: string;
    businessEmail: string;
    monthlyVolume?: string;
    currentProcessor?: string;
  };
}

export default function QuoteSystem({ isOpen, onClose, onApprove, deals }: QuoteSystemProps) {
  const [isApproving, setIsApproving] = useState(false);

  // Mock quote data - in real app this would come from backend
  const quoteRates: QuoteRate[] = [
    {
      type: "Debit Cards",
      currentRate: "0.55%",
      newRate: "0.35%",
      savings: "0.20%",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-blue-600"
    },
    {
      type: "Credit Cards", 
      currentRate: "1.45%",
      newRate: "1.15%",
      savings: "0.30%",
      icon: <CreditCard className="w-5 h-5" />,
      color: "text-green-600"
    },
    {
      type: "Corporate Cards",
      currentRate: "1.85%",
      newRate: "1.35%", 
      savings: "0.50%",
      icon: <Building className="w-5 h-5" />,
      color: "text-purple-600"
    }
  ];

  const fixedFees = [
    {
      type: "Secure Fee",
      current: "£45.00",
      new: "£25.00",
      savings: "£20.00",
      icon: <Shield className="w-4 h-4" />,
      color: "text-orange-600"
    },
    {
      type: "Platform Fee", 
      current: "£35.00",
      new: "£15.00",
      savings: "£20.00",
      icon: <Laptop className="w-4 h-4" />,
      color: "text-indigo-600"
    },
    {
      type: "Terminal Cost",
      current: "£299.00",
      new: "FREE",
      savings: "£299.00",
      icon: <Calculator className="w-4 h-4" />,
      color: "text-red-600"
    }
  ];

  const monthlyVolume = parseInt(deals.monthlyVolume?.replace(/[£,]/g, '') || '50000');
  const totalMonthlySavings = quoteRates.reduce((total, rate) => {
    const currentPercent = parseFloat(rate.currentRate) / 100;
    const newPercent = parseFloat(rate.newRate) / 100;
    const savingsPercent = currentPercent - newPercent;
    return total + (monthlyVolume * 0.3 * savingsPercent); // Assuming 30% split across card types
  }, 0);

  const monthlyFeeSavings = fixedFees.reduce((total, fee) => {
    if (fee.new === "FREE") return total + parseFloat(fee.current.replace(/[£,]/g, ''));
    return total + (parseFloat(fee.current.replace(/[£,]/g, '')) - parseFloat(fee.new.replace(/[£,]/g, '')));
  }, 0);

  const totalSavings = totalMonthlySavings + monthlyFeeSavings;
  const annualSavings = totalSavings * 12;

  const handleApprove = async () => {
    setIsApproving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsApproving(false);
    onApprove();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Star className="w-6 h-6 text-yellow-500" />
            Competitive Quote Ready - {deals.businessName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Savings Summary */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-green-200">
            <CardContent className="pt-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  💰 Potential Monthly Savings
                </h3>
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  £{totalSavings.toFixed(2)}
                </div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Annual Savings: £{annualSavings.toFixed(2)}
                </div>
                <Badge className="mt-2 bg-green-600 text-white">
                  {((totalSavings / monthlyVolume) * 100).toFixed(2)}% Total Reduction
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Transaction Rates Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                Transaction Rate Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quoteRates.map((rate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`${rate.color}`}>
                        {rate.icon}
                      </div>
                      <div>
                        <p className="font-medium">{rate.type}</p>
                        <p className="text-sm text-muted-foreground">Per transaction</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Current</p>
                          <p className="font-medium text-red-600">{rate.currentRate}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Our Rate</p>
                          <p className="font-medium text-green-600">{rate.newRate}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Savings</p>
                          <Badge variant="secondary" className="text-green-600 border-green-200">
                            -{rate.savings}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Fixed Fees Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Monthly Fees Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fixedFees.map((fee, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`${fee.color}`}>
                        {fee.icon}
                      </div>
                      <div>
                        <p className="font-medium">{fee.type}</p>
                        <p className="text-sm text-muted-foreground">Monthly charge</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Current</p>
                          <p className="font-medium text-red-600">{fee.current}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Our Price</p>
                          <p className="font-medium text-green-600">{fee.new}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Savings</p>
                          <Badge variant="secondary" className="text-green-600 border-green-200">
                            {fee.new === "FREE" ? "100%" : `-${fee.savings}`}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Key Features */}
          <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 dark:text-blue-100">
                ✨ What's Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">FREE card terminal (worth £299)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Next-day funding guaranteed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">24/7 customer support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">No setup fees</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Advanced fraud protection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">Real-time reporting dashboard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">No monthly minimums</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-sm">30-day money-back guarantee</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={onClose}>
              Review Later
            </Button>
            <div className="flex gap-3">
              <Button variant="outline">
                Request Changes
              </Button>
              <Button 
                onClick={handleApprove}
                disabled={isApproving}
                className="bg-green-600 hover:bg-green-700 text-white"
                data-testid="button-approve-quote"
              >
                {isApproving ? "Processing..." : "Approve Quote"}
              </Button>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            This quote is valid for 14 days and includes all setup and onboarding support.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
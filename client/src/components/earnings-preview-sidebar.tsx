import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { TrendingUp, Target, Flame, Lightbulb, Star, Trophy, ChevronLeft, ChevronRight } from "lucide-react";

interface EarningsPreviewSidebarProps {
  selectedProducts: string[];
  monthlyVolume: number;
  fundingAmount?: number;
  className?: string;
}

export default function EarningsPreviewSidebar({ 
  selectedProducts, 
  monthlyVolume = 0, 
  fundingAmount = 0,
  className = "" 
}: EarningsPreviewSidebarProps) {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Commission calculation logic
  const calculateCommission = () => {
    let totalCommission = 0;

    if (selectedProducts.includes('card-payments')) {
      if (monthlyVolume <= 10000) {
        totalCommission += 500;
      } else if (monthlyVolume <= 50000) {
        totalCommission += 1500;
      } else if (monthlyVolume <= 100000) {
        totalCommission += 3000;
      } else {
        totalCommission += 5000;
      }
    }

    if (selectedProducts.includes('business-funding')) {
      if (fundingAmount <= 10000) {
        totalCommission += 1000;
      } else if (fundingAmount <= 50000) {
        totalCommission += 5000;
      } else if (fundingAmount <= 100000) {
        totalCommission += 10000;
      } else {
        totalCommission += 25000;
      }
    }

    return totalCommission;
  };

  // Gamification data (mock - would come from user profile)
  const userStats = {
    currentMilestone: 'Bronze',
    nextMilestone: 'Silver',
    currentDeals: 3,
    targetDeals: 5,
    dealsToBonus: 2,
    submissionStreak: 4,
    totalEarnings: 12500
  };

  const tips = [
    {
      icon: "📄",
      text: "Attach a bill to boost win rate by 22%",
      category: "Win Rate"
    },
    {
      icon: "📝",
      text: "Add notes for faster underwriting",
      category: "Processing"
    },
    {
      icon: "📞",
      text: "Include phone number to increase approval by 15%",
      category: "Approval"
    },
    {
      icon: "🏢",
      text: "Complete business address improves credibility",
      category: "Trust"
    },
    {
      icon: "💰",
      text: "Higher monthly volumes = premium commission rates",
      category: "Earnings"
    }
  ];

  // Rotate tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [tips.length]);

  const currentCommission = calculateCommission();
  const milestoneProgress = (userStats.currentDeals / userStats.targetDeals) * 100;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getMilestoneColor = (milestone: string) => {
    switch (milestone) {
      case 'Bronze': return 'text-amber-600 bg-amber-100';
      case 'Silver': return 'text-gray-600 bg-gray-100';
      case 'Gold': return 'text-yellow-600 bg-yellow-100';
      case 'Platinum': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const nextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className={`space-y-4 ${className}`} data-testid="earnings-sidebar">
      {/* Commission Preview */}
      <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Estimated Commission
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2" data-testid="commission-amount">
              {formatCurrency(currentCommission)}
            </div>
            {currentCommission > 0 ? (
              <p className="text-sm text-gray-600">
                Based on selected services and volume
              </p>
            ) : (
              <p className="text-sm text-gray-500">
                Select services to see commission estimate
              </p>
            )}
            
            {/* Commission Breakdown */}
            {selectedProducts.length > 0 && (
              <div className="mt-4 space-y-2">
                {selectedProducts.includes('card-payments') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Card Payments:</span>
                    <span className="font-medium text-blue-600">
                      {formatCurrency(monthlyVolume <= 10000 ? 500 : monthlyVolume <= 50000 ? 1500 : monthlyVolume <= 100000 ? 3000 : 5000)}
                    </span>
                  </div>
                )}
                {selectedProducts.includes('business-funding') && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Business Funding:</span>
                    <span className="font-medium text-green-600">
                      {formatCurrency(fundingAmount <= 10000 ? 1000 : fundingAmount <= 50000 ? 5000 : fundingAmount <= 100000 ? 10000 : 25000)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Milestone Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-purple-600" />
            Progress to Next Milestone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Badge className={getMilestoneColor(userStats.currentMilestone)}>
                {userStats.currentMilestone}
              </Badge>
              <Badge className={getMilestoneColor(userStats.nextMilestone)} variant="outline">
                {userStats.nextMilestone}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Won this month</span>
                <span className="font-medium">
                  {userStats.currentDeals}/{userStats.targetDeals}
                </span>
              </div>
              <Progress value={milestoneProgress} className="h-2" />
            </div>
            
            <p className="text-sm text-gray-600">
              Next milestone: <span className="font-medium">{userStats.nextMilestone}</span> ({userStats.targetDeals} Won this month). 
              You're at {userStats.currentDeals}/{userStats.targetDeals}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deals Countdown */}
      <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50 to-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <Target className="w-8 h-8 text-orange-600 mx-auto mb-3" />
            <div className="text-2xl font-bold text-orange-600 mb-2" data-testid="deals-countdown">
              {userStats.dealsToBonus}
            </div>
            <p className="text-sm text-gray-600">
              Deals to next cash bonus
            </p>
            <Badge variant="outline" className="mt-2 text-orange-700 border-orange-300">
              {formatCurrency(500)} bonus
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Submission Streak */}
      <Card className="border-2 border-red-100 bg-gradient-to-br from-red-50 to-pink-50">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Flame className="w-8 h-8 text-red-600" />
              <span className="text-2xl">🔥</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2" data-testid="submission-streak">
              {userStats.submissionStreak} days
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Submission streak
            </p>
            <div className="text-xs text-red-600 bg-red-100 rounded-full px-3 py-1">
              Keep it going for bonus +25 XP tomorrow
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rotating Tips */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-yellow-600" />
              Pro Tips
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={prevTip}
                data-testid="button-prev-tip"
                className="h-6 w-6 p-0"
              >
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <span className="text-xs text-gray-500 min-w-[2rem] text-center">
                {currentTipIndex + 1}/{tips.length}
              </span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={nextTip}
                data-testid="button-next-tip"
                className="h-6 w-6 p-0"
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-3">
            <div className="text-3xl mb-2">{tips[currentTipIndex].icon}</div>
            <p className="text-sm text-gray-700 font-medium" data-testid="tip-text">
              {tips[currentTipIndex].text}
            </p>
            <Badge variant="secondary" className="text-xs">
              {tips[currentTipIndex].category}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Total Earnings Summary */}
      <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardContent className="p-6">
          <div className="text-center">
            <Star className="w-8 h-8 text-blue-600 mx-auto mb-3" />
            <div className="text-sm text-gray-600 mb-1">Total Earnings</div>
            <div className="text-2xl font-bold text-blue-600" data-testid="total-earnings">
              {formatCurrency(userStats.totalEarnings)}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This month
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
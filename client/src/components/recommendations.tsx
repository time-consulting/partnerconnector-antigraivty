import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LightbulbIcon, 
  TrendingUpIcon, 
  TargetIcon,
  CheckCircleIcon,
  AlertTriangleIcon,
  StarIcon,
  ArrowRightIcon,
  BookOpenIcon,
  MessageSquareIcon,
  PlusCircleIcon,
  BarChart3Icon,
  UsersIcon,
  XIcon,
  ClockIcon
} from "lucide-react";

interface Recommendation {
  id: string;
  type: 'tip' | 'action' | 'insight' | 'goal' | 'achievement';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action?: string;
  actionUrl?: string;
  icon: any;
  category: string;
  timeToComplete?: string;
  potentialImpact?: string;
  isDismissed?: boolean;
}

interface RecommendationsProps {
  userStats: any;
  userDeals: any[];
  isLoading: boolean;
}

export default function Recommendations({ userStats, userDeals, isLoading }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const stored = localStorage.getItem('dismissedRecommendations');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    if (isLoading || !userStats) return;
    
    const newRecommendations = generatePersonalizedRecommendations(userStats, userDeals, dismissedIds);
    setRecommendations(newRecommendations);
  }, [userStats, userDeals, isLoading, dismissedIds]);

  const generatePersonalizedRecommendations = (stats: any, deals: any[], dismissed: string[]): Recommendation[] => {
    const recs: Recommendation[] = [];
    
    // Performance-based recommendations
    if (stats.totalCommissions === 0) {
      recs.push({
        id: 'first-deals',
        type: 'action',
        priority: 'high',
        title: 'Submit Your First Deal',
        description: 'Get started earning commissions by submitting your first business deals today.',
        action: 'Submit Deal',
        actionUrl: '/submit-deal',
        icon: PlusCircleIcon,
        category: 'Getting Started',
        timeToComplete: '5 minutes',
        potentialImpact: '£500-£2000'
      });
    }

    if (deals.length > 0 && stats.successRate < 60) {
      recs.push({
        id: 'improve-success',
        type: 'insight',
        priority: 'high',
        title: 'Improve Your Success Rate',
        description: `Your current success rate is ${stats.successRate}%. Focus on qualifying leads better and providing complete business information.`,
        action: 'Learn Best Practices',
        actionUrl: '/learning-portal',
        icon: TrendingUpIcon,
        category: 'Performance',
        timeToComplete: '15 minutes',
        potentialImpact: '+30% success rate'
      });
    }

    if (stats.activeDeals > 5) {
      recs.push({
        id: 'follow-up',
        type: 'tip',
        priority: 'medium',
        title: 'Follow Up on Active Deals',
        description: `You have ${stats.activeDeals} active deals. Consider following up with these businesses to maintain engagement.`,
        icon: MessageSquareIcon,
        category: 'Relationship Management',
        timeToComplete: '30 minutes',
        potentialImpact: '+20% conversion'
      });
    }

    if (stats.monthlyEarnings > 1000) {
      recs.push({
        id: 'goal-achievement',
        type: 'achievement',
        priority: 'low',
        title: 'Excellent Monthly Performance!',
        description: `You've earned £${stats.monthlyEarnings} this month. You're in the top 20% of partners!`,
        icon: StarIcon,
        category: 'Achievement',
        potentialImpact: 'Top performer'
      });
    }

    // Behavioral recommendations
    const recentDeals = deals.filter(r => {
      const submittedDate = new Date(r.submittedAt);
      const daysAgo = (Date.now() - submittedDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysAgo <= 7;
    });

    if (recentDeals.length === 0 && deals.length > 0) {
      recs.push({
        id: 'stay-active',
        type: 'action',
        priority: 'medium',
        title: 'Stay Active This Week',
        description: 'You haven\'t submitted any deals this week. Consistent activity leads to better earnings.',
        action: 'Find Prospects',
        actionUrl: '/submit-deal',
        icon: TargetIcon,
        category: 'Activity',
        timeToComplete: '1 hour',
        potentialImpact: '£300-£800'
      });
    }

    // Education recommendations
    if (deals.length > 0 && !hasViewedLearningPortal()) {
      recs.push({
        id: 'learning-portal',
        type: 'tip',
        priority: 'low',
        title: 'Boost Your Knowledge',
        description: 'Access our learning portal to discover advanced sales techniques and industry insights.',
        action: 'Start Learning',
        actionUrl: '/learning-portal',
        icon: BookOpenIcon,
        category: 'Education',
        timeToComplete: '20 minutes',
        potentialImpact: 'Improved expertise'
      });
    }

    // Goal-setting recommendations
    if (stats.totalCommissions > 500 && stats.totalCommissions < 2000) {
      recs.push({
        id: 'next-milestone',
        type: 'goal',
        priority: 'medium',
        title: 'Reach £2,000 in Commissions',
        description: `You're at £${stats.totalCommissions}. Just ${Math.ceil((2000 - stats.totalCommissions) / 300)} more successful deals to reach £2,000!`,
        icon: TargetIcon,
        category: 'Goals',
        potentialImpact: '£2,000 milestone'
      });
    }

    // Quality recommendations based on upload behavior
    const dealsWithBills = deals.filter(r => r.hasBillUploads);
    if (deals.length > 0 && dealsWithBills.length / deals.length < 0.5) {
      recs.push({
        id: 'upload-bills',
        type: 'tip',
        priority: 'high',
        title: 'Upload Bills for Better Quotes',
        description: 'Referrals with uploaded bills get 40% better quotes. Add bills to increase your success rate.',
        action: 'Upload Bills',
        actionUrl: '/upload-bills',
        icon: AlertTriangleIcon,
        category: 'Quality',
        timeToComplete: '5 minutes',
        potentialImpact: '+40% quote quality'
      });
    }

    // Time-based contextual recommendations
    const currentHour = new Date().getHours();
    if (currentHour >= 9 && currentHour <= 17 && recentDeals.length === 0) {
      recs.push({
        id: 'business-hours-activity',
        type: 'tip',
        priority: 'medium',
        title: 'Perfect Time for Outreach',
        description: 'It\'s business hours! This is the ideal time to contact prospects and submit deals.',
        action: 'Contact Prospects',
        actionUrl: '/submit-deal',
        icon: ClockIcon,
        category: 'Timing',
        timeToComplete: '30 minutes',
        potentialImpact: 'Higher response rates'
      });
    }

    // Industry-specific recommendations
    const industryInsight = getIndustryRecommendation(deals);
    if (industryInsight) {
      recs.push(industryInsight);
    }

    // Competitive advantage tips
    if (stats.successRate > 70 && stats.totalCommissions > 1000) {
      recs.push({
        id: 'share-success',
        type: 'tip',
        priority: 'low',
        title: 'Share Your Success Story',
        description: 'You\'re performing excellently! Consider sharing your approach with other partners to build your network.',
        icon: StarIcon,
        category: 'Networking',
        potentialImpact: 'Increased deals'
      });
    }

    // Filter out dismissed recommendations
    return recs.filter(rec => !dismissed.includes(rec.id));
  };

  const hasViewedLearningPortal = (): boolean => {
    return localStorage.getItem('hasViewedLearningPortal') === 'true';
  };

  const getIndustryRecommendation = (deals: any[]): Recommendation | null => {
    if (deals.length < 3) return null;

    // Analyze business types in deals
    const businessTypes = deals.map(r => r.businessType || 'Unknown').filter(t => t !== 'Unknown');
    const typeCount: { [key: string]: number } = {};
    
    businessTypes.forEach(type => {
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    const entries = Object.entries(typeCount);
    if (entries.length === 0) return null;
    
    const mostCommonType = entries.reduce((a, b) => typeCount[a[0]] > typeCount[b[0]] ? a : b)?.[0];
    
    if (mostCommonType && typeCount[mostCommonType] >= 2) {
      return {
        id: 'industry-focus',
        type: 'insight',
        priority: 'medium',
        title: `Focus on ${mostCommonType} Businesses`,
        description: `You've had success with ${mostCommonType} businesses. Consider specializing in this sector for higher conversion rates.`,
        icon: UsersIcon,
        category: 'Industry Focus',
        potentialImpact: '+25% success rate'
      };
    }

    return null;
  };

  const handleDismiss = (recId: string) => {
    const newDismissed = [...dismissedIds, recId];
    setDismissedIds(newDismissed);
    localStorage.setItem('dismissedRecommendations', JSON.stringify(newDismissed));
  };

  const handleAction = (rec: Recommendation) => {
    if (rec.actionUrl) {
      window.location.href = rec.actionUrl;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'tip': return LightbulbIcon;
      case 'action': return ArrowRightIcon;
      case 'insight': return BarChart3Icon;
      case 'goal': return TargetIcon;
      case 'achievement': return StarIcon;
      default: return LightbulbIcon;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LightbulbIcon className="w-5 h-5" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recommendations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            All Caught Up!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Great job! You're staying on top of your deals activities. Keep up the excellent work!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="card-hover shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-yellow-50 to-transparent">
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
            <LightbulbIcon className="w-4 h-4 text-white" />
          </div>
          Personalized Recommendations
          <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-700">{recommendations.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.slice(0, 3).map((rec) => {
          const TypeIcon = getTypeIcon(rec.type);
          const Icon = rec.icon;
          
          return (
            <div
              key={rec.id}
              className="flex items-start gap-3 p-4 rounded-xl border-0 bg-white/60 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md"
              data-testid={`recommendation-${rec.id}`}
            >
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border border-primary/20">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{rec.title}</h4>
                      <Badge variant={getPriorityColor(rec.priority)} className="text-xs px-2 py-1 rounded-full">
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <TypeIcon className="w-3 h-3" />
                        {rec.category}
                      </span>
                      {rec.timeToComplete && (
                        <span>⏱️ {rec.timeToComplete}</span>
                      )}
                      {rec.potentialImpact && (
                        <span className="text-green-600">💡 {rec.potentialImpact}</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(rec.id)}
                    className="flex-shrink-0"
                    data-testid={`button-dismiss-${rec.id}`}
                  >
                    <XIcon className="w-4 h-4" />
                  </Button>
                </div>
                
                {rec.action && (
                  <Button
                    size="sm"
                    onClick={() => handleAction(rec)}
                    className="mt-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md hover:shadow-lg transition-all duration-300"
                    data-testid={`button-action-${rec.id}`}
                  >
                    {rec.action}
                    <ArrowRightIcon className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
        
        {recommendations.length > 3 && (
          <div className="text-center pt-2">
            <Button variant="outline" size="sm">
              View All {recommendations.length} Recommendations
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
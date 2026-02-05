import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboardIcon,
  EyeIcon,
  EyeOffIcon,
  MoveIcon,
  SettingsIcon
} from "lucide-react";

interface WidgetConfig {
  id: string;
  component: React.ReactNode;
  title: string;
  priority: number;
  isVisible: boolean;
  userInteractions: number;
  lastViewed: Date | null;
}

interface AdaptiveLayoutProps {
  userStats: any;
  userDeals: any[];
  children: React.ReactNode[];
}

export default function AdaptiveLayout({ userStats, userDeals, children }: AdaptiveLayoutProps) {
  const [layoutPreferences, setLayoutPreferences] = useState(() => {
    const stored = localStorage.getItem('dashboardLayout');
    return stored ? JSON.parse(stored) : null;
  });
  
  const [showLayoutCustomizer, setShowLayoutCustomizer] = useState(false);

  // Analyze user behavior and adapt layout
  useEffect(() => {
    if (!userStats || !userDeals) return;
    
    const adaptedLayout = generateAdaptiveLayout(userStats, userDeals);
    if (!layoutPreferences) {
      setLayoutPreferences(adaptedLayout);
      localStorage.setItem('dashboardLayout', JSON.stringify(adaptedLayout));
    }
  }, [userStats, userDeals, layoutPreferences]);

  const generateAdaptiveLayout = (stats: any, deals: any[]) => {
    const layout = {
      widgetOrder: ['recommendations', 'insights', 'recent-deals', 'progress'],
      widgetVisibility: {
        recommendations: true,
        insights: true,
        'recent-deals': true,
        progress: true,
        'quick-actions': true,
        analytics: false
      },
      gridSize: 'default' // 'compact', 'default', 'expanded'
    };

    // Adapt based on user activity level
    if (deals.length === 0) {
      // New user layout - prioritize getting started
      layout.widgetOrder = ['recommendations', 'quick-actions', 'insights', 'progress'];
      layout.widgetVisibility.analytics = false;
    } else if (deals.length > 10) {
      // Experienced user layout - show analytics
      layout.widgetOrder = ['insights', 'analytics', 'recommendations', 'recent-deals'];
      layout.widgetVisibility.analytics = true;
    }

    // Adapt based on success rate
    if (stats.successRate < 40) {
      // Struggling user - focus on recommendations and help
      layout.widgetOrder = ['recommendations', 'insights', 'recent-deals', 'progress'];
    } else if (stats.successRate > 80) {
      // High performer - show analytics and minimize tips
      layout.widgetOrder = ['analytics', 'recent-deals', 'insights', 'recommendations'];
    }

    return layout;
  };

  const updateWidgetVisibility = (widgetId: string, isVisible: boolean) => {
    const updated = {
      ...layoutPreferences,
      widgetVisibility: {
        ...layoutPreferences.widgetVisibility,
        [widgetId]: isVisible
      }
    };
    setLayoutPreferences(updated);
    localStorage.setItem('dashboardLayout', JSON.stringify(updated));
  };

  const updateWidgetOrder = (newOrder: string[]) => {
    const updated = {
      ...layoutPreferences,
      widgetOrder: newOrder
    };
    setLayoutPreferences(updated);
    localStorage.setItem('dashboardLayout', JSON.stringify(updated));
  };

  const resetToDefault = () => {
    const defaultLayout = generateAdaptiveLayout(userStats, userDeals);
    setLayoutPreferences(defaultLayout);
    localStorage.setItem('dashboardLayout', JSON.stringify(defaultLayout));
  };

  if (!layoutPreferences) {
    return <div className="animate-pulse">Loading adaptive layout...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Layout Customizer */}
      {showLayoutCustomizer && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <LayoutDashboardIcon className="w-5 h-5" />
                Customize Your Dashboard
              </div>
              <Button
                variant="ghost" 
                size="sm"
                onClick={() => setShowLayoutCustomizer(false)}
              >
                ×
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Widget Visibility</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(layoutPreferences.widgetVisibility).map(([widgetId, isVisible]) => (
                    <Button
                      key={widgetId}
                      variant={isVisible ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateWidgetVisibility(widgetId, !isVisible)}
                      className="flex items-center gap-2"
                    >
                      {isVisible ? <EyeIcon className="w-3 h-3" /> : <EyeOffIcon className="w-3 h-3" />}
                      {widgetId.replace('-', ' ')}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={resetToDefault} variant="outline" size="sm">
                  Reset to Adaptive Default
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Adaptive Layout Controls */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            <LayoutDashboardIcon className="w-3 h-3 mr-1" />
            Adaptive Layout
          </Badge>
          <span className="text-xs text-muted-foreground">
            Personalized for your activity level
          </span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowLayoutCustomizer(!showLayoutCustomizer)}
          className="flex items-center gap-1"
        >
          <SettingsIcon className="w-4 h-4" />
          Customize
        </Button>
      </div>

      {/* Adaptive Widget Grid */}
      <div className={`grid gap-6 ${
        layoutPreferences.gridSize === 'compact' ? 'grid-cols-1 lg:grid-cols-3' :
        layoutPreferences.gridSize === 'expanded' ? 'grid-cols-1' :
        'grid-cols-1 lg:grid-cols-2'
      }`}>
        {layoutPreferences.widgetOrder.map((widgetId, index) => {
          if (!layoutPreferences.widgetVisibility[widgetId]) return null;
          
          // Map widget IDs to actual components
          const widgetMap: { [key: string]: React.ReactNode } = {
            'recommendations': children[0],
            'insights': children[1], 
            'recent-deals': children[2],
            'progress': children[3],
            'quick-actions': children[4],
            'analytics': children[5]
          };

          return (
            <div key={widgetId} className="widget-container">
              {widgetMap[widgetId]}
            </div>
          );
        })}
      </div>

      {/* Usage Analytics (for internal optimization) */}
      <div className="text-xs text-muted-foreground text-center">
        Layout optimized based on your usage patterns and performance metrics
      </div>
    </div>
  );
}
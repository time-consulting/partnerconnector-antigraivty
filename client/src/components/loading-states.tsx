import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

/**
 * Loading state for Kanban drag-and-drop interface
 */
export function KanbanLoadingSkeleton() {
  const columnCount = 5;
  const cardsPerColumn = 3;

  return (
    <div className="space-y-4" data-testid="kanban-loading-skeleton">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: columnCount }).map((_, columnIndex) => (
          <div key={columnIndex} className="space-y-3">
            {/* Column header */}
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Skeleton className="h-5 w-24" />
              <Badge variant="secondary">
                <Skeleton className="h-4 w-4" />
              </Badge>
            </div>
            
            {/* Cards in column */}
            <div className="space-y-2">
              {Array.from({ length: cardsPerColumn }).map((_, cardIndex) => (
                <Card key={cardIndex} className="p-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-4 rounded-full" />
                    </div>
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-6 w-12" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            
            {/* Add button */}
            <Skeleton className="h-8 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Loading state for chart components
 */
export function ChartLoadingSkeleton({ height = "h-80", title }: { height?: string; title?: string }) {
  return (
    <Card data-testid="chart-loading-skeleton">
      <CardHeader>
        {title ? (
          <div className="text-lg font-semibold">{title}</div>
        ) : (
          <Skeleton className="h-6 w-48" />
        )}
      </CardHeader>
      <CardContent>
        <div className={`${height} flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg`}>
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
            <div className="text-sm text-gray-500">Loading chart data...</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Loading state for team analytics modal
 */
export function TeamAnalyticsLoadingSkeleton() {
  return (
    <div className="space-y-6" data-testid="team-analytics-loading-skeleton">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-8 h-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs skeleton */}
      <div className="space-y-4">
        <div className="flex space-x-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-10 w-32" />
          ))}
        </div>
        
        {/* Table/Chart content area */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-8 w-32" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/**
 * Loading state for animated tooltips
 */
export function AnimatedTooltipLoadingSkeleton({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative" data-testid="animated-tooltip-loading">
      {children}
      {/* Fallback static tooltip content */}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none">
        Loading...
      </div>
    </div>
  );
}

/**
 * Loading state for training modules with animations
 */
export function TrainingModuleLoadingSkeleton() {
  return (
    <div className="space-y-6" data-testid="training-module-loading-skeleton">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Module cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-2 w-full" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * Generic loading spinner for heavy feature loading
 */
export function FeatureLoadingSpinner({ message = "Loading feature..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-12" data-testid="feature-loading-spinner">
      <div className="text-center space-y-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
        <div className="text-sm text-gray-600 dark:text-gray-400">{message}</div>
      </div>
    </div>
  );
}
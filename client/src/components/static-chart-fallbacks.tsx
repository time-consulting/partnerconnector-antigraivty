import { ChartLoadingSkeleton } from "@/components/loading-states";

// Static fallback components for charts
interface StaticChartFallbackProps {
  title?: string;
  description?: string;
  height?: number;
  width?: string;
  className?: string;
}

export function StaticBarChartFallback({
  title = "Bar Chart",
  description = "Loading chart data...",
  height = 300,
  width = "100%",
  className = ""
}: StaticChartFallbackProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ChartLoadingSkeleton 
        title={title}
        height="h-full"
      />
    </div>
  );
}

export function StaticLineChartFallback({
  title = "Line Chart",
  description = "Loading chart data...",
  height = 300,
  width = "100%",
  className = ""
}: StaticChartFallbackProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ChartLoadingSkeleton 
        title={title}
        height="h-full"
      />
    </div>
  );
}

export function StaticPieChartFallback({
  title = "Pie Chart",
  description = "Loading chart data...",
  height = 300,
  width = "100%",
  className = ""
}: StaticChartFallbackProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ChartLoadingSkeleton 
        title={title}
        height="h-full"
      />
    </div>
  );
}

export function StaticAreaChartFallback({
  title = "Area Chart",
  description = "Loading chart data...",
  height = 300,
  width = "100%",
  className = ""
}: StaticChartFallbackProps) {
  return (
    <div className={`w-full ${className}`} style={{ height }}>
      <ChartLoadingSkeleton 
        title={title}
        height="h-full"
      />
    </div>
  );
}

// Generic chart fallback with customizable content
interface GenericChartFallbackProps extends StaticChartFallbackProps {
  children?: React.ReactNode;
}

export function GenericStaticChartFallback({
  title = "Chart",
  description = "Loading chart data...",
  height = 300,
  width = "100%",
  className = "",
  children
}: GenericChartFallbackProps) {
  return (
    <div className={`w-full flex flex-col items-center justify-center border rounded-lg bg-gray-50 dark:bg-gray-900 ${className}`} style={{ height, width }}>
      <div className="text-center space-y-2">
        <div className="text-lg font-semibold text-gray-600 dark:text-gray-400">{title}</div>
        <div className="text-sm text-gray-500 dark:text-gray-500">{description}</div>
        {children}
      </div>
    </div>
  );
}
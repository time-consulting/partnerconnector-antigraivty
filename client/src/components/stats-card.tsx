import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend: string;
  iconBg: string;
  iconColor: string;
  trendColor: string;
  testId: string;
}

export default function StatsCard({
  title,
  value,
  icon: Icon,
  trend,
  iconBg,
  iconColor,
  trendColor,
  testId,
}: StatsCardProps) {
  return (
    <Card className="card-hover shadow-lg border-0 bg-white/60 backdrop-blur-sm" data-testid={testId}>
      <CardContent className="p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full"></div>
        <div className="flex items-center justify-between relative z-10">
          <div>
            <p className="text-muted-foreground text-sm font-medium">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1" data-testid={`${testId}-value`}>
              {value}
            </p>
          </div>
          <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center shadow-lg`}>
            <Icon className={`${iconColor} w-7 h-7`} />
          </div>
        </div>
        <div className="flex items-center mt-4 space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <p className={`${trendColor} text-sm font-medium`} data-testid={`${testId}-trend`}>
            {trend}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

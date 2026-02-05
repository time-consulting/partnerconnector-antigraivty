import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Trophy, 
  Star, 
  Crown, 
  Shield,
  Users,
  TrendingUp,
  Target,
  DollarSign
} from "lucide-react";

interface ProgressionData {
  partnerLevel: string;
  teamSize: number;
  totalRevenue: number;
  directRevenue: number;
  overrideRevenue: number;
  totalInvites: number;
  successfulInvites: number;
}

interface ProgressionSystemProps {
  data?: ProgressionData;
}

export default function ProgressionSystem({ data }: ProgressionSystemProps) {
  // Default values if no data is provided
  const progressionData = data || {
    partnerLevel: 'Bronze Partner',
    teamSize: 0,
    totalRevenue: 0,
    directRevenue: 0,
    overrideRevenue: 0,
    totalInvites: 0,
    successfulInvites: 0
  };

  const levels = [
    { name: "Bronze Partner", color: "from-amber-600 to-amber-700", icon: Shield },
    { name: "Silver Partner", color: "from-gray-400 to-gray-600", icon: Star },
    { name: "Gold Partner", color: "from-yellow-400 to-yellow-600", icon: Trophy },
    { name: "Platinum Partner", color: "from-purple-400 to-purple-600", icon: Crown },
  ];

  const getCurrentLevelIndex = () => {
    return levels.findIndex(level => level.name === progressionData.partnerLevel);
  };

  const currentLevelIndex = getCurrentLevelIndex();
  const currentLevelData = levels[currentLevelIndex] || levels[0];
  const CurrentLevelIcon = currentLevelData.icon;

  return (
    <div className="space-y-6">
      {/* Level Display Card */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentLevelData.color} flex items-center justify-center shadow-lg`}>
                <CurrentLevelIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900" data-testid="text-partner-level">{progressionData.partnerLevel}</h3>
                <p className="text-gray-600">Current Partner Status</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">#{currentLevelIndex + 1}</div>
              <div className="text-sm text-gray-500">Level Rank</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700" data-testid="text-team-size">{progressionData.teamSize}</p>
                <p className="text-xs text-green-600">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-purple-700" data-testid="text-successful-invites">{progressionData.successfulInvites}</p>
                <p className="text-xs text-purple-600">Successful Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-700" data-testid="text-total-invites">{progressionData.totalInvites}</p>
                <p className="text-xs text-orange-600">Total Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-700" data-testid="text-total-revenue">£{progressionData.totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-blue-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Direct Revenue</p>
                <p className="text-xs text-gray-500">From your direct sales</p>
              </div>
              <p className="text-2xl font-bold text-green-700" data-testid="text-direct-revenue">£{progressionData.directRevenue.toLocaleString()}</p>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-700">Override Revenue</p>
                <p className="text-xs text-gray-500">From your team's sales</p>
              </div>
              <p className="text-2xl font-bold text-purple-700" data-testid="text-override-revenue">£{progressionData.overrideRevenue.toLocaleString()}</p>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">Total Revenue</p>
                  <p className="text-xs text-gray-500">Combined earnings</p>
                </div>
                <p className="text-3xl font-bold text-blue-700">£{progressionData.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Team Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Team Size</span>
              <span className="text-lg font-semibold">{progressionData.teamSize} members</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Invitations Sent</span>
              <span className="text-lg font-semibold">{progressionData.totalInvites}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Successful Invitations</span>
              <span className="text-lg font-semibold">{progressionData.successfulInvites}</span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t">
              <span className="text-sm text-gray-600">Success Rate</span>
              <span className="text-lg font-semibold text-green-600">
                {progressionData.totalInvites > 0 
                  ? Math.round((progressionData.successfulInvites / progressionData.totalInvites) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

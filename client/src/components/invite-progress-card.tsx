import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, Trophy, Target, Star, Gift } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface InviteProgressCardProps {
  onInviteClick?: () => void;
  className?: string;
}

export default function InviteProgressCard({ onInviteClick, className }: InviteProgressCardProps) {
  const [invitesSent, setInvitesSent] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);

  // Get user data to check invite progress
  const { data: user } = useQuery({
    queryKey: ['/api/auth/user']
  });

  useEffect(() => {
    // Load from localStorage for immediate state
    const savedInvites = localStorage.getItem('invites_sent_count');
    const savedXP = localStorage.getItem('invite_xp_earned');
    
    if (savedInvites) setInvitesSent(parseInt(savedInvites));
    if (savedXP) setXpEarned(parseInt(savedXP));
  }, []);

  // Calculate progress towards starter badge (2 invites)
  const starterBadgeProgress = Math.min((invitesSent / 2) * 100, 100);
  const hasStarterBadge = invitesSent >= 2;
  const invitesNeeded = Math.max(0, 2 - invitesSent);

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 ${className}`} data-testid="invite-progress-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" />
            Team Building
          </CardTitle>
          {hasStarterBadge && (
            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
              <Trophy className="h-3 w-3 mr-1" />
              Starter
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600">Invites sent</span>
            <span className="font-medium text-gray-900">{invitesSent}/2</span>
          </div>
          <Progress value={starterBadgeProgress} className="h-2" />
        </div>

        {/* Next Milestone */}
        <div className="text-center space-y-2">
          {!hasStarterBadge ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900">
                <Target className="h-4 w-4 text-blue-600" />
                {invitesNeeded} invite{invitesNeeded !== 1 ? 's' : ''} = Starter badge
              </div>
              <div className="flex items-center justify-center gap-1 text-xs text-green-600">
                <Star className="h-3 w-3" />
                +20 XP bonus
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center gap-2 text-sm font-medium text-yellow-700">
              <Trophy className="h-4 w-4" />
              Starter Badge Earned!
            </div>
          )}
        </div>

        {/* Action Button */}
        {!hasStarterBadge && (
          <Button
            size="sm"
            onClick={onInviteClick}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-invite-from-card"
          >
            <Gift className="h-4 w-4 mr-2" />
            Invite teammate
          </Button>
        )}

        {/* XP Summary */}
        <div className="pt-2 border-t border-blue-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Team XP earned</span>
            <span className="font-medium">{xpEarned} XP</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Users, 
  ArrowRight, 
  Share2, 
  Copy, 
  Trophy, 
  Star,
  TrendingUp,
  Target,
  Gift,
  X,
  CheckCircle,
  Zap
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface InviteNudgeProps {
  isVisible: boolean;
  onDismiss: () => void;
  onInviteSent?: (inviteData: any) => void;
  userFirstName?: string;
}

interface InviteData {
  email: string;
  name: string;
  personalMessage: string;
}

interface ExplainerStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  animation?: string;
}

const EXPLAINER_STEPS: ExplainerStep[] = [
  {
    id: "your-deals",
    title: "You earn on your deals",
    description: "Every successful deals earns you upfront commission directly.",
    icon: <Target className="h-8 w-8 text-green-600" />,
    animation: "animate-bounce"
  },
  {
    id: "team-deals", 
    title: "You also earn a % of theirs",
    description: "When your partners make sales, you earn 10% override commission.",
    icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
    animation: "animate-pulse"
  },
  {
    id: "levels-deep",
    title: "And a smaller % of their recruits",
    description: "2-3 levels deep. Build a network, earn passive income from their success.",
    icon: <Users className="h-8 w-8 text-purple-600" />,
    animation: "animate-bounce"
  }
];

const DEFAULT_INVITE_MESSAGE = `Hi {name},

I've joined PartnerConnector and thought you'd be interested too. It's a platform where professionals like us can earn substantial commissions by connecting our clients with business funding and payment solutions.

The commission structure is impressive - upfront commissions on successful deals, plus 20% team overrides and 10% extended network commissions.

Want to check it out? Here's my deals link: {dealLink}

Best regards,
{userFirstName}`;

export default function InviteNudge({ 
  isVisible, 
  onDismiss, 
  onInviteSent, 
  userFirstName = "there" 
}: InviteNudgeProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [showExplainer, setShowExplainer] = useState(false);
  const [explainerStep, setExplainerStep] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [invitesSent, setInvitesSent] = useState(0);
  const [xpEarned, setXpEarned] = useState(0);
  
  const [inviteData, setInviteData] = useState<InviteData>({
    email: "",
    name: "",
    personalMessage: DEFAULT_INVITE_MESSAGE
      .replace("{userFirstName}", userFirstName)
      .replace("{dealLink}", "Loading link...")
  });
  
  const [dealLink, setDealLink] = useState("https://partnerconnector.com/join?ref=PC123");
  
  // Fetch user's deals link
  const dealLinkQuery = useQuery({
    queryKey: ['/api/auth/deals-link'],
    enabled: isVisible,
    onSuccess: (data) => {
      const link = data.dealLink || "https://partnerconnector.com/join?ref=PC123";
      setDealLink(link);
      
      // Update the personal message with real link
      setInviteData(prev => ({
        ...prev,
        personalMessage: prev.personalMessage.replace("Loading link...", link)
          .replace("{dealLink}", link)
      }));
    }
  });

  // Load saved nudge state
  useEffect(() => {
    const savedInvites = localStorage.getItem('invites_sent_count');
    const savedXP = localStorage.getItem('invite_xp_earned');
    
    if (savedInvites) setInvitesSent(parseInt(savedInvites));
    if (savedXP) setXpEarned(parseInt(savedXP));
  }, []);

  // Send invite mutation using backend API
  const sendInviteMutation = useMutation({
    mutationFn: async (data: InviteData) => {
      return apiRequest('/api/invites', {
        method: 'POST',
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          personalMessage: data.personalMessage
        })
      });
    },
    onSuccess: (response) => {
      const newInviteCount = invitesSent + 1;
      const xpGained = newInviteCount === 1 ? 10 : 5; // First invite gives 10 XP
      const newTotalXP = xpEarned + xpGained;
      
      // Update state
      setInvitesSent(newInviteCount);
      setXpEarned(newTotalXP);
      
      // Save to localStorage
      localStorage.setItem('invites_sent_count', newInviteCount.toString());
      localStorage.setItem('invite_xp_earned', newTotalXP.toString());
      localStorage.setItem('first_invite_sent', Date.now().toString());
      
      // Close modals and show success
      setShowShareModal(false);
      setShowSuccessCard(true);
      
      // Award badges
      if (newInviteCount === 1) {
        toast({
          title: "First invite sent! 🎉",
          description: `+${xpGained} XP earned`,
        });
      } else if (newInviteCount === 2) {
        toast({
          title: "Starter Badge unlocked! 🏆",
          description: "+20 XP bonus for 2 invites",
        });
        setXpEarned(prev => prev + 20);
        localStorage.setItem('invite_xp_earned', (newTotalXP + 20).toString());
      }
      
      if (onInviteSent) {
        onInviteSent(response);
      }
      
      // Auto-hide success card after 5 seconds
      setTimeout(() => {
        setShowSuccessCard(false);
      }, 5000);
    }
  });

  const handleStartExplainer = () => {
    setShowExplainer(true);
    setExplainerStep(0);
  };

  const handleNextExplainer = () => {
    if (explainerStep < EXPLAINER_STEPS.length - 1) {
      setExplainerStep(explainerStep + 1);
    } else {
      setShowExplainer(false);
      setShowShareModal(true);
    }
  };

  const handleSendInvite = () => {
    if (!inviteData.email || !inviteData.name) {
      toast({
        title: "Missing information",
        description: "Please enter both name and email address.",
        variant: "destructive",
      });
      return;
    }

    sendInviteMutation.mutate(inviteData);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(dealLink);
    
    // Track link copy event
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event: 'invite_link_copied' })
    }).catch(err => console.warn('Analytics tracking failed:', err));
    
    toast({
      title: "Referral link copied! 📋",
      description: "Share it anywhere to earn commissions.",
    });
  };

  const updateInviteMessage = (field: keyof InviteData, value: string) => {
    setInviteData(prev => ({
      ...prev,
      [field]: field === 'personalMessage' 
        ? value.replace("{name}", inviteData.name || "{name}")
        : value
    }));
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Nudge Banner */}
      {!showExplainer && !showShareModal && !showSuccessCard && (
        <Alert className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 mx-6 mb-4" data-testid="invite-nudge-banner">
          <Users className="h-5 w-5 text-blue-600" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900 mb-1">Earn more with your team</div>
              <div className="text-sm text-gray-700">
                Invite partners and earn overrides up to 3 levels deep.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={handleStartExplainer}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                data-testid="button-learn-how"
              >
                Learn how
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={onDismiss}
                className="text-gray-500 hover:text-gray-700"
                data-testid="button-dismiss-nudge"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Success Card */}
      {showSuccessCard && (
        <div className="fixed top-4 right-4 z-50" data-testid="invite-success-card">
          <Card className="bg-green-50 border-2 border-green-200 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-green-800">Invite sent! 🎉</div>
                  <div className="text-sm text-green-700">
                    +{invitesSent === 1 ? 10 : 5} XP earned • {invitesSent} total invite{invitesSent !== 1 ? 's' : ''}
                  </div>
                  {invitesSent === 2 && (
                    <Badge className="mt-1 bg-yellow-100 text-yellow-800 border-yellow-300">
                      <Trophy className="h-3 w-3 mr-1" />
                      Starter Badge +20 XP
                    </Badge>
                  )}
                </div>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setShowSuccessCard(false)}
                  className="text-green-600 hover:bg-green-100"
                  data-testid="button-close-success"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Explainer Modal */}
      <Dialog open={showExplainer} onOpenChange={setShowExplainer}>
        <DialogContent className="max-w-md" data-testid="explainer-modal" aria-describedby="explainer-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 h-5 text-blue-600" />
              Team Earnings Explained
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6" id="explainer-description">
            {/* Step indicator */}
            <div className="flex items-center gap-2">
              {EXPLAINER_STEPS.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 flex-1 rounded-full ${
                    index <= explainerStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>

            {/* Step content */}
            <div className="text-center space-y-4">
              <div className={`flex justify-center ${EXPLAINER_STEPS[explainerStep].animation}`}>
                {EXPLAINER_STEPS[explainerStep].icon}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {EXPLAINER_STEPS[explainerStep].title}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {EXPLAINER_STEPS[explainerStep].description}
                </p>
              </div>

              {/* Visual earnings example */}
              {explainerStep === 1 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-xs text-blue-700 font-medium">Example:</div>
                  <div className="text-xs text-blue-600">
                    Your partner earns £1,000 → You earn £100 override
                  </div>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setShowExplainer(false)}
                data-testid="button-explainer-close"
              >
                Close
              </Button>
              <Button
                onClick={handleNextExplainer}
                data-testid="button-explainer-next"
              >
                {explainerStep === EXPLAINER_STEPS.length - 1 ? (
                  <>
                    Start inviting
                    <Share2 className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Modal */}
      <Dialog open={showShareModal} onOpenChange={setShowShareModal}>
        <DialogContent className="max-w-lg" data-testid="share-modal" aria-describedby="share-description">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Share2 className="h-5 w-5 text-blue-600" />
              Invite Your First Partner
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4" id="share-description">
            {/* Quick stats */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-800">Your invite rewards:</div>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-xs text-green-600">First invite: +10 XP</span>
                <span className="text-xs text-blue-600">2 invites: Starter Badge (+20 XP)</span>
              </div>
            </div>

            {/* Invite form */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inviteName">Name</Label>
                <Input
                  id="inviteName"
                  value={inviteData.name}
                  onChange={(e) => updateInviteMessage('name', e.target.value)}
                  placeholder="Colleague's name"
                  data-testid="input-invite-name"
                />
              </div>
              <div>
                <Label htmlFor="inviteEmail">Email</Label>
                <Input
                  id="inviteEmail"
                  type="email"
                  value={inviteData.email}
                  onChange={(e) => updateInviteMessage('email', e.target.value)}
                  placeholder="their@email.com"
                  data-testid="input-invite-email"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="inviteMessage">Personal message</Label>
              <Textarea
                id="inviteMessage"
                value={inviteData.personalMessage}
                onChange={(e) => updateInviteMessage('personalMessage', e.target.value)}
                rows={6}
                className="text-sm"
                data-testid="textarea-invite-message"
              />
            </div>

            {/* Copy link option */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Or share your deals link:</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyLink}
                  data-testid="button-copy-link"
                >
                  <Copy className="h-4 w-4 mr-1" />
                  Copy link
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between gap-2">
              <Button
                variant="outline"
                onClick={() => setShowShareModal(false)}
                data-testid="button-cancel-invite"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSendInvite}
                disabled={sendInviteMutation.isPending}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-send-invite"
              >
                {sendInviteMutation.isPending ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Gift className="h-4 w-4 mr-2" />
                    Send invite
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Helper hook for managing invite nudge state
export function useInviteNudge() {
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  useEffect(() => {
    const profileSubmitted = localStorage.getItem('profile_submitted');
    const dismissed = localStorage.getItem('invite_nudge_dismissed');
    const firstInviteSent = localStorage.getItem('first_invite_sent');
    
    setNudgeDismissed(!!dismissed);
    
    // Show nudge after profile completion but before first invite
    const shouldShow = Boolean(profileSubmitted && !dismissed && !firstInviteSent);
    setShowNudge(shouldShow);
  }, []);

  const dismissNudge = () => {
    setShowNudge(false);
    setNudgeDismissed(true);
    localStorage.setItem('invite_nudge_dismissed', Date.now().toString());
  };

  const showNudgeAgain = () => {
    setShowNudge(true);
    localStorage.removeItem('invite_nudge_dismissed');
  };

  return {
    showNudge,
    nudgeDismissed,
    dismissNudge,
    showNudgeAgain,
  };
}
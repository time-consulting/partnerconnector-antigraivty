import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Share2, 
  Smartphone, 
  Mail, 
  MessageCircle, 
  MessageSquare, 
  Phone, 
  Copy, 
  QrCode,
  Users,
  Send,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
  Globe,
  Calendar,
  Clock,
  Star,
  Heart,
  Gift,
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import { FaWhatsapp, FaTelegram, FaViber, FaDiscord } from "react-icons/fa";

interface ShareTemplate {
  id: string;
  name: string;
  platform: string;
  message: string;
  personalizable: boolean;
  successRate: number;
  category: 'social' | 'messaging' | 'email' | 'professional';
}

interface ShareOption {
  id: string;
  name: string;
  icon: any;
  color: string;
  action: 'native' | 'url' | 'custom';
  platforms?: string[];
}

interface MobileShareSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  referralUrl: string;
  userStats: {
    level: string;
    earnings: number;
    teamSize: number;
  };
  onShare: (platform: string, message: string, customData?: any) => Promise<void>;
}

export default function MobileShareSheet({ 
  isOpen, 
  onOpenChange, 
  referralUrl, 
  userStats,
  onShare 
}: MobileShareSheetProps) {
  const { toast } = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState<ShareTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");

  const shareTemplates: ShareTemplate[] = [
    {
      id: 'professional',
      name: 'Professional Invitation',
      platform: 'linkedin',
      message: `Hi! I've been growing my business with this amazing partner program. As a ${userStats.level}, I've earned £${userStats.earnings} so far. Would you like to join my team? ${referralUrl}`,
      personalizable: true,
      successRate: 78,
      category: 'professional'
    },
    {
      id: 'casual',
      name: 'Casual Friend Invite',
      platform: 'whatsapp',
      message: `Hey! 👋 Found this cool way to earn extra income. I'm already at ${userStats.level} level and loving it! Check it out: ${referralUrl}`,
      personalizable: true,
      successRate: 85,
      category: 'messaging'
    },
    {
      id: 'email',
      name: 'Email Introduction',
      platform: 'email',
      message: `Subject: Exciting Business Opportunity\n\nHi there!\n\nI wanted to share an exciting opportunity I've been part of. I'm currently a ${userStats.level} with a team of ${userStats.teamSize} members, and it's been incredibly rewarding.\n\nWould you be interested in learning more? You can get started here: ${referralUrl}\n\nBest regards!`,
      personalizable: true,
      successRate: 72,
      category: 'email'
    },
    {
      id: 'social',
      name: 'Social Media Post',
      platform: 'twitter',
      message: `🚀 Just reached ${userStats.level} status! Building an amazing team and earning great commissions. Join me on this journey! #PartnerProgram #BusinessOpportunity ${referralUrl}`,
      personalizable: false,
      successRate: 45,
      category: 'social'
    }
  ];

  const shareOptions: ShareOption[] = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: FaWhatsapp,
      color: 'bg-green-500',
      action: 'url'
    },
    {
      id: 'sms',
      name: 'SMS',
      icon: MessageSquare,
      color: 'bg-blue-500',
      action: 'native'
    },
    {
      id: 'email',
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500',
      action: 'native'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-600',
      action: 'url'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-blue-400',
      action: 'url'
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: FaTelegram,
      color: 'bg-blue-500',
      action: 'url'
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-700',
      action: 'url'
    },
    {
      id: 'discord',
      name: 'Discord',
      icon: FaDiscord,
      color: 'bg-indigo-500',
      action: 'url'
    }
  ];

  const quickActions = [
    {
      id: 'copy-link',
      name: 'Copy Link',
      icon: Copy,
      color: 'bg-gray-500',
      description: 'Copy deals? link to clipboard'
    },
    {
      id: 'qr-code',
      name: 'QR Code',
      icon: QrCode,
      color: 'bg-purple-500',
      description: 'Generate QR code for scanning'
    },
    {
      id: 'contact-picker',
      name: 'Contacts',
      icon: Users,
      color: 'bg-orange-500',
      description: 'Pick from your contacts'
    },
    {
      id: 'schedule',
      name: 'Schedule',
      icon: Calendar,
      color: 'bg-green-500',
      description: 'Schedule for later'
    }
  ];

  const handleQuickShare = async (optionId: string, template?: ShareTemplate) => {
    const message = template?.message || customMessage || `Join me in this amazing partner program! ${referralUrl}`;
    
    try {
      switch (optionId) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
          break;
        case 'sms':
          window.open(`sms:?body=${encodeURIComponent(message)}`);
          break;
        case 'email':
          window.open(`mailto:?subject=Join My Partner Network&body=${encodeURIComponent(message)}`);
          break;
        case 'linkedin':
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`);
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
          break;
        case 'telegram':
          window.open(`https://t.me/share/url?url=${encodeURIComponent(referralUrl)}&text=${encodeURIComponent(message)}`);
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`);
          break;
        case 'copy-link':
          navigator.clipboard.writeText(referralUrl);
          toast({
            title: "Link Copied!",
            description: "Referral link copied to clipboard",
          });
          break;
      }

      await onShare(optionId, message);
      
      toast({
        title: "Shared Successfully!",
        description: `Your deals? link has been shared via ${shareOptions.find(o => o.id === optionId)?.name}`,
      });
    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Unable to share at this time. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case 'copy-link':
        handleQuickShare('copy-link');
        break;
      case 'qr-code':
        // Would open QR code dialog
        toast({
          title: "QR Code",
          description: "QR code feature would open here",
        });
        break;
      case 'contact-picker':
        // Would open contact picker
        toast({
          title: "Contacts",
          description: "Contact picker would open here",
        });
        break;
      case 'schedule':
        // Would open scheduling interface
        toast({
          title: "Schedule",
          description: "Scheduling interface would open here",
        });
        break;
    }
  };

  const personalizeMessage = (template: ShareTemplate, customText?: string) => {
    if (customText) return customText;
    return template.message.replace(/\[USER_NAME\]/g, 'there');
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="pb-6">
          <SheetTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Referral Link
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Success Stats */}
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-0">
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600">{userStats.level}</div>
                  <div className="text-xs text-gray-600">Current Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">£{userStats.earnings}</div>
                  <div className="text-xs text-gray-600">Total Earned</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">{userStats.teamSize}</div>
                  <div className="text-xs text-gray-600">Team Size</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="grid grid-cols-4 gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-3"
                  onClick={() => handleQuickAction(action.id)}
                  data-testid={`quick-action-${action.id}`}
                >
                  <div className={`w-8 h-8 rounded-full ${action.color} flex items-center justify-center`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs">{action.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Share Templates */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Message Templates</h3>
            <div className="space-y-3">
              {shareTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`cursor-pointer transition-all ${
                    selectedTemplate?.id === template.id 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedTemplate(template)}
                  data-testid={`template-${template.id}`}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium text-gray-900">{template.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.successRate}% success
                        </Badge>
                        <Badge className={`text-xs ${
                          template.category === 'professional' ? 'bg-blue-100 text-blue-700' :
                          template.category === 'messaging' ? 'bg-green-100 text-green-700' :
                          template.category === 'email' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {template.category}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {template.message.substring(0, 120)}...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Message */}
          <div>
            <Label htmlFor="customMessage">Custom Message (Optional)</Label>
            <Textarea
              id="customMessage"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Write your own personalized message..."
              className="mt-2"
              rows={3}
              data-testid="textarea-custom-message"
            />
          </div>

          {/* Share Platforms */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Share Platforms</h3>
            <div className="grid grid-cols-4 gap-3">
              {shareOptions.map((option) => (
                <Button
                  key={option.id}
                  variant="outline"
                  className="flex flex-col items-center gap-2 h-auto py-3"
                  onClick={() => handleQuickShare(option.id, selectedTemplate || undefined)}
                  data-testid={`share-platform-${option.id}`}
                >
                  <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center`}>
                    <option.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-xs">{option.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Direct Send */}
          <Card className="bg-gray-50">
            <CardHeader>
              <CardTitle className="text-base">Send Directly</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="recipientEmail">Email Address</Label>
                <Input
                  id="recipientEmail"
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="colleague@company.com"
                  data-testid="input-recipient-email"
                />
              </div>
              <div>
                <Label htmlFor="recipientPhone">Phone Number</Label>
                <Input
                  id="recipientPhone"
                  type="tel"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  placeholder="+44 7xxx xxx xxx"
                  data-testid="input-recipient-phone"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  disabled={!recipientEmail}
                  onClick={() => handleQuickShare('email', selectedTemplate || undefined)}
                  data-testid="button-send-email"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Send Email
                </Button>
                <Button 
                  className="flex-1" 
                  disabled={!recipientPhone}
                  onClick={() => handleQuickShare('sms', selectedTemplate || undefined)}
                  data-testid="button-send-sms"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Send SMS
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sharing Tips */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Star className="w-4 h-4" />
                Sharing Tips
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Personalize your message for better response rates</li>
                <li>• Share with people who might benefit from extra income</li>
                <li>• Use professional templates for business contacts</li>
                <li>• Follow up with interested prospects</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
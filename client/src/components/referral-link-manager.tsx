import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  QrCode, 
  Download, 
  Share, 
  Link2, 
  Sparkles,
  Mail,
  MessageSquare,
  Globe
} from "lucide-react";

interface ReferralLink {
  id: string;
  name: string;
  url: string;
  shortCode: string;
  clicks: number;
  conversions: number;
  created: Date;
  expires?: Date;
  isActive: boolean;
  trackingEnabled: boolean;
  campaignName?: string;
}

interface ReferralLinkManagerProps {
  userReferralCode: string;
  links: ReferralLink[];
  onCreateLink: (data: any) => Promise<void>;
  onUpdateLink: (id: string, data: any) => Promise<void>;
  onDeleteLink: (id: string) => Promise<void>;
}

export default function ReferralLinkManager({ userReferralCode }: ReferralLinkManagerProps) {
  const { toast } = useToast();
  const [showQRDialog, setShowQRDialog] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const primaryReferralUrl = `${baseUrl}/signup?ref=${userReferralCode}`;

  const copyToClipboard = (text: string, label: string = "Link") => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard`,
    });
  };

  const generateQRCode = (url: string) => {
    // Generate QR code data URL (mock implementation)
    const qrData = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="white"/><rect x="20" y="20" width="160" height="160" fill="black" opacity="0.1"/><text x="100" y="100" text-anchor="middle" fill="black" font-size="12">QR Code for: ${url.substring(0, 30)}...</text></svg>`;
    return qrData;
  };

  const shareOptions = [
    { name: "Email", icon: Mail, action: "email" },
    { name: "SMS", icon: MessageSquare, action: "sms" },
    { name: "WhatsApp", icon: MessageSquare, action: "whatsapp" },
    { name: "LinkedIn", icon: Globe, action: "linkedin" },
    { name: "Twitter", icon: Globe, action: "twitter" },
  ];

  const handleShare = (action: string, url: string) => {
    const message = `Join our partner network and start earning commissions! Use my referral link: ${url}`;
    
    switch (action) {
      case 'email':
        window.open(`mailto:?subject=Join Our Partner Network&body=${encodeURIComponent(message)}`);
        break;
      case 'sms':
        window.open(`sms:?body=${encodeURIComponent(message)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`);
        break;
    }
    
    toast({
      title: "Shared!",
      description: `Opened ${action} to share your referral link`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Referral Code Display */}
      <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Your Referral Code
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="text-sm text-gray-600 mb-2">Share this code with potential partners</div>
            <div className="text-4xl font-bold text-blue-600 tracking-wider mb-4" data-testid="text-deals?-code">
              {userReferralCode || 'Not Available'}
            </div>
            <Button
              size="lg"
              onClick={() => copyToClipboard(userReferralCode, "Referral code")}
              data-testid="button-copy-code"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Code
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Primary Referral Link */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Your Referral Link
            <Badge className="bg-blue-100 text-blue-700 border-blue-200">
              <Sparkles className="w-3 h-3 mr-1" />
              Active
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
            <div className="flex-1 text-sm font-mono text-gray-700 break-all" data-testid="text-deals?-url">
              {primaryReferralUrl}
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(primaryReferralUrl, "Referral link")}
                data-testid="button-copy-primary-link"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowQRDialog(true)}
                data-testid="button-qr-primary"
              >
                <QrCode className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-5 gap-2">
            {shareOptions.map((option) => (
              <Button
                key={option.action}
                size="sm"
                variant="outline"
                onClick={() => handleShare(option.action, primaryReferralUrl)}
                className="flex flex-col items-center gap-1 h-auto py-2"
                data-testid={`button-share-${option.action}`}
              >
                <option.icon className="w-4 h-4" />
                <span className="text-xs">{option.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How to Use */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold">1</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Share Your Link</h4>
              <p className="text-sm text-gray-600">Send your deals? link to potential partners via email, social media, or messaging apps.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold">2</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">They Sign Up</h4>
              <p className="text-sm text-gray-600">When someone clicks your link and signs up, they'll be automatically added to your team.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 font-semibold">3</span>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Earn Commissions</h4>
              <p className="text-sm text-gray-600">You'll earn override commissions from their sales and build your network.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>QR Code for Your Referral Link</DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <div className="bg-white p-4 border rounded-lg inline-block">
              <img 
                src={generateQRCode(primaryReferralUrl)} 
                alt="QR Code" 
                className="w-48 h-48"
                data-testid="qr-code-image"
              />
            </div>
            <p className="text-sm text-gray-600">
              Scan this QR code to access your deals? link
            </p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" data-testid="button-download-qr">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" data-testid="button-share-qr">
                <Share className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

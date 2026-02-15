import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Clock,
  Circle,
  Building,
  Calendar,
  FileText,
  CreditCard,
  Upload,
  Download,
  Send,
  MessageSquare,
  FileCheck,
  FileUp,
  XCircle,
  ArrowRight,
  User,
  Bot
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import {
  getPartnerProgressSteps,
  mapDealToPartnerProgress,
  getPartnerStageLabel,
  getApprovedStepLabel,
  type DealStage
} from "@shared/dealWorkflow";

const PROGRESS_ICONS: Record<string, typeof FileText> = {
  submitted: FileText,
  quote_received: Send,
  application_submitted: FileCheck,
  in_progress: Clock,
  approved: CheckCircle2,
  live: CreditCard,
  complete: CheckCircle2,
  declined: XCircle,
};

const PROGRESS_REQUIREMENTS: Record<string, string | ((productType?: string) => string)> = {
  submitted: "We'll prepare a competitive quote for your client",
  quote_received: "Review the quote and approve to proceed",
  application_submitted: "Your application is being processed",
  in_progress: "Documents are being reviewed",
  approved: (productType?: string) =>
    productType === 'business_funding'
      ? "Funding has been agreed for your client"
      : "Terminals are on the way to your client",
  live: "Deal is live - commission will be calculated",
  complete: "Congratulations! This deal is complete",
};

type ViewMode = 'partner' | 'admin';

interface ProgressTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode?: ViewMode;
  deal?: {
    id: string;
    businessName: string;
    businessEmail: string;
    status: string;
    dealStage?: string;
    productType?: string;
    submittedAt: string | Date;
    selectedProducts: string[];
    estimatedCommission?: string;
    quoteId?: string;
    billUploads?: Array<{
      id: string;
      fileName: string;
      fileSize: number;
      mimeType: string;
      uploadedAt: string;
    }>;
  };
}

export default function ProgressTracker({ isOpen, onClose, deal, viewMode = 'partner' }: ProgressTrackerProps) {
  const [uploading, setUploading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const partnerProgressSteps = getPartnerProgressSteps();
  const currentDealStage = (deal?.dealStage || deal?.status || "submitted") as DealStage;
  const isDeclined = currentDealStage === "declined";
  const currentPartnerProgress = mapDealToPartnerProgress(currentDealStage);
  const currentProgressIndex = partnerProgressSteps.findIndex(s => s.id === currentPartnerProgress.id);

  // Fetch latest documents for this business
  const { data: fetchedDocuments = [], refetch: refetchDocuments } = useQuery({
    queryKey: ['/api/bills', deal?.businessName],
    queryFn: async () => {
      const response = await fetch(`/api/bills?businessName=${encodeURIComponent(deal?.businessName || '')}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    enabled: !!deal?.businessName && isOpen,
  });

  // Fetch unified messages for this deal (includes both deal messages and quote Q&A)
  const { data: messages = [], refetch: refetchMessages } = useQuery({
    queryKey: ['/api/deals', deal?.id, 'messages'],
    queryFn: async () => {
      if (!deal?.id) return [];
      const response = await fetch(`/api/deals/${deal.id}/messages`, {
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!deal?.id && isOpen,
  });

  // Send message mutation using unified deal messaging
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      if (!deal?.id) throw new Error('No deal ID');
      return apiRequest(`/api/deals/${deal.id}/messages`, {
        method: 'POST',
        body: JSON.stringify({ message }),
      });
    },
    onSuccess: () => {
      setNewMessage("");
      refetchMessages();
      toast({
        title: "Message Sent",
        description: "Your message has been sent to the team.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to Send",
        description: "Could not send your message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom of messages when new ones arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Use billUploads from deal if available, otherwise use fetched documents
  const documents = deal?.billUploads && deal?.billUploads.length > 0 ? deal?.billUploads : fetchedDocuments;

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    Array.from(files).forEach(file => {
      formData.append('bills', file);
    });
    formData.append('businessName', deal?.businessName || '');

    try {
      const response = await fetch('/api/bills/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        toast({
          title: "Document Uploaded",
          description: "Your document has been uploaded successfully.",
        });
        refetchDocuments();
        queryClient.invalidateQueries({ queryKey: ['/api/bills'] });
        queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const getStageStatus = (index: number): "completed" | "current" | "pending" => {
    if (isDeclined) return "pending";
    if (index < currentProgressIndex) return "completed";
    if (index === currentProgressIndex) return "current";
    return "pending";
  };

  const getCurrentStageInfo = () => {
    if (isDeclined) {
      return {
        label: "Declined",
        description: "Unfortunately this deal did not proceed",
        requirement: "Please contact us if you have any questions",
        icon: XCircle,
      };
    }
    const step = currentPartnerProgress;
    const reqEntry = PROGRESS_REQUIREMENTS[step.id];
    const requirement = typeof reqEntry === 'function'
      ? reqEntry(deal?.productType)
      : reqEntry || "Processing your deal";
    return {
      label: step.id === 'approved'
        ? getApprovedStepLabel(deal?.productType)
        : step.label,
      description: step.description,
      requirement,
      icon: PROGRESS_ICONS[step.id] || FileText,
    };
  };

  const currentStageInfo = getCurrentStageInfo();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage.trim());
    }
  };

  if (!deal) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] p-0 overflow-hidden flex flex-col bg-background border-border">
        <DialogHeader className="px-6 py-4 border-b border-border shrink-0">
          <DialogTitle className="flex items-center gap-2 text-foreground text-2xl font-bold">
            <Building className="w-6 h-6 text-primary" />
            Progress Tracker: {deal.businessName}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {/* Current Status Banner */}
            <Card className={`border-2 ${isDeclined ? 'border-destructive bg-destructive/10' : 'border-primary bg-primary/10'}`}>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-full ${isDeclined ? 'bg-destructive/20' : 'bg-primary/20'}`}>
                    {isDeclined ? (
                      <XCircle className="w-8 h-8 text-destructive" />
                    ) : (
                      <currentStageInfo.icon className="w-8 h-8 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Current Stage</p>
                    <h3 className={`text-xl font-bold ${isDeclined ? 'text-destructive' : 'text-primary'}`}>
                      {currentStageInfo.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {currentStageInfo.description}
                    </p>
                  </div>
                  {deal.estimatedCommission && !isDeclined && (
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Est. Commission</p>
                      <p className="text-2xl font-bold text-primary">£{deal.estimatedCommission}</p>
                    </div>
                  )}
                </div>
                {!isDeclined && (
                  <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border">
                    <p className="text-sm font-medium text-foreground flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-primary" />
                      What's happening next:
                    </p>
                    <p className="text-sm text-muted-foreground ml-6">
                      {currentStageInfo.requirement}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Deal Summary */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground">Deal Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Building className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Business:</span>
                    <span className="font-medium text-foreground">{deal.businessName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Submitted:</span>
                    <span className="font-medium text-foreground">
                      {typeof deal.submittedAt === 'string'
                        ? format(new Date(deal.submittedAt), 'dd MMM yyyy')
                        : format(deal.submittedAt, 'dd MMM yyyy')
                      }
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <CreditCard className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Services:</span>
                    <div className="flex flex-wrap gap-1">
                      {deal.selectedProducts.map((product, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground">Progress Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {partnerProgressSteps.map((step, index) => {
                    const status = getStageStatus(index);
                    const StepIcon = PROGRESS_ICONS[step.id] || Circle;

                    return (
                      <div key={step.id} className="relative flex items-start gap-4 pb-6 last:pb-0">
                        {/* Connector Line */}
                        {index < partnerProgressSteps.length - 1 && (
                          <div
                            className={`absolute left-[18px] top-10 w-0.5 h-[calc(100%-24px)] ${status === "completed" ? "bg-primary" : "bg-border"
                              }`}
                          />
                        )}

                        {/* Status Icon */}
                        <div className={`
                          relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-2 transition-all
                          ${status === "completed"
                            ? "bg-primary border-primary text-primary-foreground"
                            : status === "current"
                              ? "bg-primary/20 border-primary text-primary animate-pulse"
                              : "bg-muted border-border text-muted-foreground"
                          }
                        `}>
                          {status === "completed" ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : status === "current" ? (
                            <Clock className="w-5 h-5" />
                          ) : (
                            <Circle className="w-4 h-4" />
                          )}
                        </div>

                        {/* Stage Content */}
                        <div className="flex-1 min-w-0 pt-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-medium ${status === "completed"
                              ? "text-primary"
                              : status === "current"
                                ? "text-foreground"
                                : "text-muted-foreground"
                              }`}>
                              {step.id === 'approved' ? getApprovedStepLabel(deal?.productType) : step.label}
                            </h4>
                            {status === "completed" && (
                              <Badge variant="outline" className="text-xs border-primary/50 text-primary">
                                Complete
                              </Badge>
                            )}
                            {status === "current" && (
                              <Badge className="text-xs bg-primary text-primary-foreground">
                                Current
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-0.5">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Messages Card */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Messages List */}
                  <div className="max-h-[200px] overflow-y-auto space-y-3 p-3 bg-muted/30 rounded-lg border border-border">
                    {messages.length === 0 ? (
                      <div className="text-center py-4">
                        <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                        <p className="text-sm text-muted-foreground">No messages yet</p>
                        <p className="text-xs text-muted-foreground">Send a message to get in touch with our team</p>
                      </div>
                    ) : (
                      messages.map((msg: any) => {
                        const isPartnerMessage = !msg.isAdmin && (msg.authorType === 'customer' || msg.authorType === 'partner' || msg.isAdmin === false);
                        return (
                          <div
                            key={msg.id}
                            className={`flex gap-3 ${isPartnerMessage ? 'justify-end' : ''}`}
                          >
                            {!isPartnerMessage && (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-primary" />
                              </div>
                            )}
                            <div className={`
                                max-w-[80%] p-3 rounded-lg
                                ${isPartnerMessage
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted border border-border'
                              }
                              `}>
                              <p className="text-sm">{msg.message}</p>
                              <p className={`text-xs mt-1 ${isPartnerMessage ? 'text-primary-foreground/70' : 'text-muted-foreground'
                                }`}>
                                {msg.senderName && <span className="font-medium">{msg.isAdminMessage || msg.authorType === 'admin' ? 'Support' : msg.senderName} · </span>}
                                {msg.createdAt ? format(new Date(msg.createdAt), 'dd MMM HH:mm') : ''}
                              </p>
                            </div>
                            {isPartnerMessage && (
                              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                            )}
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="min-h-[60px] resize-none bg-background border-border"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || sendMessageMutation.isPending}
                      className="self-end bg-primary hover:bg-primary/90"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents Section */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base text-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Documents
                  </CardTitle>
                  <div>
                    <input
                      id="document-upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    <label
                      htmlFor="document-upload"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      {uploading ? "Uploading..." : "Upload"}
                    </label>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc: any, index: number) => (
                      <div
                        key={`${deal.id}-${doc.id}-${index}`}
                        className="flex items-center justify-between p-3 bg-muted/30 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">{doc.fileName || 'Unnamed document'}</p>
                            <p className="text-xs text-muted-foreground">
                              {doc.uploadedAt ? format(new Date(doc.uploadedAt), 'dd MMM yyyy') : 'Date unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(`/api/bills/${doc.id}/view`, '_blank')}
                            className="border-primary/30 text-primary hover:bg-primary/10"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              try {
                                const response = await fetch(`/api/bills/${doc.id}/download`);
                                if (!response.ok) throw new Error('Download failed');

                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = doc.fileName;
                                document.body.appendChild(a);
                                a.click();
                                window.URL.revokeObjectURL(url);
                                document.body.removeChild(a);
                              } catch (error) {
                                console.error('Download error:', error);
                              }
                            }}
                            className="border-primary/30 text-primary hover:bg-primary/10"
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Upload className="w-8 h-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="text-sm text-muted-foreground">No documents uploaded yet</p>
                    <p className="text-xs text-muted-foreground mt-1">Upload payment processing bills or other relevant documents</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-border shrink-0 bg-background">
          <Button onClick={onClose} variant="outline" className="border-border">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

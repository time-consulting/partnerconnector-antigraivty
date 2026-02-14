import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle2,
  MessageSquare,
  TrendingUp,
  Send,
  FileText,
  X,
  User,
  Upload,
  Clock,
  Building,
  Mail,
  Phone,
  Calendar,
  Banknote,
  CreditCard,
  FileCheck,
  AlertCircle,
  ThumbsUp,
  ArrowRight,
  TrendingDown,
  Bell,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import AdditionalDetailsForm from "./additional-details-form";
import {
  getPartnerProgressSteps,
  getAdminProgressSteps,
  mapDealToPartnerProgress,
  STAGE_CONFIG,
  type DealStage
} from "@shared/dealWorkflow";

type ViewMode = 'partner' | 'admin';

interface UnifiedDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  deal: any;
  viewMode?: ViewMode;
}

interface ActionButtonsProps {
  deal: any;
  onActionComplete: () => void;
}

function ActionButtons({ deal, onActionComplete }: ActionButtonsProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const [showRateRequestForm, setShowRateRequestForm] = useState(false);
  const [showSignupForm, setShowSignupForm] = useState(false);
  const [rateRequestMessage, setRateRequestMessage] = useState("");
  const queryClient = useQueryClient();

  const isAdmin = user?.isAdmin === true;
  const quoteId = deal.quoteId || deal.quote?.id;
  const quote = deal.quote || {};
  const dealStage = deal.dealStage || deal.status || 'submitted';

  // Use dealStage as source of truth for button visibility
  const hasQuote = !!quoteId;
  const signupCompleted = !!deal.signupCompletedAt;

  // Stages where quote has been sent but not yet approved by partner
  const isQuoteSentStage = dealStage === 'quote_sent';

  // Stages where quote is approved but signup not yet completed
  const needsSignupStages = ['quote_approved', 'agreement_sent', 'signed_awaiting_docs', 'under_review', 'approved'];
  const needsSignup = needsSignupStages.includes(dealStage) && !signupCompleted;

  // Stages where admin needs to send quote to client
  const needsAdminSend = hasQuote && ['submitted', 'quote_request_received'].includes(dealStage);

  // Determine action required
  const getActionRequired = () => {
    if (!hasQuote) return null;

    // Client: Quote sent but not approved - needs to approve
    if (!isAdmin && isQuoteSentStage) {
      return { by: 'client', type: 'approve_quote', label: 'Review & Approve Quote' };
    }
    // Client: Quote approved but signup not completed
    if (!isAdmin && needsSignup) {
      return { by: 'client', type: 'complete_signup', label: 'Complete Application' };
    }
    // Admin: Quote exists but not sent to client
    if (isAdmin && needsAdminSend) {
      return { by: 'admin', type: 'send_to_client', label: 'Send Quote to Client' };
    }
    return null;
  };

  const actionRequired = getActionRequired();

  // Approve Quote mutation - auto-opens signup form on success
  const approveQuoteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/quotes/${quoteId}/approve`, {});
    },
    onSuccess: () => {
      toast({ title: "Quote Approved", description: "Opening sign-up form..." });
      queryClient.invalidateQueries({ queryKey: ['/api/deals/with-quotes'] });
      // Auto-open the signup form immediately after approval
      setShowSignupForm(true);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to approve quote. Please try again.", variant: "destructive" });
    }
  });

  // Request Lower Rates mutation  
  const requestRatesMutation = useMutation({
    mutationFn: async (request: string) => {
      return apiRequest('POST', `/api/quotes/${quoteId}/rate-request`, { request });
    },
    onSuccess: () => {
      toast({ title: "Request Sent", description: "Your rate request has been sent to our team." });
      setShowRateRequestForm(false);
      setRateRequestMessage("");
      queryClient.invalidateQueries({ queryKey: ['/api/deals/with-quotes'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send request. Please try again.", variant: "destructive" });
    }
  });

  // Send to Client mutation (Admin only)
  const sendToClientMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/quotes/${quoteId}/send-to-client`, {});
    },
    onSuccess: () => {
      toast({ title: "Quote Sent", description: "Quote has been sent to the client." });
      queryClient.invalidateQueries({ queryKey: ['/api/deals/with-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/quotes'] });
      onActionComplete();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send quote. Please try again.", variant: "destructive" });
    }
  });

  // Send Reminder mutation (for agreement_sent stage)
  const sendReminderMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', `/api/deals/${deal.id}/send-reminder`, {});
    },
    onSuccess: () => {
      toast({ title: "Reminder Sent", description: "A reminder email has been sent to the client." });
      queryClient.invalidateQueries({ queryKey: ['/api/deals', deal.id, 'messages'] });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to send reminder. Please try again.", variant: "destructive" });
    }
  });

  const handleCompleteSignup = () => {
    setShowSignupForm(true);
  };

  const handleSignupComplete = () => {
    setShowSignupForm(false);
    queryClient.invalidateQueries({ queryKey: ['/api/deals/with-quotes'] });
    onActionComplete();
    toast({ title: "Application Submitted", description: "Your application has been submitted to admin for processing." });
  };

  const handleSubmitRateRequest = () => {
    if (rateRequestMessage.trim()) {
      requestRatesMutation.mutate(rateRequestMessage);
    }
  };

  // Determine which buttons to show based on dealStage
  const showApproveQuote = !isAdmin && hasQuote && isQuoteSentStage;
  const showRequestRates = !isAdmin && hasQuote && isQuoteSentStage;
  const showCompleteSignup = !isAdmin && hasQuote && needsSignup;
  const showSendToClient = isAdmin && needsAdminSend;
  // Show reminder button when deal is at agreement_sent stage (waiting for client to sign)
  const showSendReminder = !isAdmin && dealStage === 'agreement_sent';

  const hasActions = showApproveQuote || showRequestRates || showCompleteSignup || showSendToClient || showSendReminder;

  if (!hasActions && !actionRequired) return null;

  return (
    <div className="bg-gradient-to-r from-teal-900/30 to-blue-900/30 rounded-2xl p-4 border border-teal-500/30 mb-4">
      {actionRequired && (
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="h-5 w-5 text-amber-400" />
          <span className="text-amber-400 font-medium text-sm">Action Required:</span>
          <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
            {actionRequired.label}
          </Badge>
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        {showApproveQuote && (
          <Button
            onClick={() => approveQuoteMutation.mutate()}
            disabled={approveQuoteMutation.isPending}
            className="bg-green-600 hover:bg-green-700 text-white"
            data-testid="button-approve-quote"
          >
            <ThumbsUp className="h-4 w-4 mr-2" />
            {approveQuoteMutation.isPending ? "Approving..." : "Approve & Sign Up"}
          </Button>
        )}

        {showRequestRates && !showRateRequestForm && (
          <Button
            onClick={() => setShowRateRequestForm(true)}
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-900/30"
            data-testid="button-request-lower-rates"
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Request Lower Rates
          </Button>
        )}

        {showCompleteSignup && (
          <Button
            onClick={handleCompleteSignup}
            className="bg-teal-600 hover:bg-teal-700 text-white"
            data-testid="button-complete-signup"
          >
            <ArrowRight className="h-4 w-4 mr-2" />
            Complete Application
          </Button>
        )}

        {showSendToClient && (
          <Button
            onClick={() => sendToClientMutation.mutate()}
            disabled={sendToClientMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="button-send-to-client"
          >
            <Send className="h-4 w-4 mr-2" />
            {sendToClientMutation.isPending ? "Sending..." : "Send to Client"}
          </Button>
        )}

        {showSendReminder && (
          <Button
            onClick={() => sendReminderMutation.mutate()}
            disabled={sendReminderMutation.isPending}
            variant="outline"
            className="border-amber-500/50 text-amber-400 hover:bg-amber-900/30"
            data-testid="button-send-reminder"
          >
            <Bell className="h-4 w-4 mr-2" />
            {sendReminderMutation.isPending ? "Sending..." : "Send Client Reminder"}
          </Button>
        )}
      </div>

      {showRateRequestForm && (
        <div className="mt-4 space-y-3">
          <Textarea
            value={rateRequestMessage}
            onChange={(e) => setRateRequestMessage(e.target.value)}
            placeholder="Explain why you need lower rates (e.g., client has a competing offer, high volume expected...)"
            className="bg-[#1e3a5f]/50 border-[#1e3a5f] text-white placeholder:text-gray-500 min-h-[80px]"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSubmitRateRequest}
              disabled={!rateRequestMessage.trim() || requestRatesMutation.isPending}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {requestRatesMutation.isPending ? "Sending..." : "Submit Request"}
            </Button>
            <Button
              onClick={() => { setShowRateRequestForm(false); setRateRequestMessage(""); }}
              variant="outline"
              className="border-gray-500 text-gray-400"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {showSignupForm && quoteId && (
        <AdditionalDetailsForm
          isOpen={showSignupForm}
          onClose={() => setShowSignupForm(false)}
          onComplete={handleSignupComplete}
          quoteId={quoteId}
          deal={{ id: deal.id, businessName: deal.businessName, businessEmail: deal.businessEmail }}
        />
      )}
    </div>
  );
}

function MessagingSection({ dealId }: { dealId: string }) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['/api/deals', dealId, 'messages'],
    queryFn: async () => {
      const response = await fetch(`/api/deals/${dealId}/messages`, {
        credentials: 'include',
      });
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!dealId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      return apiRequest('POST', `/api/deals/${dealId}/messages`, { message });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/deals', dealId, 'messages'] });
      setNewMessage("");
      toast({
        title: "Message sent",
        description: "Your message has been added to the conversation",
      });
    },
  });

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessageMutation.mutate(newMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
        <p className="text-gray-400">Loading conversation...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <MessageSquare className="h-5 w-5 text-teal-400" />
        Conversation
      </h3>

      {messages.length > 0 ? (
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {messages.map((msg: any) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${msg.authorType === 'admin' || msg.isAdminMessage
                ? 'bg-teal-900/30 border border-teal-600/50'
                : 'bg-[#1e3a5f]/50 border border-[#1e3a5f]'
                }`}
            >
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-400 mb-1">
                    {msg.authorType === 'admin' || msg.isAdminMessage ? 'Support' : (msg.senderName || msg.authorName || 'You')}
                  </p>
                  <p className="text-sm text-white">{msg.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.createdAt && new Date(msg.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <p className="text-gray-400 text-sm mb-4">No messages yet. Start a conversation with our team below.</p>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="Ask a question or send an update..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          className="bg-[#1e3a5f]/50 border-[#1e3a5f] text-white placeholder:text-gray-500"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
          className="bg-teal-600 hover:bg-teal-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

// Admin Commission Creation Section - shows at LIVE stage
function AdminCommissionSection({ deal, onComplete }: { deal: any; onComplete: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [grossAmount, setGrossAmount] = useState("");
  const [currency, setCurrency] = useState("GBP");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [notes, setNotes] = useState("");

  const dealStage = deal.dealStage || deal.status || 'submitted';
  const isLiveStage = ['live', 'live_confirm_ltr'].includes(dealStage);

  // Check if payment already exists for this deal
  const { data: paymentStatus, isLoading } = useQuery({
    queryKey: ['/api/admin/deals', deal.id, 'payment-status'],
    queryFn: async () => {
      const response = await fetch(`/api/admin/deals/${deal.id}/payment-status`);
      if (!response.ok) return { hasPayment: false };
      return response.json();
    },
    enabled: isLiveStage,
  });

  // Create commission mutation
  const createCommissionMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('POST', '/api/admin/payments/create-commission', {
        dealId: deal.id,
        grossAmount: parseFloat(grossAmount),
        currency,
        evidenceUrl: evidenceUrl || null,
        notes: notes || null,
      });
    },
    onSuccess: () => {
      toast({ title: "Commission Created", description: "Commission has been sent to Payments for approval." });
      queryClient.invalidateQueries({ queryKey: ['/api/deals/with-quotes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals', deal.id, 'payment-status'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments/needs-approval'] });
      setShowForm(false);
      setGrossAmount("");
      setEvidenceUrl("");
      setNotes("");
      onComplete();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to create commission. Please try again.",
        variant: "destructive"
      });
    }
  });

  if (!isLiveStage) return null;
  if (isLoading) return <div className="text-gray-400 text-sm">Loading payment status...</div>;

  // If payment already exists, show status
  if (paymentStatus?.hasPayment) {
    const payment = paymentStatus.payment;
    const statusColors: Record<string, string> = {
      needs_approval: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
      approved: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      paid: 'bg-green-500/20 text-green-400 border-green-500/50',
    };

    return (
      <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-2xl p-4 border border-green-500/30">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <Banknote className="h-5 w-5 text-green-400" />
            Commission Created
          </h4>
          <Badge className={statusColors[payment.paymentStatus] || 'bg-gray-500/20 text-gray-400'}>
            {payment.paymentStatus === 'needs_approval' ? 'Needs Approval' :
              payment.paymentStatus === 'approved' ? 'Approved' :
                payment.paymentStatus === 'paid' ? 'Paid' : payment.paymentStatus}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Gross Amount</p>
            <p className="text-white font-medium">{payment.currency || 'GBP'} {parseFloat(payment.grossAmount || payment.totalCommission).toFixed(2)}</p>
          </div>
          <div>
            <p className="text-gray-400">Created</p>
            <p className="text-white">{payment.createdAt ? format(new Date(payment.createdAt), 'MMM d, yyyy') : 'N/A'}</p>
          </div>
        </div>
        {payment.splits && payment.splits.length > 0 && (
          <div className="mt-3 pt-3 border-t border-green-500/30">
            <p className="text-gray-400 text-xs mb-2">Commission Splits</p>
            <div className="space-y-1">
              {payment.splits.map((split: any, idx: number) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    L{split.level}: {split.beneficiaryName} ({split.percentage}%)
                  </span>
                  <span className="text-white">{currency} {parseFloat(split.amount).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Show create commission button/form
  return (
    <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-4 border border-amber-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Banknote className="h-5 w-5 text-amber-400" />
        <span className="font-semibold text-white">Commission</span>
        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">
          Ready to Create
        </Badge>
      </div>

      {!showForm ? (
        <Button
          onClick={() => setShowForm(true)}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          <FileCheck className="h-4 w-4 mr-2" />
          Confirm LTR / Create Commission
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Total Commission Amount *</label>
              <Input
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                className="bg-[#1e3a5f]/50 border-[#1e3a5f] text-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-400 mb-1 block">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full h-10 rounded-md bg-[#1e3a5f]/50 border border-[#1e3a5f] text-white px-3"
              >
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Evidence URL (Bill/Statement Link)</label>
            <Input
              placeholder="https://..."
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              className="bg-[#1e3a5f]/50 border-[#1e3a5f] text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 mb-1 block">Notes (Optional)</label>
            <Textarea
              placeholder="Any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-[#1e3a5f]/50 border-[#1e3a5f] text-white placeholder:text-gray-500 min-h-[60px]"
            />
          </div>

          {grossAmount && parseFloat(grossAmount) > 0 && (
            <div className="bg-[#0d2137] rounded-lg p-3 border border-[#1e3a5f]">
              <p className="text-xs text-gray-400 mb-2">Commission Split Preview (60% / 20% / 10%)</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">L0: Direct Referrer (60%)</span>
                  <span className="text-white">{currency} {(parseFloat(grossAmount) * 0.60).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">L1: Upline (20%)</span>
                  <span className="text-white">{currency} {(parseFloat(grossAmount) * 0.20).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">L2: Upline (10%)</span>
                  <span className="text-white">{currency} {(parseFloat(grossAmount) * 0.10).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={() => createCommissionMutation.mutate()}
              disabled={!grossAmount || parseFloat(grossAmount) <= 0 || createCommissionMutation.isPending}
              className="flex-1 bg-amber-600 hover:bg-amber-700"
            >
              {createCommissionMutation.isPending ? "Creating..." : "Create Commission & Send to Payments"}
            </Button>
            <Button
              onClick={() => { setShowForm(false); setGrossAmount(""); setEvidenceUrl(""); setNotes(""); }}
              variant="outline"
              className="border-gray-500 text-gray-400"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function DocumentUploadSection({ dealId, businessName }: { dealId: string; businessName: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: uploadedDocs = [], refetch: refetchDocs } = useQuery({
    queryKey: ['/api/bills', businessName],
    queryFn: async () => {
      const response = await fetch(`/api/bills?businessName=${encodeURIComponent(businessName)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!businessName,
  });

  const uploadFile = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('bills', file);
    formData.append('businessName', businessName);

    try {
      const response = await fetch('/api/bills/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast({
          title: "Document uploaded successfully!",
          description: "Your document has been submitted for review",
        });
        refetchDocs();
        queryClient.invalidateQueries({ queryKey: ['/api/deals/with-quotes'] });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your document. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <Upload className="h-5 w-5 text-teal-400" />
        Documents
        <span className="text-sm font-normal text-gray-500">(Optional)</span>
      </h3>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${dragActive
          ? 'border-teal-500 bg-teal-900/20'
          : 'border-[#1e3a5f] bg-[#1e3a5f]/30 hover:border-teal-500/50'
          }`}
      >
        <Upload className="h-8 w-8 text-gray-500 mx-auto mb-2" />
        <p className="text-sm text-white mb-1">Drag and drop or click to upload</p>
        <p className="text-xs text-gray-500">PDF, JPEG, PNG (Max 10MB)</p>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          size="sm"
          className="mt-3 border-[#1e3a5f] text-white hover:bg-[#1e3a5f]"
        >
          {uploading ? 'Uploading...' : 'Select File'}
        </Button>
      </div>

      {uploadedDocs.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadedDocs.map((doc: any) => (
            <div
              key={doc.id}
              className="flex items-center justify-between p-3 bg-green-900/20 border border-green-600/50 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-sm text-white truncate">{doc.fileName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function UnifiedDealModal({ isOpen, onClose, deal, viewMode = 'partner' }: UnifiedDealModalProps) {
  if (!deal) return null;

  const isAdminView = viewMode === 'admin';
  const currentStage = (deal.dealStage || deal.status || "submitted") as DealStage;
  const isDeclined = currentStage === 'declined';

  const partnerProgressSteps = getPartnerProgressSteps();
  const adminProgressSteps = getAdminProgressSteps();

  const currentPartnerProgress = mapDealToPartnerProgress(currentStage, deal.signupCompletedAt);
  const partnerStageIndex = partnerProgressSteps.findIndex(s => s.id === currentPartnerProgress.id);
  const adminStageIndex = adminProgressSteps.findIndex(s => s.id === currentStage);

  const progressSteps = isAdminView ? adminProgressSteps : partnerProgressSteps;
  const currentProgressIndex = isAdminView ? (adminStageIndex === -1 ? 0 : adminStageIndex) : (partnerStageIndex === -1 ? 0 : partnerStageIndex);
  const currentProgressLabel = isAdminView
    ? (STAGE_CONFIG[currentStage]?.adminLabel || 'Processing')
    : currentPartnerProgress.label;

  const hasQuote = !!deal.quoteId || !!deal.quote;
  const hasRates = deal.debitCardRate || deal.creditCardRate;
  const hasDevices = deal.devices && deal.devices.length > 0;
  const isFundingDeal = deal.productType === 'business_funding' ||
    (deal.selectedProducts && Array.isArray(deal.selectedProducts) && deal.selectedProducts.includes('business-funding')) ||
    deal.quoteType === 'business_funding' || deal.quoteType === 'funding_with_cards';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="!flex !flex-col max-w-6xl w-[95vw] h-[95vh] max-h-[95vh] bg-[#0a1628] border-[#1e3a5f] text-white p-0 overflow-hidden gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-[#1e3a5f] bg-[#0a1628] flex-shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold mb-2 text-white">
                {deal.businessName}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Deal ID: {deal.dealId || deal.id}
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-400 hover:text-white hover:bg-[#1e3a5f]"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-4 bg-[#0d2137] rounded-xl p-4 border border-[#1e3a5f]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-400">Current Stage</span>
              <Badge className={isDeclined
                ? "bg-gray-500/20 text-gray-400 border-gray-500/50"
                : "bg-teal-500/20 text-teal-400 border-teal-500/50"}>
                {isDeclined ? 'Declined' : currentProgressLabel}
              </Badge>
            </div>
            {!isDeclined && (
              <>
                <div className="flex items-center gap-1 overflow-x-auto pb-2">
                  {progressSteps.map((stage, index) => {
                    const isCompleted = index < currentProgressIndex;
                    const isCurrent = index === currentProgressIndex;

                    return (
                      <div key={stage.id} className="flex items-center">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium shrink-0 ${isCompleted ? 'bg-teal-500 text-white' :
                            isCurrent ? 'bg-teal-500/30 text-teal-400 ring-2 ring-teal-500' :
                              'bg-[#1e3a5f] text-gray-500'
                            }`}
                          title={stage.label}
                        >
                          {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : (index + 1)}
                        </div>
                        {index < progressSteps.length - 1 && (
                          <div className={`w-4 md:w-8 h-0.5 ${isCompleted ? 'bg-teal-500' : 'bg-[#1e3a5f]'}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{progressSteps[0]?.shortLabel || 'Start'}</span>
                  <span>{progressSteps[progressSteps.length - 1]?.shortLabel || 'End'}</span>
                </div>
              </>
            )}
            {isDeclined && (
              <div className="text-center py-2 text-gray-400 text-sm">
                This deal has been declined and is no longer active.
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6 overflow-y-auto flex-1 min-h-0">
          <ActionButtons deal={deal} onActionComplete={() => { }} />

          {/* Admin Commission Section - only shows at LIVE stage for admins */}
          {isAdminView && (
            <AdminCommissionSection deal={deal} onComplete={() => { }} />
          )}

          <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
              <Building className="h-5 w-5 text-teal-400" />
              Business Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-teal-400" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-white">{deal.businessEmail}</p>
                </div>
              </div>
              {deal.businessPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-teal-400" />
                  <div>
                    <p className="text-xs text-gray-400">Phone</p>
                    <p className="text-sm text-white">{deal.businessPhone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-teal-400" />
                <div>
                  <p className="text-xs text-gray-400">Submitted</p>
                  <p className="text-sm text-white">
                    {deal.submittedAt && format(new Date(deal.submittedAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
              {deal.monthlyVolume && (
                <div className="flex items-center gap-3">
                  <Banknote className="h-4 w-4 text-teal-400" />
                  <div>
                    <p className="text-xs text-gray-400">Monthly Volume</p>
                    <p className="text-sm text-white">{deal.monthlyVolume}</p>
                  </div>
                </div>
              )}
              {deal.selectedProducts && deal.selectedProducts.length > 0 && (
                <div className="flex items-start gap-3 col-span-full">
                  <CreditCard className="h-4 w-4 text-teal-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400">Products</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {deal.selectedProducts.map((product: string, index: number) => (
                        <Badge key={index} className="bg-teal-500/20 text-teal-400 border-teal-500/50 text-xs">
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Business Funding Overview - shows for funding deals instead of card rates */}
          {isFundingDeal && hasQuote && (
            <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Banknote className="h-5 w-5 text-green-400" />
                Business Funding Application
              </h3>

              <div className="bg-gradient-to-r from-green-900/30 to-teal-900/30 rounded-xl p-5 border border-green-500/30 mb-5">
                <p className="text-green-200 mb-1 text-sm font-medium">What happens next</p>
                <p className="text-white text-sm">
                  Complete the application form below to request your business funding quotes. This is a soft search only and will not affect your credit score.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="text-white font-medium">Complete the application form</p>
                    <p className="text-gray-400 text-sm">Submit your details to request business funding</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="text-white font-medium">Receive 3 funding quotes</p>
                    <p className="text-gray-400 text-sm">This is a soft search only — it will not appear on your credit file</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="text-white font-medium">No obligation to proceed</p>
                    <p className="text-gray-400 text-sm">You can choose not to proceed if the funding amounts don't suit you</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="text-white font-medium">Specialised funding team</p>
                    <p className="text-gray-400 text-sm">A dedicated funding specialist will contact you directly with your quotes</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-teal-500/20 text-teal-400 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                  <div>
                    <p className="text-white font-medium">Instant decision</p>
                    <p className="text-gray-400 text-sm">If you proceed, your application goes straight to approved or declined — no further credit checks</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 bg-amber-900/20 rounded-lg p-3 border border-amber-500/30">
                <Shield className="h-5 w-5 text-amber-400 flex-shrink-0" />
                <p className="text-amber-200 text-sm">
                  <strong>Soft search only</strong> — requesting quotes will not affect your credit score
                </p>
              </div>
            </div>
          )}

          {!isFundingDeal && deal.estimatedMonthlySaving && (
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <p className="text-teal-200 text-sm font-medium mb-2">Estimated Annual Savings</p>
                  <p className="text-4xl font-bold mb-2">
                    £{(parseFloat(deal.estimatedMonthlySaving) * 12).toLocaleString()}
                  </p>
                  <p className="text-teal-200">
                    Save £{parseFloat(deal.estimatedMonthlySaving).toFixed(2)} per month with Dojo
                  </p>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl px-6 py-4 text-center">
                  <p className="text-teal-200 text-sm mb-1">12-Month Rate Guarantee</p>
                  <CheckCircle2 className="h-10 w-10 mx-auto" />
                </div>
              </div>
            </div>
          )}

          {!isFundingDeal && hasRates && (
            <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <TrendingUp className="h-5 w-5 text-teal-400" />
                Card Processing Rates
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {deal.debitCardRate && (
                  <div className="bg-[#1e3a5f]/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">UK Debit Cards</p>
                    <p className="text-2xl font-bold text-teal-400">{deal.debitCardRate}%</p>
                  </div>
                )}
                {deal.creditCardRate && (
                  <div className="bg-[#1e3a5f]/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Credit Cards</p>
                    <p className="text-2xl font-bold text-teal-400">{deal.creditCardRate}%</p>
                  </div>
                )}
                {deal.corporateCardRate && (
                  <div className="bg-[#1e3a5f]/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Corporate Cards</p>
                    <p className="text-2xl font-bold text-teal-400">{deal.corporateCardRate}%</p>
                  </div>
                )}
                {deal.visaBusinessDebitRate && (
                  <div className="bg-[#1e3a5f]/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">Visa Business Debit</p>
                    <p className="text-2xl font-bold text-teal-400">{deal.visaBusinessDebitRate}%</p>
                  </div>
                )}
                {deal.amexRate && (
                  <div className="bg-[#1e3a5f]/50 rounded-xl p-4">
                    <p className="text-sm text-gray-400 mb-1">American Express</p>
                    <p className="text-2xl font-bold text-teal-400">{deal.amexRate}%</p>
                  </div>
                )}
              </div>
              {deal.secureTransactionFee && (
                <div className="mt-4 pt-4 border-t border-[#1e3a5f]">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-300 font-medium">Secure Transaction Fee</p>
                    <p className="text-lg font-semibold text-white">{deal.secureTransactionFee}p per transaction</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {!hasQuote && !hasRates && (
            <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f] text-center">
              <Clock className="h-12 w-12 text-teal-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">Quote in Progress</h3>
              <p className="text-gray-400">
                Our team is preparing a competitive quote for your client. You'll see the rates and savings here once ready.
              </p>
            </div>
          )}

          {hasDevices && (
            <div className="bg-[#0d2137] rounded-2xl p-6 border border-[#1e3a5f]">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-purple-400" />
                Card Machines & Equipment
              </h3>
              <div className="space-y-3">
                {deal.devices.map((device: any, index: number) => (
                  <div key={index} className="flex justify-between items-center bg-[#1e3a5f]/50 rounded-xl p-4">
                    <div>
                      <p className="font-semibold text-white">{device.name}</p>
                      <p className="text-sm text-gray-400">Quantity: {device.quantity}</p>
                    </div>
                    <div className="text-right">
                      {deal.devicePaymentType === 'pay_once' ? (
                        <p className="text-lg font-bold text-purple-400">£{device.price?.toFixed(2)} one-time</p>
                      ) : (
                        <p className="text-lg font-bold text-purple-400">£{device.monthlyPrice?.toFixed(2)}/month</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {deal.totalAmount && (
            <div className="bg-gradient-to-br from-[#0d2137] to-[#1e3a5f] rounded-2xl p-6 text-white border border-[#1e3a5f]">
              <h3 className="text-xl font-bold mb-4">Monthly Summary</h3>
              <div className="space-y-2">
                {deal.monthlyDeviceCost > 0 && (
                  <div className="flex justify-between items-center pb-2 border-b border-[#1e3a5f]">
                    <p className="text-gray-400">Device Rental</p>
                    <p className="text-lg font-semibold">£{parseFloat(deal.monthlyDeviceCost).toFixed(2)}</p>
                  </div>
                )}
                {deal.hardwareCare && (
                  <div className="flex justify-between items-center pb-2 border-b border-[#1e3a5f]">
                    <p className="text-gray-400">Hardware Care</p>
                    <p className="text-lg font-semibold">£5.00/device</p>
                  </div>
                )}
                {deal.dojoPlan && (
                  <div className="flex justify-between items-center pb-2 border-b border-[#1e3a5f]">
                    <p className="text-gray-400">Dojo Plan</p>
                    <p className="text-lg font-semibold">£11.99</p>
                  </div>
                )}
                <div className="flex justify-between items-center pt-4">
                  <p className="text-xl font-bold">Total Monthly Cost</p>
                  <p className="text-3xl font-bold text-teal-400">
                    £{parseFloat(deal.totalAmount).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {deal.adminNotes && (
            <div className="bg-amber-900/20 rounded-2xl p-6 border border-amber-600/50">
              <h4 className="font-semibold text-amber-400 mb-2 flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Progress Log
              </h4>
              <p className="text-gray-300 whitespace-pre-line">{deal.adminNotes}</p>
            </div>
          )}

          <DocumentUploadSection dealId={deal.id} businessName={deal.businessName} />

          <MessagingSection dealId={deal.id} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

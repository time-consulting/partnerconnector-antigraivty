import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import SideNavigation from "@/components/side-navigation";
import Navigation from "@/components/navigation";
import MlmVisualization from "@/components/mlm-visualization";
import QuoteBuilder from "@/components/quote-builder";
import { AdminSignupsTabs } from "@/components/admin-signups-tabs";
import { AdminPaymentsPortal } from "@/components/admin-payments-portal";
import { AdminInvoicesView } from "@/components/admin-invoices-view";
import {
  Search,
  Filter,
  Eye,
  Edit,
  FileText,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Settings,
  Download,
  Upload,
  Users,
  TrendingUp,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
  Plus,
  Trash2,
  ExternalLink,
  Shield,
  Bell,
  Home,
  Database,
  FileBarChart,
  MessageSquare,
  XCircle
} from "lucide-react";

// Quote form schema
const quoteFormSchema = z.object({
  totalAmount: z.string().min(1, "Amount is required"),
  cardRate: z.string().min(1, "Card rate is required"),
  businessFundingRate: z.string().optional(),
  adminNotes: z.string().optional(),
  validUntil: z.string().optional(),
});

// Document requirements schema
const documentRequirementsSchema = z.object({
  requiredDocuments: z.array(z.string()).min(1, "At least one document is required"),
  notes: z.string().optional(),
});

// Stage form schema
const stageFormSchema = z.object({
  stage: z.string().min(1, "Stage is required"),
  notes: z.string().optional(),
});

// Stage override schema
const stageOverrideSchema = z.object({
  dealStage: z.string().min(1, "Stage is required"),
  status: z.string().optional(),
  overrideReason: z.string().min(1, "Override reason is required"),
  adminNotes: z.string().optional(),
});

// Confirm payment schema
const confirmPaymentSchema = z.object({
  actualCommission: z.string().min(1, "Commission amount is required"),
  paymentReference: z.string().min(1, "Payment reference is required"),
  paymentMethod: z.string().optional(),
  paymentNotes: z.string().optional(),
});

// Component to display deals documents with view/download
function ReferralDocumentsDisplay({ businessName }: { businessName: string }) {
  const { data: documents = [] } = useQuery({
    queryKey: ['/api/bills', businessName],
    queryFn: async () => {
      if (!businessName) return [];
      const response = await fetch(`/api/bills?businessName=${encodeURIComponent(businessName)}`);
      if (!response.ok) throw new Error('Failed to fetch documents');
      return response.json();
    },
    enabled: !!businessName,
  });

  const handleDownload = async (docId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/bills/${docId}/download`);
      if (!response.ok) throw new Error('Download failed');
      
      // Get the blob from response
      const blob = await response.blob();
      
      // Create object URL from blob
      const url = window.URL.createObjectURL(blob);
      
      // Create temporary anchor element for download
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  const handleView = (docId: string) => {
    // Open in new tab for viewing
    window.open(`/api/bills/${docId}/view`, '_blank');
  };

  if (!documents || documents.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg">
      <div className="flex items-center gap-2 mb-3">
        <FileText className="w-5 h-5 text-indigo-600" />
        <p className="text-sm font-semibold text-gray-900">Uploaded Documents ({documents.length})</p>
      </div>
      <div className="space-y-2">
        {documents.map((doc: any) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-white border border-indigo-200 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-indigo-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate" data-testid={`text-document-${doc.id}`}>
                  {doc.fileName}
                </p>
                <p className="text-xs text-gray-500">
                  Uploaded {new Date(doc.uploadedAt).toLocaleDateString()} at{' '}
                  {new Date(doc.uploadedAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2 ml-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleView(doc.id)}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                data-testid={`button-view-${doc.id}`}
              >
                <Eye className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(doc.id, doc.fileName)}
                className="border-green-300 text-green-700 hover:bg-green-50"
                data-testid={`button-download-${doc.id}`}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showDocumentsModal, setShowDocumentsModal] = useState(false);
  const [showStageModal, setShowStageModal] = useState(false);
  const [showStageOverrideModal, setShowStageOverrideModal] = useState(false);
  const [showConfirmPaymentModal, setShowConfirmPaymentModal] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'input' | 'preview' | 'confirm'>('input');
  const [commissionPreview, setCommissionPreview] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedReferrals, setSelectedReferrals] = useState<string[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [seedingTestData, setSeedingTestData] = useState(false);
  const [selectedSignup, setSelectedSignup] = useState<any>(null);
  const [showCommissionModal, setShowCommissionModal] = useState(false);
  const [commissionStep, setCommissionStep] = useState<'review' | 'confirm'>('review');
  const [selectedSignupForDocs, setSelectedSignupForDocs] = useState<any>(null);
  const [showDocsOutDialog, setShowDocsOutDialog] = useState(false);
  const [showAwaitingDocsDialog, setShowAwaitingDocsDialog] = useState(false);
  const [docsOutNotes, setDocsOutNotes] = useState("");
  const [awaitingDocsNotes, setAwaitingDocsNotes] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [sentDealsExpanded, setSentDealsExpanded] = useState(true);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [signupSubTab, setSignupSubTab] = useState("sent_quotes");
  const [sentDealsSearchTerm, setSentDealsSearchTerm] = useState("");
  const [showDocsInDialog, setShowDocsInDialog] = useState(false);
  const [showDecisionDialog, setShowDecisionDialog] = useState(false);
  const [docsInNotes, setDocsInNotes] = useState("");
  const [receivedDocuments, setReceivedDocuments] = useState<string[]>([]);
  const [outstandingDocuments, setOutstandingDocuments] = useState<string[]>([]);
  const [decision, setDecision] = useState<'approved' | 'declined'>('approved');
  const [decisionNotes, setDecisionNotes] = useState("");
  const [decisionCommission, setDecisionCommission] = useState("");
  const [showCancelQuoteDialog, setShowCancelQuoteDialog] = useState(false);
  const [selectedQuoteToCancel, setSelectedQuoteToCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customCancelReason, setCustomCancelReason] = useState("");

  // Check if user is admin
  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!(user as any)?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <SideNavigation />
        <div className="lg:ml-16">
          <Navigation />
          <div className="max-w-4xl mx-auto px-4 py-16 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
            <p className="text-gray-600 text-lg">You don't have admin privileges to access this area.</p>
          </div>
        </div>
      </div>
    );
  }

  // Fetch admin deals
  const { data: dealsData, isLoading: dealsLoading } = useQuery<{
    deals: any[];
    total: number;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>({
    queryKey: ['/api/admin/deals', { search: searchTerm, status: statusFilter, page: currentPage }],
    enabled: !!(user as any)?.isAdmin,
  });

  // Fetch admin users
  const { data: users, isLoading: usersLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/users'],
    enabled: !!(user as any)?.isAdmin,
  });

  // Fetch admin stats
  const { data: adminStats, isLoading: statsLoading } = useQuery<{
    totalUsers: number;
    totalReferrals: number;
    pendingReferrals: number;
    totalCommissions: number;
    recentActivity: any[];
    conversionRate: number;
    monthlyGrowth: number;
  }>({
    queryKey: ['/api/admin/stats'],
    enabled: !!(user as any)?.isAdmin,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch pending signups
  const { data: signups, isLoading: signupsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/signups'],
    enabled: !!(user as any)?.isAdmin,
  });

  // Fetch completed deals
  const { data: completedDeals, isLoading: completedDealsLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/completed-deals'],
    enabled: !!(user as any)?.isAdmin,
  });

  // Fetch all messages for admin
  const { data: allMessages, isLoading: messagesLoading } = useQuery<any[]>({
    queryKey: ['/api/admin/messages'],
    enabled: !!(user as any)?.isAdmin,
  });

  // Calculate notification counts for tabs
  const getNotificationCounts = () => {
    const counts = {
      submissions: 0,
      signups: 0,
      pipeline: 0,
      completedDeals: 0,
      messages: 0,
    };

    // Count submissions that need review (new or quote_requested status)
    if (dealsData?.deals) {
      counts.submissions = dealsData.deals.filter(
        (r: any) => r.status === 'submitted'
      ).length;
    }

    // Count signups that need action (awaiting_signup or agreement_sent)
    if (signups) {
      counts.signups = signups.filter((s: any) => 
        s.customerJourneyStatus === 'awaiting_signup' || s.customerJourneyStatus === 'agreement_sent'
      ).length;
      
      // Count other pipeline stages that need action
      counts.pipeline = signups.filter((s: any) => {
        // All stages except signups
        const status = s.customerJourneyStatus;
        if (status === 'awaiting_signup' || status === 'agreement_sent') return false;
        // Other stages that might need attention
        if (status === 'docs_out' || status === 'awaiting_docs' || status === 'docs_received') return true;
        if (status === 'approved' && !s.commissionPaid) return true;
        return false;
      }).length;
    }

    // Completed deals don't need action, so count is 0
    counts.completedDeals = 0;

    // Count unread partner messages (where authorType = 'partner')
    if (allMessages) {
      counts.messages = allMessages.filter((m: any) => m.authorType === 'partner').length;
    }

    return counts;
  };

  const notificationCounts = getNotificationCounts();

  // Quote form
  const quoteForm = useForm<z.infer<typeof quoteFormSchema>>({
    resolver: zodResolver(quoteFormSchema),
    defaultValues: {
      totalAmount: "",
      cardRate: "1.5",
      businessFundingRate: "",
      adminNotes: "",
      validUntil: "",
    },
  });

  // Document requirements form
  const documentForm = useForm<z.infer<typeof documentRequirementsSchema>>({
    resolver: zodResolver(documentRequirementsSchema),
    defaultValues: {
      requiredDocuments: [],
      notes: "",
    },
  });

  // Stage form
  const stageForm = useForm<z.infer<typeof stageFormSchema>>({
    resolver: zodResolver(stageFormSchema),
    defaultValues: {
      stage: "",
      notes: "",
    },
  });

  // Stage override form
  const stageOverrideForm = useForm<z.infer<typeof stageOverrideSchema>>({
    resolver: zodResolver(stageOverrideSchema),
    defaultValues: {
      dealStage: "",
      status: "",
      overrideReason: "",
      adminNotes: "",
    },
  });

  // Confirm payment form
  const confirmPaymentForm = useForm<z.infer<typeof confirmPaymentSchema>>({
    resolver: zodResolver(confirmPaymentSchema),
    defaultValues: {
      actualCommission: "",
      paymentReference: "",
      paymentMethod: "Bank Transfer",
      paymentNotes: "",
    },
  });

  // Send quote mutation
  const sendQuoteMutation = useMutation({
    mutationFn: async (data: { dealId: string; quoteData: any }) => {
      const response = await fetch(`/api/admin/deals/${data.dealId}/send-quote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.quoteData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
      setShowQuoteModal(false);
      quoteForm.reset();
    },
  });

  // Update document requirements mutation
  const updateDocumentsMutation = useMutation({
    mutationFn: async (data: { dealId: string; documentsData: any }) => {
      const response = await fetch(`/api/admin/deals/${data.dealId}/document-requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.documentsData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
      setShowDocumentsModal(false);
      documentForm.reset();
    },
  });

  // Update stage mutation
  const updateStageMutation = useMutation({
    mutationFn: async (data: { dealId: string; stageData: z.infer<typeof stageFormSchema> }) => {
      const response = await fetch(`/api/admin/deals/${data.dealId}/update-stage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.stageData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
      setShowStageModal(false);
      stageForm.reset();
    },
  });

  // Stage override mutation
  const stageOverrideMutation = useMutation({
    mutationFn: async (data: { dealId: string; overrideData: any }) => {
      const response = await fetch(`/api/admin/deals/${data.dealId}/override-stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.overrideData),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
      setShowStageOverrideModal(false);
      stageOverrideForm.reset();
    },
  });

  // Preview commission distribution
  const previewCommissionMutation = useMutation({
    mutationFn: async (data: { dealId: string; actualCommission: string }) => {
      const response = await fetch(`/api/admin/deals/${data.dealId}/preview-commission`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actualCommission: data.actualCommission }),
      });
      return response.json();
    },
    onSuccess: (data) => {
      setCommissionPreview(data);
      setPaymentStep('preview');
    },
  });

  // Confirm payment mutation
  const confirmPaymentMutation = useMutation({
    mutationFn: async (data: { dealId: string; paymentData: any }) => {
      const response = await fetch(`/api/admin/deals/${data.dealId}/confirm-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.paymentData),
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
      setShowConfirmPaymentModal(false);
      setPaymentStep('input');
      setCommissionPreview(null);
      confirmPaymentForm.reset();
      
      // Show breakdown of commission distribution
      if (data.paymentDetails?.distributionBreakdown) {
        const breakdown = data.paymentDetails.distributionBreakdown;
        console.log(`✅ Commission distributed to ${breakdown.length} people:`, breakdown);
      }
    },
  });

  // Seed test data mutation
  const seedTestDataMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/admin/seed-test-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
      setSeedingTestData(false);
    },
    onError: () => {
      setSeedingTestData(false);
    },
  });

  // Docs out confirmation mutation
  const docsOutMutation = useMutation({
    mutationFn: async (dealId: string) => {
      const response = await fetch(`/api/admin/deals/${dealId}/docs-out-confirmation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentsSent: ['agreement', 'terms'],
          recipientEmail: selectedReferral?.businessEmail || '',
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
    },
  });

  // User search function
  const searchUsers = async (query: string) => {
    if (!query || query.length < 2) {
      setSearchedUsers([]);
      return;
    }
    const response = await fetch(`/api/admin/users/search?query=${encodeURIComponent(query)}`);
    const data = await response.json();
    setSearchedUsers(data);
  };

  // Impersonate user mutation
  const impersonateMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await apiRequest('POST', `/api/admin/impersonate/${userId}`);
      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidate auth cache
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Show toast notification
      toast({
        title: "Impersonation Active",
        description: data.message || "You are now viewing as another user",
      });
      
      // Redirect to dashboard after a brief delay to ensure session is updated
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 300);
    },
    onError: (error: any) => {
      toast({
        title: "Impersonation Failed",
        description: error.message || "Failed to impersonate user",
        variant: "destructive",
      });
    },
  });

  // Signup Docs Out confirmation mutation
  const signupDocsOutMutation = useMutation({
    mutationFn: async (data: { quoteId: string; notes: string }) => {
      // Post message to quote Q&A system
      const message = `📄 **Documents Sent**\n\nAgreement and terms have been sent to the client.\n\n${data.notes ? `**Notes:** ${data.notes}` : ''}`;
      
      await fetch(`/api/quotes/${data.quoteId}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      // Update journey status
      const response = await fetch(`/api/admin/signups/${data.quoteId}/docs-out`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationNotes: data.notes,
          requiredDocuments: ['identification', 'proof_of_bank']
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setShowDocsOutDialog(false);
      setDocsOutNotes("");
      setSelectedSignupForDocs(null);
    },
  });

  // Signup Awaiting Docs mutation
  const signupAwaitingDocsMutation = useMutation({
    mutationFn: async (data: { quoteId: string; notes: string; documents: string[] }) => {
      // Build document list message
      const docLabels: Record<string, string> = {
        identification: 'ID (Passport/Driving License)',
        proof_of_bank: 'Proof of Bank Account',
        business_registration: 'Business Registration',
        vat_certificate: 'VAT Certificate',
        proof_of_address: 'Proof of Address',
        other: 'Other Documents'
      };
      
      const docList = data.documents.map(doc => `• ${docLabels[doc] || doc}`).join('\n');
      const message = `📋 **Documents Required**\n\nPlease provide the following documents:\n\n${docList}\n\n${data.notes ? `**Additional Notes:** ${data.notes}` : ''}`;
      
      // Post message to quote Q&A system
      await fetch(`/api/quotes/${data.quoteId}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      
      // Update journey status
      const response = await fetch(`/api/admin/signups/${data.quoteId}/awaiting-docs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          communicationNotes: data.notes,
          requiredDocuments: data.documents
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setShowAwaitingDocsDialog(false);
      setAwaitingDocsNotes("");
      setSelectedDocuments([]);
      setSelectedSignupForDocs(null);
    },
  });

  // Signup Docs In mutation
  const signupDocsInMutation = useMutation({
    mutationFn: async (data: { quoteId: string; notes: string; receivedDocuments: string[]; outstandingDocuments: string[] }) => {
      const response = await fetch(`/api/admin/signups/${data.quoteId}/docs-in`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: data.notes,
          receivedDocuments: data.receivedDocuments,
          outstandingDocuments: data.outstandingDocuments
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setShowDocsInDialog(false);
      setDocsInNotes("");
      setReceivedDocuments([]);
      setOutstandingDocuments([]);
      setSelectedSignupForDocs(null);
    },
  });

  // Final decision mutation (approve/decline)
  const finalDecisionMutation = useMutation({
    mutationFn: async (data: { quoteId: string; decision: 'approved' | 'declined'; notes: string; actualCommission?: string }) => {
      const response = await fetch(`/api/admin/signups/${data.quoteId}/final-decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision: data.decision,
          notes: data.notes,
          actualCommission: data.actualCommission
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setShowDecisionDialog(false);
      setDecisionNotes("");
      setDecisionCommission("");
      setSelectedSignupForDocs(null);
    },
  });

  // Cancel quote mutation
  const cancelQuoteMutation = useMutation({
    mutationFn: async (data: { quoteId: string; reason: string }) => {
      const response = await fetch(`/api/quotes/${selectedQuoteToCancel.id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: data.reason }),
      });
      if (!response.ok) throw new Error('Failed to cancel quote');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/quotes'] });
      setShowCancelQuoteDialog(false);
      setCancelReason("");
      setCustomCancelReason("");
      setSelectedQuoteToCancel(null);
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'quote_sent': return 'bg-blue-100 text-blue-800';
      case 'quote_approved': return 'bg-green-100 text-green-800';
      case 'docs_out_confirmation': return 'bg-orange-100 text-orange-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const availableDocuments = [
    'identification',
    'proof_of_bank',
    'business_registration',
    'vat_certificate',
    'proof_of_address',
  ];

  const dealStages = [
    { value: 'quote_request_received', label: 'Quote Request Received' },
    { value: 'quote_sent', label: 'Quote Sent' },
    { value: 'quote_approved', label: 'Quote Approved' },
    { value: 'docs_out_confirmation', label: 'Docs Out Confirmation' },
    { value: 'docs_received', label: 'Documents Received' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SideNavigation />
      <div className="lg:ml-16">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2" data-testid="page-title-admin">
              Admin Dashboard
            </h1>
            <p className="text-gray-600" data-testid="text-admin-description">
              Comprehensive deal management and backend administration
            </p>
          </div>

          {/* Main Section Tabs */}
          <Tabs defaultValue="deals" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-8 h-auto bg-white shadow-md rounded-xl">
              <TabsTrigger 
                value="deals" 
                data-testid="tab-deals-section"
                className="flex-col h-auto py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 data-[state=active]:shadow-lg rounded-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-base font-bold">Deals & User Requirements</span>
                </div>
                <span className="text-xs text-gray-600">Submissions, Signups, Messages & Completed Deals</span>
                {(notificationCounts.submissions + notificationCounts.signups + notificationCounts.pipeline + notificationCounts.messages + notificationCounts.completedDeals) > 0 && (
                  <Badge className="mt-2 bg-red-500 text-white" variant="secondary">
                    {notificationCounts.submissions + notificationCounts.signups + notificationCounts.pipeline + notificationCounts.messages + notificationCounts.completedDeals}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger 
                value="payments" 
                data-testid="tab-payments-section"
                className="flex-col h-auto py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-green-50 data-[state=active]:to-emerald-50 data-[state=active]:shadow-lg rounded-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="h-5 w-5" />
                  <span className="text-base font-bold">Payments</span>
                </div>
                <span className="text-xs text-gray-600">Commission Payments & MLM Distribution</span>
              </TabsTrigger>
              <TabsTrigger 
                value="invoices" 
                data-testid="tab-invoices-section"
                className="flex-col h-auto py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-yellow-50 data-[state=active]:to-orange-50 data-[state=active]:shadow-lg rounded-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="h-5 w-5" />
                  <span className="text-base font-bold">Invoices</span>
                </div>
                <span className="text-xs text-gray-600">Partner Invoice Management</span>
              </TabsTrigger>
              <TabsTrigger 
                value="backend" 
                data-testid="tab-backend-section"
                className="flex-col h-auto py-4 px-6 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-50 data-[state=active]:to-pink-50 data-[state=active]:shadow-lg rounded-xl"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Database className="h-5 w-5" />
                  <span className="text-base font-bold">Backend Management</span>
                </div>
                <span className="text-xs text-gray-600">MLM Network, Analytics, Users & Settings</span>
              </TabsTrigger>
            </TabsList>

            {/* Deals & User Requirements Section */}
            <TabsContent value="deals">
              {/* Submenu for Deals Section */}
              <Tabs defaultValue="submissions" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
                  <TabsTrigger 
                    value="submissions" 
                    data-testid="tab-submissions-submenu"
                    className="flex items-center gap-2 h-auto py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <FileText className="h-4 w-4" />
                    <span className="text-sm font-medium">Quote Requests</span>
                    {notificationCounts.submissions > 0 && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs">{notificationCounts.submissions}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="signups" 
                    data-testid="tab-signups-submenu"
                    className="flex items-center gap-2 h-auto py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Sign Up</span>
                    {notificationCounts.signups > 0 && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs">{notificationCounts.signups}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pipeline" 
                    data-testid="tab-pipeline-submenu"
                    className="flex items-center gap-2 h-auto py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Deal Management</span>
                    {notificationCounts.pipeline > 0 && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs">{notificationCounts.pipeline}</Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger 
                    value="messages" 
                    data-testid="tab-messages-submenu"
                    className="flex items-center gap-2 h-auto py-3 px-4 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Messages</span>
                    {notificationCounts.messages > 0 && (
                      <Badge className="ml-1 bg-blue-500 text-white text-xs">{notificationCounts.messages}</Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                {/* Quote Requests Tab - Only shows submitted (new) requests */}
                <TabsContent value="submissions">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 border-l-4 border-l-orange-500">
                  <CardHeader className="bg-gradient-to-r from-orange-100/50 to-amber-100/50">
                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <AlertCircle className="w-6 h-6 text-orange-600" />
                      New Quote Requests ({dealsData?.deals?.filter((r: any) => r.status === 'submitted').length || 0})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    {dealsData?.deals && dealsData.deals.filter((r: any) => r.status === 'submitted').length > 0 ? (
                      <div className="space-y-1">
                        {dealsData.deals
                          .filter((r: any) => r.status === 'submitted')
                          .map((deals: any, index: number, arr: any[]) => (
                            <div
                              key={deals.id}
                              className={`p-6 hover:bg-white/80 transition-all duration-200 ${
                                index !== arr.length - 1 ? 'border-b border-orange-200' : ''
                              }`}
                            >
                              <div className="flex justify-between items-start gap-6">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-4">
                                    <h3 className="font-bold text-xl text-gray-900">{deals.businessName}</h3>
                                    <Badge className="bg-orange-100 text-orange-800 border-0 font-medium px-3 py-1">
                                      NEW REQUEST
                                    </Badge>
                                    {deals.gdprConsent && (
                                      <Badge className="bg-green-100 text-green-800 border-0 font-medium px-3 py-1">
                                        GDPR ✓
                                      </Badge>
                                    )}
                                  </div>
                                  
                                  {/* Contact Information */}
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                    <div className="flex items-start gap-2 text-gray-700">
                                      <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium">Email</p>
                                        <p className="text-sm">{deals.businessEmail}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-700">
                                      <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium">Phone</p>
                                        <p className="text-sm">{deals.businessPhone || 'Not provided'}</p>
                                      </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-gray-700">
                                      <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      <div>
                                        <p className="text-xs text-gray-500 font-medium">Submitted</p>
                                        <p className="text-sm">
                                          {new Date(deals.submittedAt).toLocaleDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Business Details */}
                                  {(deals.businessAddress || deals.businessTypeName) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-3 bg-white/60 rounded-lg">
                                      {deals.businessAddress && (
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium mb-1">Business Address</p>
                                          <p className="text-sm text-gray-700">{deals.businessAddress}</p>
                                        </div>
                                      )}
                                      {deals.businessTypeName && (
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium mb-1">Business Type</p>
                                          <p className="text-sm text-gray-700">{deals.businessTypeName}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Monthly Volume Information */}
                                  {deals.monthlyVolume && (
                                    <div className="mb-4 p-3 bg-blue-50/60 rounded-lg border-l-4 border-blue-400">
                                      <p className="text-xs text-gray-500 font-medium mb-1">Monthly Card Volume</p>
                                      <p className="text-lg text-blue-700 font-bold">£{parseInt(deals.monthlyVolume || '0').toLocaleString()}</p>
                                    </div>
                                  )}

                                  {/* Products and Services */}
                                  {(deals.selectedProducts?.length > 0 || deals.cardMachineQuantity || deals.fundingAmount) && (
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-3 bg-purple-50/60 rounded-lg">
                                      {deals.selectedProducts?.length > 0 && (
                                        <div className="md:col-span-2">
                                          <p className="text-xs text-gray-500 font-medium mb-1">Selected Products</p>
                                          <div className="flex flex-wrap gap-2">
                                            {deals.selectedProducts.map((product: string, idx: number) => (
                                              <Badge key={idx} className="bg-purple-100 text-purple-800 border-0">
                                                {product}
                                              </Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {deals.cardMachineQuantity && (
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium mb-1">Card Machines</p>
                                          <p className="text-sm text-gray-700 font-semibold">{deals.cardMachineQuantity}</p>
                                        </div>
                                      )}
                                      {deals.cardMachineProvider && (
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium mb-1">Current Card Machine Provider</p>
                                          <p className="text-sm text-gray-700 font-semibold">{deals.cardMachineProvider}</p>
                                        </div>
                                      )}
                                      {deals.fundingAmount && (
                                        <div>
                                          <p className="text-xs text-gray-500 font-medium mb-1">Funding Amount</p>
                                          <p className="text-sm text-gray-700 font-semibold">£{deals.fundingAmount}</p>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {/* Partner Notes */}
                                  {deals.notes && (
                                    <div className="mt-3 p-3 bg-amber-50/60 border-l-4 border-amber-400 rounded">
                                      <p className="text-xs text-gray-500 font-medium mb-1">Partner Notes</p>
                                      <p className="text-sm text-gray-700">{deals.notes}</p>
                                    </div>
                                  )}

                                  {/* Uploaded Documents Section */}
                                  <ReferralDocumentsDisplay businessName={deals.businessName} />

                                  {/* Partner Information */}
                                  {(deals.partnerName || deals.partnerEmail) && (
                                    <div className="mt-3 p-3 bg-teal-50/60 border-l-4 border-teal-400 rounded">
                                      <p className="text-xs text-gray-500 font-medium mb-1">Referred By</p>
                                      <p className="text-sm text-gray-700">
                                        {deals.partnerName} {deals.partnerEmail && `(${deals.partnerEmail})`}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex-shrink-0">
                                  <Button
                                    size="lg"
                                    onClick={() => {
                                      setSelectedReferral(deals);
                                      setShowQuoteModal(true);
                                    }}
                                    className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg whitespace-nowrap"
                                    data-testid={`button-create-quote-${deals.id}`}
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Quote
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-16 px-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <CheckCircle className="w-10 h-10 text-orange-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">All Caught Up!</h3>
                        <p className="text-gray-600">No new quote requests at the moment.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
                </TabsContent>

                {/* Sign Up Tab - Shows deals awaiting signup or with agreement sent */}
                <TabsContent value="signups">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 border-l-4 border-l-green-500">
                    <CardHeader className="bg-gradient-to-r from-green-100/50 to-emerald-100/50">
                      <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <User className="w-6 h-6 text-green-600" />
                        Sign Up - Ready for Documents ({signups?.filter((s: any) => s.customerJourneyStatus === 'awaiting_signup' || s.customerJourneyStatus === 'agreement_sent').length || 0})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      {signupsLoading ? (
                        <div className="text-center py-16 px-6">
                          <div className="animate-spin w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto"></div>
                          <p className="mt-4 text-gray-600">Loading signups...</p>
                        </div>
                      ) : signups?.filter((s: any) => s.customerJourneyStatus === 'awaiting_signup' || s.customerJourneyStatus === 'agreement_sent').length > 0 ? (
                        <div className="space-y-1">
                          {signups
                            .filter((s: any) => s.customerJourneyStatus === 'awaiting_signup' || s.customerJourneyStatus === 'agreement_sent')
                            .map((signup: any, index: number, arr: any[]) => (
                              <div
                                key={signup.quoteId}
                                className={`p-6 hover:bg-white/80 transition-all duration-200 ${
                                  index !== arr.length - 1 ? 'border-b border-green-200' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start gap-6">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-4">
                                      <h3 className="font-bold text-xl text-gray-900">{signup.businessName}</h3>
                                      <Badge className="bg-green-100 text-green-800 border-0 font-medium px-3 py-1">
                                        {signup.customerJourneyStatus === 'agreement_sent' ? 'AGREEMENT SENT' : 'AWAITING SIGNUP'}
                                      </Badge>
                                    </div>
                                    
                                    {/* Business Details */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                                      <div className="space-y-2">
                                        <p className="text-xs text-gray-500 font-medium">Business Email</p>
                                        <p className="text-sm text-gray-700">{signup.businessEmail}</p>
                                      </div>
                                      {signup.ownerFirstName && (
                                        <div className="space-y-2">
                                          <p className="text-xs text-gray-500 font-medium">Owner</p>
                                          <p className="text-sm text-gray-700">{signup.ownerFirstName} {signup.ownerLastName}</p>
                                        </div>
                                      )}
                                      {signup.estimatedCommission && (
                                        <div className="space-y-2">
                                          <p className="text-xs text-gray-500 font-medium">Est. Commission</p>
                                          <p className="text-sm font-bold text-green-600">£{parseFloat(signup.estimatedCommission).toFixed(2)}</p>
                                        </div>
                                      )}
                                    </div>

                                    {/* Partner Info */}
                                    <div className="mt-3 p-3 bg-green-50/60 border-l-4 border-green-400 rounded">
                                      <p className="text-xs text-gray-500 font-medium mb-1">Referred By</p>
                                      <p className="text-sm text-gray-700">{signup.partnerName} ({signup.partnerEmail})</p>
                                    </div>
                                  </div>
                                  
                                  <div className="flex-shrink-0">
                                    <Button
                                      size="lg"
                                      onClick={() => {
                                        setSelectedSignupForDocs(signup);
                                        setShowDocsOutDialog(true);
                                      }}
                                      className="bg-green-600 hover:bg-green-700 text-white shadow-lg whitespace-nowrap"
                                      data-testid={`button-docs-out-${signup.quoteId}`}
                                    >
                                      <Send className="w-4 h-4 mr-2" />
                                      Send Docs Out
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="text-center py-16 px-6">
                          <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-600" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">All Clear!</h3>
                          <p className="text-gray-600">No signups waiting for documents at the moment.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Deal Management Pipeline Tab - Shows quote sent and beyond */}
                <TabsContent value="pipeline">
                  <Card className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Deal Management Pipeline
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AdminSignupsTabs
                        signupsLoading={signupsLoading}
                        signups={signups}
                        dealsData={dealsData}
                        signupSubTab={signupSubTab}
                        setSignupSubTab={setSignupSubTab}
                        setSelectedSignupForDocs={setSelectedSignupForDocs}
                        setShowDocsOutDialog={setShowDocsOutDialog}
                        setShowAwaitingDocsDialog={setShowAwaitingDocsDialog}
                        setShowDocsInDialog={setShowDocsInDialog}
                        setReceivedDocuments={setReceivedDocuments}
                        setShowDecisionDialog={setShowDecisionDialog}
                        setDecision={setDecision}
                        setDecisionCommission={setDecisionCommission}
                        setShowQuoteModal={setShowQuoteModal}
                        setSelectedReferral={setSelectedReferral}
                        setShowCancelQuoteDialog={setShowCancelQuoteDialog}
                        setSelectedQuoteToCancel={setSelectedQuoteToCancel}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Messages Tab */}
                <TabsContent value="messages">
                  <div className="lg:col-span-1">
                  <Card className="border-0 shadow-lg sticky top-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center justify-between text-lg">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-600" />
                          <span>Messages</span>
                        </div>
                        {notificationCounts.messages > 0 && (
                          <Badge className="bg-blue-500 text-white">
                            {notificationCounts.messages}
                          </Badge>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[800px] overflow-y-auto">
                      {messagesLoading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin w-6 h-6 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
                          <p className="mt-3 text-sm text-gray-600">Loading...</p>
                        </div>
                      ) : !allMessages || allMessages.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <MessageSquare className="w-10 h-10 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm">No messages yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {allMessages.map((message: any) => (
                            <Card key={message.id} className={`border ${message.authorType === 'partner' ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'}`}>
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-start gap-2">
                                    <div className={`rounded-full p-2 ${message.authorType === 'partner' ? 'bg-blue-600' : 'bg-gray-600'}`}>
                                      <User className="h-3 w-3 text-white" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-semibold text-sm truncate">
                                          {message.authorType === 'admin' ? 'Admin' : message.authorName || 'Partner'}
                                        </h3>
                                        {message.authorType === 'partner' && (
                                          <Badge className="bg-blue-600 text-xs">New</Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-600 truncate">
                                        {message.quoteId}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(message.createdAt).toLocaleDateString()}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="bg-white rounded p-2 border border-gray-200">
                                    <p className="text-xs text-gray-900 line-clamp-3">{message.message}</p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full text-xs h-8"
                                    onClick={() => {
                                      window.location.href = `/quotes#${message.quoteId}`;
                                    }}
                                    data-testid={`button-view-quote-${message.id}`}
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Payments Section */}
            <TabsContent value="payments">
              <AdminPaymentsPortal />
            </TabsContent>

            {/* Invoices Section */}
            <TabsContent value="invoices">
              <AdminInvoicesView />
            </TabsContent>

            {/* Backend Management Section */}
            <TabsContent value="backend">
              <Tabs defaultValue="users" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 h-auto">
                  <TabsTrigger 
                    value="users" 
                    data-testid="tab-users" 
                    className="flex-col h-auto py-3 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <Users className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">User Management</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="mlm" 
                    data-testid="tab-mlm" 
                    className="flex-col h-auto py-3 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <Target className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">MLM Network</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="analytics" 
                    data-testid="tab-analytics" 
                    className="flex-col h-auto py-3 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <TrendingUp className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="settings" 
                    data-testid="tab-settings" 
                    className="flex-col h-auto py-3 px-2 data-[state=active]:bg-white data-[state=active]:shadow-md"
                  >
                    <Settings className="h-5 w-5 mb-1" />
                    <span className="text-xs font-medium">Settings</span>
                  </TabsTrigger>
                </TabsList>

                {/* User Management Tab */}
                <TabsContent value="users">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-blue-600" />
                    User Management & Impersonation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* User Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        placeholder="Search users by name, email, or partner ID..."
                        value={userSearchTerm}
                        onChange={(e) => {
                          setUserSearchTerm(e.target.value);
                          searchUsers(e.target.value);
                        }}
                        className="pl-12 h-12 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                        data-testid="input-search-users"
                      />
                    </div>
                    {userSearchTerm.length > 0 && userSearchTerm.length < 2 && (
                      <p className="text-sm text-gray-500 mt-2">Type at least 2 characters to search...</p>
                    )}
                  </div>

                  {/* Search Results or All Users */}
                  {usersLoading ? (
                    <div className="space-y-4">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="animate-pulse border rounded-lg p-4">
                          <div className="flex justify-between items-center">
                            <div className="space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-48"></div>
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-20"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userSearchTerm.length >= 2 && (
                        <p className="text-sm text-gray-600 mb-3">
                          Found {searchedUsers.length} user{searchedUsers.length !== 1 ? 's' : ''}
                        </p>
                      )}
                      {userSearchTerm.length === 0 && users && users.length > 0 && (
                        <p className="text-sm text-gray-600 mb-3">
                          Showing all {users.length} user{users.length !== 1 ? 's' : ''}
                        </p>
                      )}
                      {(userSearchTerm.length >= 2 ? searchedUsers : users || []).map((user: any) => (
                        <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50" data-testid={`user-card-${user.id}`}>
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h3 className="font-semibold" data-testid={`text-user-name-${user.id}`}>
                                {user.firstName} {user.lastName}
                              </h3>
                              <p className="text-sm text-gray-600" data-testid={`text-user-email-${user.id}`}>
                                {user.email}
                              </p>
                              <p className="text-xs text-gray-500">
                                Partner ID: {user.partnerId || 'Not assigned'}
                              </p>
                              {user.dealsCode && (
                                <p className="text-xs text-gray-500">
                                  Referral Code: {user.dealsCode}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {user.isAdmin && (
                                <Badge className="bg-red-100 text-red-800">Admin</Badge>
                              )}
                              <Badge className="bg-blue-100 text-blue-800">
                                Level {user.partnerLevel || 1}
                              </Badge>
                              <Button
                                onClick={() => {
                                  if (confirm(`View account as ${user.firstName} ${user.lastName}? You'll be able to see and modify their account.`)) {
                                    impersonateMutation.mutate(user.id);
                                  }
                                }}
                                disabled={impersonateMutation.isPending}
                                variant="outline"
                                size="sm"
                                className="ml-2"
                                data-testid={`button-view-as-user-${user.id}`}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View In Their Account
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {userSearchTerm.length >= 2 && searchedUsers.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No users found matching "{userSearchTerm}"</p>
                      )}
                      {userSearchTerm.length === 0 && (!users || users.length === 0) && (
                        <div className="text-center text-gray-500 py-8">
                          <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                          <p className="text-lg font-medium">No Users Yet</p>
                          <p className="text-sm">Users will appear here once they sign up</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mlm">
              <MlmVisualization userId={(user as any)?.id} showFullTree={true} />
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-6">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-blue-600">Total Users</p>
                          <p className="text-3xl font-bold text-blue-900">{adminStats?.totalUsers || 0}</p>
                          <p className="text-xs text-blue-600 mt-1">Active partners</p>
                        </div>
                        <Users className="w-10 h-10 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-600">Total Deals</p>
                          <p className="text-3xl font-bold text-green-900">{adminStats?.totalReferrals || 0}</p>
                          <p className="text-xs text-green-600 mt-1">All time deals</p>
                        </div>
                        <FileBarChart className="w-10 h-10 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-purple-600">Total Commissions</p>
                          <p className="text-3xl font-bold text-purple-900">£{adminStats?.totalCommissions ? Number(adminStats.totalCommissions).toFixed(2) : '0.00'}</p>
                          <p className="text-xs text-purple-600 mt-1">Lifetime earnings</p>
                        </div>
                        <DollarSign className="w-10 h-10 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-orange-600">Conversion Rate</p>
                          <p className="text-3xl font-bold text-orange-900">{adminStats?.conversionRate || 0}%</p>
                          <p className="text-xs text-orange-600 mt-1">Quote to deal</p>
                        </div>
                        <TrendingUp className="w-10 h-10 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Commission Structure Display */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Target className="w-6 h-6 text-blue-600" />
                      MLM Commission Structure
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <h3 className="font-bold text-green-900 mb-2">Direct Sales (L1)</h3>
                        <p className="text-3xl font-bold text-green-700">60%</p>
                        <p className="text-sm text-green-600 mt-1">Commission on direct deals</p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h3 className="font-bold text-blue-900 mb-2">Level 2 Team</h3>
                        <p className="text-3xl font-bold text-blue-700">20%</p>
                        <p className="text-sm text-blue-600 mt-1">Override on team sales</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <h3 className="font-bold text-purple-900 mb-2">Extended Network (L3)</h3>
                        <p className="text-3xl font-bold text-purple-700">10%</p>
                        <p className="text-sm text-purple-600 mt-1">Network override commission</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Activity className="w-6 h-6 text-blue-600" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {adminStats?.recentActivity?.length > 0 ? (
                      <div className="space-y-3">
                        {adminStats.recentActivity.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{activity.description}</p>
                              <p className="text-xs text-gray-500">{activity.timestamp}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No recent activity</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-6">
                {/* Export Data Section */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Database className="w-6 h-6 text-blue-600" />
                      Data Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={async () => {
                          const response = await fetch('/api/admin/export/users');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
                          a.click();
                        }}
                        data-testid="button-export-users"
                      >
                        <Users className="w-6 h-6" />
                        <span>Export Users CSV</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={async () => {
                          const response = await fetch('/api/admin/export/deals');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `deals-export-${new Date().toISOString().split('T')[0]}.csv`;
                          a.click();
                        }}
                        data-testid="button-export-deals"
                      >
                        <FileText className="w-6 h-6" />
                        <span>Export Referrals CSV</span>
                      </Button>

                      <Button
                        variant="outline"
                        className="h-20 flex flex-col items-center justify-center gap-2"
                        onClick={async () => {
                          const response = await fetch('/api/admin/export/payments');
                          const blob = await response.blob();
                          const url = window.URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = `payments-export-${new Date().toISOString().split('T')[0]}.csv`;
                          a.click();
                        }}
                        data-testid="button-export-payments"
                      >
                        <DollarSign className="w-6 h-6" />
                        <span>Export Payments CSV</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* System Settings */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Settings className="w-6 h-6 text-blue-600" />
                      System Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Seed Test Data</h3>
                        <p className="text-sm text-gray-600">Generate sample deals for testing</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setSeedingTestData(true);
                          seedTestDataMutation.mutate();
                        }}
                        disabled={seedingTestData}
                        data-testid="button-seed-data"
                      >
                        {seedingTestData ? 'Seeding...' : 'Seed Data'}
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Stripe Integration</h3>
                        <p className="text-sm text-gray-600">Payment processing for commissions</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h3 className="font-medium">Go High Level Integration</h3>
                        <p className="text-sm text-gray-600">CRM synchronization</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">Pending Setup</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Shield className="w-6 h-6 text-blue-600" />
                      Admin Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      variant="default"
                      className="w-full"
                      onClick={() => {
                        queryClient.invalidateQueries();
                        setRefreshing(true);
                        setTimeout(() => setRefreshing(false), 1000);
                      }}
                      disabled={refreshing}
                      data-testid="button-refresh-all"
                    >
                      <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      {refreshing ? 'Refreshing...' : 'Refresh All Data'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
              </Tabs>
            </TabsContent>
          </Tabs>
        </div>

        {/* Dialogs moved outside tab structure */}
        <Dialog open={showQuoteModal} onOpenChange={setShowQuoteModal}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" data-testid="modal-quote-builder">
            {selectedReferral && (
              <QuoteBuilder
                dealId={selectedReferral.id}
                businessName={selectedReferral.businessName}
                onQuoteCreated={(quoteId) => {
                  setShowQuoteModal(false);
                  queryClient.invalidateQueries({ queryKey: ['/api/admin/deals'] });
                }}
                onCancel={() => setShowQuoteModal(false)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Document Requirements Modal */}
        <Dialog open={showDocumentsModal} onOpenChange={setShowDocumentsModal}>
          <DialogContent className="sm:max-w-[500px]" data-testid="modal-document-requirements">
            <DialogHeader>
              <DialogTitle>Document Requirements - {selectedReferral?.businessName}</DialogTitle>
            </DialogHeader>
            <Form {...documentForm}>
              <form onSubmit={documentForm.handleSubmit((data) => {
                updateDocumentsMutation.mutate({
                  dealId: selectedReferral.id,
                  documentsData: data
                });
              })} className="space-y-4">
                <FormField
                  control={documentForm.control}
                  name="requiredDocuments"
                  render={() => (
                    <FormItem>
                      <FormLabel>Required Documents</FormLabel>
                      <div className="space-y-2">
                        {availableDocuments.map((doc) => (
                          <FormField
                            key={doc}
                            control={documentForm.control}
                            name="requiredDocuments"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={doc}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(doc)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value, doc])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== doc
                                              )
                                            )
                                      }}
                                      data-testid={`checkbox-document-${doc}`}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal capitalize">
                                    {doc.replace('_', ' ')}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={documentForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Any additional document requirements or notes..."
                          data-testid="textarea-document-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDocumentsModal(false)}
                    data-testid="button-cancel-documents"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateDocumentsMutation.isPending}
                    data-testid="button-update-documents"
                  >
                    {updateDocumentsMutation.isPending ? 'Updating...' : 'Update Requirements'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Stage Update Modal */}
        <Dialog open={showStageModal} onOpenChange={setShowStageModal}>
          <DialogContent className="sm:max-w-[500px]" data-testid="modal-edit-stage">
            <DialogHeader>
              <DialogTitle>Edit Deal Stage - {selectedReferral?.businessName}</DialogTitle>
            </DialogHeader>
            <Form {...stageForm}>
              <form onSubmit={stageForm.handleSubmit((data) => {
                updateStageMutation.mutate({
                  dealId: selectedReferral.id,
                  stageData: data
                });
              })} className="space-y-4">
                <FormField
                  control={stageForm.control}
                  name="stage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deal Stage</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-deal-stage">
                            <SelectValue placeholder="Select a stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {dealStages.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={stageForm.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stage Change Notes</FormLabel>
                      <FormControl>
                        <Textarea 
                          {...field} 
                          placeholder="Reason for stage change or additional notes..."
                          data-testid="textarea-stage-notes"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowStageModal(false)}
                    data-testid="button-cancel-stage"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={updateStageMutation.isPending}
                    data-testid="button-update-stage"
                  >
                    {updateStageMutation.isPending ? 'Updating...' : 'Update Stage'}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Commission Payment Modal - Two Step Confirmation */}
        <Dialog open={showCommissionModal} onOpenChange={(open) => {
          if (!open) {
            setShowCommissionModal(false);
            setCommissionStep('review');
            setSelectedSignup(null);
          }
        }}>
          <DialogContent className="sm:max-w-[600px]" data-testid="modal-commission-payment">
            <DialogHeader>
              <DialogTitle>
                {commissionStep === 'review' ? 'Review Commission Payment' : 'Confirm Payment'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedSignup && (
              <div className="space-y-6">
                {commissionStep === 'review' ? (
                  <>
                    {/* Step 1: Review */}
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <h3 className="font-semibold text-lg">Payment Details</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Business:</span>
                          <span className="font-medium">{selectedSignup.businessName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Partner:</span>
                          <span className="font-medium">{selectedSignup.partnerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Partner Email:</span>
                          <span className="font-medium">{selectedSignup.partnerEmail}</span>
                        </div>
                        <div className="flex justify-between pt-3 border-t">
                          <span className="text-gray-900 font-semibold">Commission Amount:</span>
                          <span className="text-2xl font-bold text-green-600">
                            £{parseFloat(selectedSignup.estimatedCommission).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-900">
                        <strong>Note:</strong> This payment will be processed via Stripe. 
                        Please verify all details before proceeding to confirmation.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setShowCommissionModal(false);
                          setCommissionStep('review');
                        }}
                        data-testid="button-cancel-commission"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={() => setCommissionStep('confirm')}
                        className="bg-blue-600 hover:bg-blue-700"
                        data-testid="button-proceed-payment"
                      >
                        Proceed to Payment
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Step 2: Confirm */}
                    <div className="space-y-4">
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <h3 className="font-semibold text-amber-900 mb-2">Final Confirmation Required</h3>
                        <p className="text-sm text-amber-800">
                          You are about to process a commission payment of{' '}
                          <strong className="text-lg">£{parseFloat(selectedSignup.estimatedCommission).toFixed(2)}</strong>
                          {' '}to {selectedSignup.partnerName} via Stripe.
                        </p>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Recipient:</span>
                          <span className="font-medium">{selectedSignup.partnerName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium">{selectedSignup.partnerEmail}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">For Business:</span>
                          <span className="font-medium">{selectedSignup.businessName}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="font-semibold">Total Amount:</span>
                          <span className="text-xl font-bold text-green-600">
                            £{parseFloat(selectedSignup.estimatedCommission).toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setCommissionStep('review')}
                          data-testid="button-back-review"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={async () => {
                            try {
                              await apiRequest('POST', `/api/admin/quotes/${selectedSignup.quoteId}/pay-commission`, {
                                amount: selectedSignup.estimatedCommission,
                                partnerEmail: selectedSignup.partnerEmail,
                                partnerName: selectedSignup.partnerName,
                              });
                              queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
                              setShowCommissionModal(false);
                              setCommissionStep('review');
                              setSelectedSignup(null);
                            } catch (error) {
                              console.error('Payment error:', error);
                            }
                          }}
                          className="bg-green-600 hover:bg-green-700"
                          data-testid="button-confirm-payment"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Confirm & Process Payment
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Docs Out Confirmation Dialog */}
        <Dialog open={showDocsOutDialog} onOpenChange={setShowDocsOutDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6 text-orange-600" />
                Confirm Docs Out - Agreement Sent
              </DialogTitle>
            </DialogHeader>
            {selectedSignupForDocs && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Business:</strong> {selectedSignupForDocs.businessName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Contact:</strong> {selectedSignupForDocs.ownerFirstName} {selectedSignupForDocs.ownerLastName} ({selectedSignupForDocs.ownerEmail})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Communication Notes
                    <span className="text-gray-500 font-normal ml-2">(What documents are required?)</span>
                  </label>
                  <Textarea
                    value={docsOutNotes}
                    onChange={(e) => setDocsOutNotes(e.target.value)}
                    placeholder="E.g., Agreement sent via email. Please complete Onfido photo ID verification and provide proof of bank account (for sole traders only)"
                    rows={5}
                    className="w-full"
                    data-testid="textarea-docs-out-notes"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    This note will be saved for tracking purposes and to communicate with the customer about required documents.
                  </p>
                </div>

                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Default Required Documents:</p>
                      <ul className="mt-2 text-sm text-gray-700 list-disc list-inside">
                        <li>Onfido Photo ID Verification</li>
                        <li>Proof of Bank Account (for sole traders)</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDocsOutDialog(false);
                      setDocsOutNotes("");
                      setSelectedSignupForDocs(null);
                    }}
                    data-testid="button-cancel-docs-out"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      signupDocsOutMutation.mutate({
                        quoteId: selectedSignupForDocs.quoteId,
                        notes: docsOutNotes
                      });
                    }}
                    disabled={signupDocsOutMutation.isPending}
                    className="bg-orange-600 hover:bg-orange-700"
                    data-testid="button-confirm-docs-out"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    {signupDocsOutMutation.isPending ? 'Confirming...' : 'Confirm Docs Out'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Awaiting Docs Dialog */}
        <Dialog open={showAwaitingDocsDialog} onOpenChange={setShowAwaitingDocsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <Clock className="w-6 h-6 text-blue-600" />
                Move to Awaiting Documents
              </DialogTitle>
            </DialogHeader>
            {selectedSignupForDocs && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Business:</strong> {selectedSignupForDocs.businessName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Contact:</strong> {selectedSignupForDocs.ownerFirstName} {selectedSignupForDocs.ownerLastName} ({selectedSignupForDocs.ownerEmail})
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Required Documents
                  </label>
                  <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                    {[
                      { id: 'identification', label: 'ID (Passport/Driving License)' },
                      { id: 'proof_of_bank', label: 'Proof of Bank Account' },
                      { id: 'business_registration', label: 'Business Registration' },
                      { id: 'vat_certificate', label: 'VAT Certificate' },
                      { id: 'proof_of_address', label: 'Proof of Address' },
                      { id: 'other', label: 'Other Documents' },
                    ].map((doc) => (
                      <div key={doc.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`doc-${doc.id}`}
                          checked={selectedDocuments.includes(doc.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedDocuments([...selectedDocuments, doc.id]);
                            } else {
                              setSelectedDocuments(selectedDocuments.filter(d => d !== doc.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          data-testid={`checkbox-doc-${doc.id}`}
                        />
                        <label htmlFor={`doc-${doc.id}`} className="ml-2 text-sm text-gray-700">
                          {doc.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                    <span className="text-gray-500 font-normal ml-2">(Optional instructions for the customer)</span>
                  </label>
                  <Textarea
                    value={awaitingDocsNotes}
                    onChange={(e) => setAwaitingDocsNotes(e.target.value)}
                    placeholder="E.g., Please complete your Onfido ID verification within 48 hours"
                    rows={4}
                    className="w-full"
                    data-testid="textarea-awaiting-docs-notes"
                  />
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">This will be posted to the Quote Messages</p>
                      <p className="mt-1 text-sm text-gray-700">
                        The selected documents and notes will be posted to the quote messaging system and the signup status will be updated to "Awaiting Documents".
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAwaitingDocsDialog(false);
                      setAwaitingDocsNotes("");
                      setSelectedDocuments([]);
                      setSelectedSignupForDocs(null);
                    }}
                    data-testid="button-cancel-awaiting-docs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      signupAwaitingDocsMutation.mutate({
                        quoteId: selectedSignupForDocs.quoteId,
                        notes: awaitingDocsNotes,
                        documents: selectedDocuments.length > 0 ? selectedDocuments : ['identification', 'proof_of_bank']
                      });
                    }}
                    disabled={signupAwaitingDocsMutation.isPending || selectedDocuments.length === 0}
                    className="bg-blue-600 hover:bg-blue-700"
                    data-testid="button-confirm-awaiting-docs"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {signupAwaitingDocsMutation.isPending ? 'Updating...' : 'Request Documents'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Cancel Quote Dialog */}
        <Dialog open={showCancelQuoteDialog} onOpenChange={setShowCancelQuoteDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl">
                <XCircle className="w-6 h-6 text-red-600" />
                Cancel Quote
              </DialogTitle>
            </DialogHeader>
            {selectedQuoteToCancel && (
              <div className="space-y-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <p className="text-sm font-medium text-yellow-800">
                    Are you sure you want to cancel this quote?
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Quote ID: {selectedQuoteToCancel.quoteId || 'N/A'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cancellation Reason <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    data-testid="select-cancel-reason"
                  >
                    <option value="">Select a reason...</option>
                    <option value="live_account">Client now has live account</option>
                    <option value="time_delay">Time delay - no longer interested</option>
                    <option value="did_not_proceed">Client did not proceed</option>
                    <option value="custom">Other (specify below)</option>
                  </select>
                </div>

                {cancelReason === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Reason
                    </label>
                    <Textarea
                      value={customCancelReason}
                      onChange={(e) => setCustomCancelReason(e.target.value)}
                      placeholder="Please specify the reason..."
                      rows={3}
                      className="w-full"
                      data-testid="textarea-custom-cancel-reason"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCancelQuoteDialog(false);
                      setCancelReason("");
                      setCustomCancelReason("");
                      setSelectedQuoteToCancel(null);
                    }}
                    data-testid="button-cancel-dialog"
                  >
                    Keep Quote
                  </Button>
                  <Button
                    onClick={() => {
                      const finalReason = cancelReason === 'custom' ? customCancelReason : cancelReason;
                      cancelQuoteMutation.mutate({
                        quoteId: selectedQuoteToCancel.quoteId,
                        reason: finalReason
                      });
                    }}
                    disabled={!cancelReason || (cancelReason === 'custom' && !customCancelReason) || cancelQuoteMutation.isPending}
                    className="bg-red-600 hover:bg-red-700"
                    data-testid="button-confirm-cancel"
                  >
                    {cancelQuoteMutation.isPending ? 'Canceling...' : 'Cancel Quote'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Confirm Payment Modal - Three Step Flow with Commission Preview */}
        <Dialog open={showConfirmPaymentModal} onOpenChange={(open) => {
          if (!open) {
            setShowConfirmPaymentModal(false);
            setPaymentStep('input');
            setCommissionPreview(null);
          }
        }}>
          <DialogContent className="sm:max-w-[700px]" data-testid="modal-confirm-payment">
            <DialogHeader>
              <DialogTitle>
                {paymentStep === 'input' && 'Enter Payment Details'}
                {paymentStep === 'preview' && 'Commission Distribution Preview'}
                {paymentStep === 'confirm' && 'Final Confirmation'}
              </DialogTitle>
            </DialogHeader>
            
            {selectedReferral && (
              <div className="space-y-6">
                {paymentStep === 'input' && (
                  <Form {...confirmPaymentForm}>
                    <form onSubmit={confirmPaymentForm.handleSubmit((values) => {
                      previewCommissionMutation.mutate({
                        dealId: selectedReferral.id,
                        actualCommission: values.actualCommission
                      });
                    })} className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <h3 className="font-semibold">Deal Information</h3>
                        <p className="text-sm"><strong>Business:</strong> {selectedReferral.businessName}</p>
                        <p className="text-sm"><strong>Estimated Commission:</strong> £{selectedReferral.estimatedCommission}</p>
                      </div>

                      <FormField
                        control={confirmPaymentForm.control}
                        name="actualCommission"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Total Commission Amount (£)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="100.00" {...field} data-testid="input-commission-amount" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={confirmPaymentForm.control}
                        name="paymentReference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Reference</FormLabel>
                            <FormControl>
                              <Input placeholder="PAY-001-2025" {...field} data-testid="input-payment-reference" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={confirmPaymentForm.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Method</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-payment-method">
                                  <SelectValue placeholder="Select method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                                <SelectItem value="Stripe">Stripe</SelectItem>
                                <SelectItem value="PayPal">PayPal</SelectItem>
                                <SelectItem value="Check">Check</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={confirmPaymentForm.control}
                        name="paymentNotes"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Notes (Optional)</FormLabel>
                            <FormControl>
                              <Textarea {...field} placeholder="Any additional notes..." data-testid="textarea-payment-notes" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => {
                          setShowConfirmPaymentModal(false);
                          setPaymentStep('input');
                        }} data-testid="button-cancel-payment">
                          Cancel
                        </Button>
                        <Button type="submit" disabled={previewCommissionMutation.isPending} data-testid="button-preview-commission">
                          {previewCommissionMutation.isPending ? 'Loading...' : 'Preview Distribution'}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}

                {paymentStep === 'preview' && commissionPreview && (
                  <div className="space-y-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-lg mb-2">Distribution Overview</h3>
                      <p className="text-sm text-gray-700">
                        Total Commission: <strong className="text-xl text-green-600">£{commissionPreview.totalCommission.toFixed(2)}</strong>
                      </p>
                      <p className="text-sm text-gray-600 mt-1">For: {commissionPreview.businessName}</p>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg divide-y">
                      {commissionPreview.distribution.map((recipient: any, index: number) => (
                        <div key={recipient.userId} className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                  {index === 0 ? 'Direct Referral' : `Level ${index} Override`}
                                </span>
                              </div>
                              <p className="font-semibold text-gray-900">{recipient.userName}</p>
                              <p className="text-sm text-gray-600">{recipient.email}</p>
                              <p className="text-xs text-gray-500 mt-1">Partner ID: {recipient.partnerId}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">£{recipient.amount.toFixed(2)}</div>
                              <div className="text-sm text-gray-600">{recipient.percentage}%</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                      <p className="text-sm text-amber-900">
                        <strong>Note:</strong> This payment will be distributed to {commissionPreview.distribution.length} people in the upline chain.
                      </p>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => {
                        setPaymentStep('input');
                        setCommissionPreview(null);
                      }} data-testid="button-back-to-input">
                        Back
                      </Button>
                      <Button onClick={() => setPaymentStep('confirm')} className="bg-blue-600 hover:bg-blue-700" data-testid="button-proceed-confirm">
                        Proceed to Confirm
                      </Button>
                    </div>
                  </div>
                )}

                {paymentStep === 'confirm' && commissionPreview && (
                  <div className="space-y-4">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-semibold text-red-900 mb-2">⚠️ Final Confirmation Required</h3>
                      <p className="text-sm text-red-800">
                        You are about to process and distribute{' '}
                        <strong className="text-lg">£{commissionPreview.totalCommission.toFixed(2)}</strong>
                        {' '}to {commissionPreview.distribution.length} people.
                      </p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Business:</span>
                        <span className="font-medium">{commissionPreview.businessName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment Method:</span>
                        <span className="font-medium">{confirmPaymentForm.getValues('paymentMethod')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Reference:</span>
                        <span className="font-medium">{confirmPaymentForm.getValues('paymentReference')}</span>
                      </div>
                      <div className="flex justify-between pt-2 border-t">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="text-xl font-bold text-green-600">£{commissionPreview.totalCommission.toFixed(2)}</span>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                      <Button type="button" variant="outline" onClick={() => setPaymentStep('preview')} data-testid="button-back-to-preview">
                        Back
                      </Button>
                      <Button 
                        onClick={() => {
                          confirmPaymentMutation.mutate({
                            dealId: selectedReferral.id,
                            paymentData: confirmPaymentForm.getValues()
                          });
                        }}
                        disabled={confirmPaymentMutation.isPending}
                        className="bg-green-600 hover:bg-green-700"
                        data-testid="button-final-confirm"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        {confirmPaymentMutation.isPending ? 'Processing...' : 'Confirm & Process Payment'}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Docs In Dialog */}
        <Dialog open={showDocsInDialog} onOpenChange={setShowDocsInDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <FileText className="w-6 h-6 text-green-600" />
                Mark Documents Received
              </DialogTitle>
            </DialogHeader>
            {selectedSignupForDocs && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Business:</strong> {selectedSignupForDocs.businessName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Contact:</strong> {selectedSignupForDocs.ownerFirstName} {selectedSignupForDocs.ownerLastName}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Documents Received
                    </label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {[
                        { id: 'identification', label: 'ID (Passport/Driving License)' },
                        { id: 'proof_of_bank', label: 'Proof of Bank Account' },
                        { id: 'business_registration', label: 'Business Registration' },
                        { id: 'vat_certificate', label: 'VAT Certificate' },
                        { id: 'proof_of_address', label: 'Proof of Address' },
                        { id: 'other', label: 'Other Documents' },
                      ].map((doc) => (
                        <div key={doc.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`received-${doc.id}`}
                            checked={receivedDocuments.includes(doc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setReceivedDocuments([...receivedDocuments, doc.id]);
                                setOutstandingDocuments(outstandingDocuments.filter(d => d !== doc.id));
                              } else {
                                setReceivedDocuments(receivedDocuments.filter(d => d !== doc.id));
                              }
                            }}
                            className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            data-testid={`checkbox-received-${doc.id}`}
                          />
                          <label htmlFor={`received-${doc.id}`} className="ml-2 text-sm text-gray-700">
                            {doc.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Outstanding Documents
                      <span className="text-gray-500 font-normal ml-2">(Still waiting)</span>
                    </label>
                    <div className="space-y-3 bg-amber-50 p-4 rounded-lg">
                      {[
                        { id: 'identification', label: 'ID (Passport/Driving License)' },
                        { id: 'proof_of_bank', label: 'Proof of Bank Account' },
                        { id: 'business_registration', label: 'Business Registration' },
                        { id: 'vat_certificate', label: 'VAT Certificate' },
                        { id: 'proof_of_address', label: 'Proof of Address' },
                        { id: 'other', label: 'Other Documents' },
                      ].map((doc) => (
                        <div key={doc.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`outstanding-${doc.id}`}
                            checked={outstandingDocuments.includes(doc.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setOutstandingDocuments([...outstandingDocuments, doc.id]);
                                setReceivedDocuments(receivedDocuments.filter(d => d !== doc.id));
                              } else {
                                setOutstandingDocuments(outstandingDocuments.filter(d => d !== doc.id));
                              }
                            }}
                            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                            data-testid={`checkbox-outstanding-${doc.id}`}
                          />
                          <label htmlFor={`outstanding-${doc.id}`} className="ml-2 text-sm text-gray-700">
                            {doc.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <Textarea
                    value={docsInNotes}
                    onChange={(e) => setDocsInNotes(e.target.value)}
                    placeholder="E.g., All documents verified and approved"
                    rows={4}
                    className="w-full"
                    data-testid="textarea-docs-in-notes"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDocsInDialog(false);
                      setDocsInNotes("");
                      setReceivedDocuments([]);
                      setOutstandingDocuments([]);
                      setSelectedSignupForDocs(null);
                    }}
                    data-testid="button-cancel-docs-in"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      signupDocsInMutation.mutate({
                        quoteId: selectedSignupForDocs.quoteId,
                        notes: docsInNotes,
                        receivedDocuments,
                        outstandingDocuments
                      });
                    }}
                    disabled={signupDocsInMutation.isPending || receivedDocuments.length === 0}
                    className="bg-green-600 hover:bg-green-700"
                    data-testid="button-confirm-docs-in"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {signupDocsInMutation.isPending ? 'Processing...' : 'Confirm Docs Received'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Final Decision Dialog (Approve/Decline) */}
        <Dialog open={showDecisionDialog} onOpenChange={setShowDecisionDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                {decision === 'approved' ? (
                  <>
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    Approve Deal
                  </>
                ) : (
                  <>
                    <XCircle className="w-6 h-6 text-red-600" />
                    Decline Deal
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            {selectedSignupForDocs && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    <strong>Business:</strong> {selectedSignupForDocs.businessName}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Contact:</strong> {selectedSignupForDocs.ownerFirstName} {selectedSignupForDocs.ownerLastName}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision
                  </label>
                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant={decision === 'approved' ? 'default' : 'outline'}
                      className={decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                      onClick={() => setDecision('approved')}
                      data-testid="button-decision-approved"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      type="button"
                      variant={decision === 'declined' ? 'default' : 'outline'}
                      className={decision === 'declined' ? 'bg-red-600 hover:bg-red-700' : ''}
                      onClick={() => setDecision('declined')}
                      data-testid="button-decision-declined"
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                  </div>
                </div>

                {decision === 'approved' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission Amount (£)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      value={decisionCommission}
                      onChange={(e) => setDecisionCommission(e.target.value)}
                      placeholder="100.00"
                      className="w-full"
                      data-testid="input-decision-commission"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      This commission will be distributed across the upline chain when payment is processed.
                    </p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decision Notes
                  </label>
                  <Textarea
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder={decision === 'approved' ? 'E.g., All checks passed, approved for processing' : 'E.g., Documents incomplete, declined'}
                    rows={4}
                    className="w-full"
                    data-testid="textarea-decision-notes"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowDecisionDialog(false);
                      setDecisionNotes("");
                      setDecisionCommission("");
                      setSelectedSignupForDocs(null);
                    }}
                    data-testid="button-cancel-decision"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      finalDecisionMutation.mutate({
                        quoteId: selectedSignupForDocs.quoteId,
                        decision,
                        notes: decisionNotes,
                        actualCommission: decision === 'approved' ? decisionCommission : undefined
                      });
                    }}
                    disabled={finalDecisionMutation.isPending || !decisionNotes}
                    className={decision === 'approved' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}
                    data-testid="button-confirm-decision"
                  >
                    {decision === 'approved' ? <CheckCircle className="w-4 h-4 mr-2" /> : <XCircle className="w-4 h-4 mr-2" />}
                    {finalDecisionMutation.isPending ? 'Processing...' : `Confirm ${decision === 'approved' ? 'Approval' : 'Decline'}`}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
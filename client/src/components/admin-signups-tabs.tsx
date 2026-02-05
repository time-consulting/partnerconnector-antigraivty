import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { 
  Building, 
  User, 
  DollarSign, 
  CheckCircle, 
  FileText, 
  Clock,
  Send,
  XCircle,
  AlertCircle,
  Download,
  Upload,
  Zap,
  Loader2
} from "lucide-react";

interface AdminSignupsTabsProps {
  signupsLoading: boolean;
  signups: any[];
  dealsData: { deals: any[] };
  signupSubTab: string;
  setSignupSubTab: (tab: string) => void;
  setSelectedSignupForDocs: (signup: any) => void;
  setShowDocsOutDialog: (show: boolean) => void;
  setShowAwaitingDocsDialog: (show: boolean) => void;
  setShowDocsInDialog: (show: boolean) => void;
  setReceivedDocuments: (docs: string[]) => void;
  setShowDecisionDialog: (show: boolean) => void;
  setDecision: (decision: 'approved' | 'declined') => void;
  setDecisionCommission: (commission: string) => void;
  setShowQuoteModal: (show: boolean) => void;
  setSelectedReferral: (deals: any) => void;
  setShowCancelQuoteDialog: (show: boolean) => void;
  setSelectedQuoteToCancel: (quote: any) => void;
}

export function AdminSignupsTabs(props: AdminSignupsTabsProps) {
  const {
    signupsLoading,
    signups,
    dealsData,
    signupSubTab,
    setSignupSubTab,
    setSelectedSignupForDocs,
    setShowDocsOutDialog,
    setShowAwaitingDocsDialog,
    setShowDocsInDialog,
    setReceivedDocuments,
    setShowDecisionDialog,
    setDecision,
    setDecisionCommission,
    setShowQuoteModal,
    setSelectedReferral,
    setShowCancelQuoteDialog,
    setSelectedQuoteToCancel
  } = props;

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Invoice state
  const [showRaiseInvoiceDialog, setShowRaiseInvoiceDialog] = useState(false);
  const [showQueryInvoiceDialog, setShowQueryInvoiceDialog] = useState(false);
  const [selectedQuoteForInvoice, setSelectedQuoteForInvoice] = useState<any>(null);
  const [invoiceQueryNotes, setInvoiceQueryNotes] = useState('');

  // Move to Pending Payments mutation
  const moveToPendingPaymentsMutation = useMutation({
    mutationFn: async (quoteId: string) => {
      const res = await fetch(`/api/admin/move-to-payments/${quoteId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to move deal');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/payments/live-accounts'] });
      toast({
        title: "Success",
        description: "Deal moved to Pending Payments",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Raise Invoice mutation
  const raiseInvoiceMutation = useMutation({
    mutationFn: async ({ quoteId, amount }: { quoteId: string; amount: number }) => {
      return await apiRequest('/api/invoices/raise', {
        method: 'POST',
        body: JSON.stringify({ quoteId, amount }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Success",
        description: "Invoice raised successfully",
      });
      setShowRaiseInvoiceDialog(false);
      setSelectedQuoteForInvoice(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Query Invoice mutation
  const queryInvoiceMutation = useMutation({
    mutationFn: async ({ quoteId, queryNotes }: { quoteId: string; queryNotes: string }) => {
      // For now, we don't have an invoice ID yet, so we'll add this to the quote Q&A instead
      return await apiRequest(`/api/quotes/${quoteId}/qa`, {
        method: 'POST',
        body: JSON.stringify({ message: `Payment Query: ${queryNotes}` }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      toast({
        title: "Success",
        description: "Query submitted successfully",
      });
      setShowQueryInvoiceDialog(false);
      setSelectedQuoteForInvoice(null);
      setInvoiceQueryNotes('');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter functions for each tab
  const sentQuotes = signups?.filter((s: any) => 
    s.customerJourneyStatus === 'review_quote' || s.customerJourneyStatus === 'quote_sent'
  ) || [];
  
  const signupStage = signups?.filter((s: any) => 
    s.customerJourneyStatus === 'awaiting_signup' || s.customerJourneyStatus === 'agreement_sent'
  ) || [];
  
  const docsOutStage = signups?.filter((s: any) => 
    s.customerJourneyStatus === 'docs_out'
  ) || [];
  
  const awaitingDocsStage = signups?.filter((s: any) => 
    s.customerJourneyStatus === 'awaiting_docs' || s.customerJourneyStatus === 'docs_received'
  ) || [];
  
  const approvedDeals = signups?.filter((s: any) => 
    s.customerJourneyStatus === 'approved' && !s.commissionPaid
  ) || [];
  
  const completedDeals = signups?.filter((s: any) => 
    s.commissionPaid === true
  ) || [];
  
  const declinedDeals = signups?.filter((s: any) => 
    s.customerJourneyStatus === 'declined'
  ) || [];

  // Component to display deals documents (same as Quote Request section)
  const ReferralDocumentsSection = ({ businessName, parentId }: { businessName?: string | null, parentId?: string }) => {
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
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download error:', error);
      }
    };

    const handleView = (docId: string) => {
      window.open(`/api/bills/${docId}/view`, '_blank');
    };

    if (!documents || documents.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic">
          No documents uploaded yet
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {documents.map((doc: any, index: number) => (
          <div
            key={`${parentId}-${doc.id}-${index}`}
            className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-lg hover:shadow-md transition-all"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-5 w-5 text-indigo-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{doc.fileName || 'Unnamed document'}</p>
                <p className="text-xs text-gray-600">
                  {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Date unknown'}
                </p>
              </div>
            </div>
            <div className="flex gap-2 ml-2 flex-shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleView(doc.id)}
                className="border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                data-testid={`button-view-doc-${doc.id}`}
              >
                <FileText className="h-3 w-3 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(doc.id, doc.fileName)}
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
                data-testid={`button-download-doc-${doc.id}`}
              >
                <Download className="h-3 w-3 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Component to display uploaded documents (legacy, keeping for compatibility)
  const DocumentsSection = ({ quoteId }: { quoteId: string }) => {
    const { data: documents = [] } = useQuery({
      queryKey: ['/api/quotes', quoteId, 'documents'],
      enabled: !!quoteId,
    });

    const handleDownload = async (docId: string, fileName: string) => {
      try {
        const response = await fetch(`/api/quotes/${quoteId}/documents/${docId}/download`);
        if (!response.ok) throw new Error('Download failed');
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        console.error('Download error:', error);
      }
    };

    const docTypeLabels: Record<string, string> = {
      'switcher_statement': 'Switcher Statement',
      'proof_of_bank': 'Proof of Bank',
      'photo_id': 'Photo ID',
      'other': 'Other'
    };

    if (!documents || documents.length === 0) {
      return (
        <div className="text-sm text-gray-500 italic">
          No documents uploaded yet
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {documents.map((doc: any) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 text-gray-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 truncate">{doc.fileName}</p>
                <p className="text-xs text-gray-600">{docTypeLabels[doc.documentType] || doc.documentType}</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleDownload(doc.id, doc.fileName)}
              className="ml-2 flex-shrink-0"
              data-testid={`button-admin-download-${doc.id}`}
            >
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderBusinessCard = (item: any, isReferral: boolean = false) => {
    const data = isReferral ? item : item;
    
    return (
      <Card key={item.id || item.quoteId} className="border-2">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Business Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Building className="w-5 h-5" />
                Business Information
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Business Name:</strong> {data.businessName}</p>
                {data.tradingName && <p><strong>Trading Name:</strong> {data.tradingName}</p>}
                <p><strong>Email:</strong> {data.businessEmail}</p>
                {isReferral && data.businessPhone && <p><strong>Phone:</strong> {data.businessPhone}</p>}
                {data.businessAddress && <p><strong>Address:</strong> {data.businessAddress}</p>}
                {data.businessStructure && <p><strong>Structure:</strong> {data.businessStructure}</p>}
                {data.tradingAddress && <p><strong>Trading Address:</strong> {data.tradingAddress}</p>}
                
                {/* Show processing info for deals */}
                {isReferral && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold text-md mb-2">Processing Details</p>
                    {data.currentProcessor && <p><strong>Current Processor:</strong> {data.currentProcessor}</p>}
                    {data.monthlyVolume && <p><strong>Monthly Volume:</strong> £{parseFloat(data.monthlyVolume).toLocaleString()}</p>}
                    {data.currentRate && <p><strong>Current Rate:</strong> {data.currentRate}%</p>}
                    {data.cardMachineQuantity && <p><strong>Card Machines:</strong> {data.cardMachineQuantity}</p>}
                    {data.selectedProducts && data.selectedProducts.length > 0 && (
                      <p><strong>Products:</strong> {data.selectedProducts.join(', ')}</p>
                    )}
                  </div>
                )}
                
                {/* Show switcher statement for quotes */}
                {!isReferral && data.monthlyCardTurnover && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="font-semibold text-md mb-2">Current Provider</p>
                    <p><strong>Provider:</strong> {data.currentProvider}</p>
                    <p><strong>Monthly Turnover:</strong> £{parseFloat(data.monthlyCardTurnover).toFixed(2)}</p>
                    {data.averageTransactionValue && (
                      <p><strong>Avg Transaction:</strong> £{parseFloat(data.averageTransactionValue).toFixed(2)}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Contact/Owner Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <User className="w-5 h-5" />
                {isReferral ? 'Contact' : 'Director/Owner'} Details
              </h3>
              <div className="space-y-2 text-sm">
                {isReferral ? (
                  <>
                    <p><strong>Name:</strong> {data.contactName}</p>
                    {data.notes && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-semibold mb-1">Additional Notes:</p>
                        <p className="text-gray-700 italic">{data.notes}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <p><strong>Name:</strong> {data.ownerFirstName} {data.ownerLastName}</p>
                    <p><strong>Email:</strong> {data.ownerEmail}</p>
                    <p><strong>Phone:</strong> {data.ownerPhone}</p>
                    {data.ownerHomeAddress && (
                      <p><strong>Home Address:</strong> {data.ownerHomeAddress}</p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Partner Info & Actions */}
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Partner & Actions
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>Partner:</strong> {data.partnerName}</p>
                <p><strong>Email:</strong> {data.partnerEmail}</p>
                <p><strong>Submitted:</strong> {new Date(data.createdAt).toLocaleDateString()}</p>
                
                {data.estimatedCommission && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-lg font-bold text-green-600">
                      £{parseFloat(data.estimatedCommission).toFixed(2)} Commission
                    </p>
                  </div>
                )}

                {!isReferral && data.bankSortCode && (
                  <div className="mt-4 pt-4 border-t">
                    <p><strong>Sort Code:</strong> {data.bankSortCode}</p>
                    <p><strong>Account:</strong> {data.bankAccountNumber}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Uploaded Documents Section - ONLY show in Quote Requests tab, NOT in Deal Management pipeline */}
          {isReferral && item.id ? (
            <div className="mt-6 pt-6 border-t">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Client Uploaded Documents
              </h3>
              <ReferralDocumentsSection 
                businessName={item.clientBusinessName || item.businessName} 
                parentId={item.id} 
              />
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="mt-6 pt-6 border-t">
            {renderActionButtons(item, isReferral)}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderActionButtons = (item: any, isReferral: boolean) => {
    if (isReferral) {
      // Quote Request - Create Quote button
      return (
        <Button
          onClick={() => {
            setSelectedReferral(item);
            setShowQuoteModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          data-testid={`button-create-quote-${item.id}`}
        >
          <Send className="w-4 h-4 mr-2" />
          Create Quote
        </Button>
      );
    }

    const status = item.customerJourneyStatus;

    if (status === 'review_quote' || status === 'quote_sent') {
      // Sent Quotes - Edit, Cancel, Switch to NTC buttons
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => {
              setSelectedReferral(item);
              setShowQuoteModal(true);
            }}
            variant="outline"
            className="border-blue-500 text-blue-700 hover:bg-blue-50"
            data-testid={`button-edit-quote-${item.quoteId}`}
          >
            <FileText className="w-4 h-4 mr-2" />
            Edit Quote
          </Button>
          <Button
            onClick={() => {
              setSelectedQuoteToCancel(item);
              setShowCancelQuoteDialog(true);
            }}
            variant="outline"
            className="border-red-500 text-red-700 hover:bg-red-50"
            data-testid={`button-cancel-quote-${item.quoteId}`}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={async () => {
              // Switch to NTC directly
              try {
                await fetch(`/api/quotes/${item.id}/mark-ntc`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' }
                });
                window.location.reload();
              } catch (error) {
                console.error('Failed to switch to NTC:', error);
              }
            }}
            className="bg-purple-600 hover:bg-purple-700"
            data-testid={`button-switch-ntc-${item.quoteId}`}
          >
            <Send className="w-4 h-4 mr-2" />
            Switch to NTC
          </Button>
        </div>
      );
    }

    if (status === 'awaiting_signup' || status === 'agreement_sent') {
      // Sign Up - Send Docs Out button
      return (
        <Button
          onClick={() => {
            setSelectedSignupForDocs(item);
            setShowDocsOutDialog(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 w-full md:w-auto"
          data-testid={`button-docs-out-${item.quoteId}`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Docs Out
        </Button>
      );
    }

    if (status === 'docs_out') {
      // Docs Out - Reminder, Approved, Declined buttons
      return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Button
            onClick={() => {
              setSelectedSignupForDocs(item);
              setShowAwaitingDocsDialog(true);
            }}
            className="bg-amber-600 hover:bg-amber-700"
            data-testid={`button-reminder-${item.quoteId}`}
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Reminder for Documents
          </Button>
          <Button
            onClick={() => {
              setSelectedSignupForDocs(item);
              setDecision('approved');
              setDecisionCommission(item.estimatedCommission || '');
              setShowDecisionDialog(true);
            }}
            className="bg-green-600 hover:bg-green-700"
            data-testid={`button-approve-${item.quoteId}`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Approved
          </Button>
          <Button
            onClick={() => {
              setSelectedSignupForDocs(item);
              setDecision('declined');
              setShowDecisionDialog(true);
            }}
            variant="destructive"
            data-testid={`button-decline-${item.quoteId}`}
          >
            <XCircle className="w-4 h-4 mr-2" />
            Declined
          </Button>
        </div>
      );
    }

    if (status === 'awaiting_docs' || status === 'docs_received') {
      // Awaiting Docs - Docs In button
      return (
        <Button
          onClick={() => {
            setSelectedSignupForDocs(item);
            setReceivedDocuments(['identification', 'proof_of_bank']);
            setShowDocsInDialog(true);
          }}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
          data-testid={`button-docs-in-${item.quoteId}`}
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          Mark Docs In
        </Button>
      );
    }

    if (status === 'approved' && !item.commissionPaid) {
      // Approved Deals - Move to Pending Payments button
      return (
        <Button
          onClick={() => moveToPendingPaymentsMutation.mutate(item.quoteId)}
          disabled={moveToPendingPaymentsMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
          data-testid={`button-move-to-payments-${item.quoteId}`}
        >
          {moveToPendingPaymentsMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Moving...
            </>
          ) : (
            <>
              <DollarSign className="w-4 h-4 mr-2" />
              Move to Pending Payments
            </>
          )}
        </Button>
      );
    }

    if (item.commissionPaid) {
      // Complete - show invoice options
      const dealValue = item.estimatedCommission ? parseFloat(item.estimatedCommission) : 0;
      
      return (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <p className="text-sm text-green-700 font-medium mb-1">Deal Value</p>
            <p className="text-2xl font-bold text-green-600">
              £{dealValue.toFixed(2)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => {
                setSelectedQuoteForInvoice(item);
                setShowRaiseInvoiceDialog(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid={`button-raise-invoice-${item.quoteId}`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Raise Invoice
            </Button>
            <Button
              onClick={() => {
                setSelectedQuoteForInvoice(item);
                setShowQueryInvoiceDialog(true);
              }}
              variant="outline"
              className="border-orange-500 text-orange-700 hover:bg-orange-50"
              data-testid={`button-query-invoice-${item.quoteId}`}
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Query
            </Button>
          </div>
        </div>
      );
    }

    if (status === 'declined') {
      // Declined - show declined status
      return (
        <div className="flex items-center gap-2 text-red-600">
          <XCircle className="w-5 h-5" />
          <span className="font-medium">Deal Declined</span>
        </div>
      );
    }

    return null;
  };

  const renderTabContent = (items: any[], emptyMessage: string, isReferral: boolean = false) => {
    if (signupsLoading) {
      return (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      );
    }

    if (!items || items.length === 0) {
      return (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>{emptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {items.map((item) => renderBusinessCard(item, isReferral))}
      </div>
    );
  };

  return (
    <Tabs value={signupSubTab} onValueChange={setSignupSubTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-1">
        <TabsTrigger value="sent_quotes" className="text-xs" data-testid="tab-sent-quotes">
          Sent Quotes
          <Badge className="ml-1 bg-purple-600">{sentQuotes.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="sign_up" className="text-xs" data-testid="tab-sign-up">
          Sign Up
          <Badge className="ml-1 bg-indigo-600">{signupStage.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="docs_out" className="text-xs" data-testid="tab-docs-out">
          Docs Out
          <Badge className="ml-1 bg-orange-600">{docsOutStage.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="awaiting_docs" className="text-xs" data-testid="tab-awaiting-docs">
          Awaiting Docs
          <Badge className="ml-1 bg-amber-600">{awaitingDocsStage.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="approved" className="text-xs" data-testid="tab-approved">
          Approved
          <Badge className="ml-1 bg-green-600">{approvedDeals.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="complete" className="text-xs" data-testid="tab-complete">
          Complete
          <Badge className="ml-1 bg-gray-600">{completedDeals.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="declined" className="text-xs" data-testid="tab-declined">
          Declined
          <Badge className="ml-1 bg-red-600">{declinedDeals.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="sent_quotes" className="mt-6">
        {renderTabContent(sentQuotes, "No sent quotes")}
      </TabsContent>

      <TabsContent value="sign_up" className="mt-6">
        {renderTabContent(signupStage, "No signups pending")}
      </TabsContent>

      <TabsContent value="docs_out" className="mt-6">
        {renderTabContent(docsOutStage, "No deals in docs out stage")}
      </TabsContent>

      <TabsContent value="awaiting_docs" className="mt-6">
        {renderTabContent(awaitingDocsStage, "No deals awaiting documents")}
      </TabsContent>

      <TabsContent value="approved" className="mt-6">
        {renderTabContent(approvedDeals, "No approved deals pending commission")}
      </TabsContent>

      <TabsContent value="complete" className="mt-6">
        {renderTabContent(completedDeals, "No completed deals")}
      </TabsContent>

      <TabsContent value="declined" className="mt-6">
        {renderTabContent(declinedDeals, "No declined deals")}
      </TabsContent>

      {/* Raise Invoice Dialog */}
      <Dialog open={showRaiseInvoiceDialog} onOpenChange={setShowRaiseInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Raise Invoice</DialogTitle>
          </DialogHeader>
          
          {selectedQuoteForInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Business:</strong> {selectedQuoteForInvoice.businessName}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Deal ID:</strong> {selectedQuoteForInvoice.dealId || selectedQuoteForInvoice.quoteId}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Commission Amount:</strong> £{parseFloat(selectedQuoteForInvoice.estimatedCommission || 0).toFixed(2)}
                </p>
              </div>

              <p className="text-sm text-gray-600">
                You're about to raise an invoice for this completed deal. Once submitted, the admin will be notified and can process the payment.
              </p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRaiseInvoiceDialog(false);
                setSelectedQuoteForInvoice(null);
              }}
              data-testid="button-cancel-raise-invoice"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedQuoteForInvoice) {
                  raiseInvoiceMutation.mutate({
                    quoteId: selectedQuoteForInvoice.id,
                    amount: parseFloat(selectedQuoteForInvoice.estimatedCommission || 0),
                  });
                }
              }}
              disabled={raiseInvoiceMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-confirm-raise-invoice"
            >
              {raiseInvoiceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Raising Invoice...
                </>
              ) : (
                'Raise Invoice'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Query Invoice Dialog */}
      <Dialog open={showQueryInvoiceDialog} onOpenChange={setShowQueryInvoiceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Query Payment</DialogTitle>
          </DialogHeader>
          
          {selectedQuoteForInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Business:</strong> {selectedQuoteForInvoice.businessName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Deal ID:</strong> {selectedQuoteForInvoice.dealId || selectedQuoteForInvoice.quoteId}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Query Details</label>
                <Textarea
                  value={invoiceQueryNotes}
                  onChange={(e) => setInvoiceQueryNotes(e.target.value)}
                  placeholder="Describe your query or concern about the payment..."
                  rows={4}
                  data-testid="textarea-invoice-query"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowQueryInvoiceDialog(false);
                setSelectedQuoteForInvoice(null);
                setInvoiceQueryNotes('');
              }}
              data-testid="button-cancel-query"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedQuoteForInvoice && invoiceQueryNotes.trim()) {
                  queryInvoiceMutation.mutate({
                    quoteId: selectedQuoteForInvoice.id,
                    queryNotes: invoiceQueryNotes,
                  });
                }
              }}
              disabled={queryInvoiceMutation.isPending || !invoiceQueryNotes.trim()}
              className="bg-orange-600 hover:bg-orange-700"
              data-testid="button-submit-query"
            >
              {queryInvoiceMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Query'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Tabs>
  );
}

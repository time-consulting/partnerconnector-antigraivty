import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import {
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  DollarSign,
  Loader2
} from "lucide-react";

export function AdminInvoicesView() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [showMarkPaidDialog, setShowMarkPaidDialog] = useState(false);
  const [paymentReference, setPaymentReference] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Fetch all invoices
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['/api/admin/invoices'],
  });

  // Mark invoice as paid mutation
  const markPaidMutation = useMutation({
    mutationFn: async ({ invoiceId, paymentReference, adminNotes }: {
      invoiceId: string;
      paymentReference: string;
      adminNotes?: string;
    }) => {
      return await apiRequest(`/api/admin/invoices/${invoiceId}/mark-paid`, {
        method: 'POST',
        body: JSON.stringify({ paymentReference, adminNotes }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/invoices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/signups'] });
      toast({
        title: "Success",
        description: "Invoice marked as paid",
      });
      setShowMarkPaidDialog(false);
      setSelectedInvoice(null);
      setPaymentReference('');
      setAdminNotes('');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'paid':
        return <Badge className="bg-blue-500">Paid</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Filter invoices by status
  const pendingInvoices = invoices.filter((inv: any) => inv.status === 'pending');
  const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid');
  const allInvoices = invoices;

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading invoices...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-2 border-yellow-200 bg-yellow-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Invoices</p>
                <p className="text-3xl font-bold text-yellow-700">{pendingInvoices.length}</p>
              </div>
              <Clock className="w-10 h-10 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Paid Invoices</p>
                <p className="text-3xl font-bold text-blue-700">{paidInvoices.length}</p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-green-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Invoices</p>
                <p className="text-3xl font-bold text-green-700">{allInvoices.length}</p>
              </div>
              <FileText className="w-10 h-10 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">All Invoices</h2>
        
        {allInvoices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No invoices raised yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {allInvoices.map((invoice: any) => (
              <Card key={invoice.id} className="border-2">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Invoice Details */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Invoice Details
                      </h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Invoice #:</strong> {invoice.invoiceNumber}</p>
                        <p><strong>Business:</strong> {invoice.businessName || 'N/A'}</p>
                        <p><strong>Deal ID:</strong> {invoice.dealId || 'N/A'}</p>
                        <p><strong>Amount:</strong> <span className="text-lg font-bold text-green-600">£{parseFloat(invoice.amount).toFixed(2)}</span></p>
                        <div className="pt-2">
                          {getStatusBadge(invoice.status)}
                        </div>
                      </div>
                    </div>

                    {/* Partner Info */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Partner Information</h3>
                      <div className="space-y-2 text-sm">
                        <p><strong>Partner ID:</strong> {invoice.partnerId}</p>
                        <p><strong>Created:</strong> {new Date(invoice.createdAt).toLocaleDateString()}</p>
                        {invoice.paidAt && (
                          <p><strong>Paid Date:</strong> {new Date(invoice.paidAt).toLocaleDateString()}</p>
                        )}
                        {invoice.paymentReference && (
                          <p><strong>Payment Ref:</strong> {invoice.paymentReference}</p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Actions</h3>
                      {invoice.hasQuery && (
                        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <p className="text-sm font-medium text-orange-700 mb-1">Query Raised</p>
                          <p className="text-xs text-gray-600">{invoice.queryNotes}</p>
                        </div>
                      )}
                      
                      {invoice.status === 'pending' ? (
                        <Button
                          onClick={() => {
                            setSelectedInvoice(invoice);
                            setShowMarkPaidDialog(true);
                          }}
                          className="bg-green-600 hover:bg-green-700 w-full"
                          data-testid={`button-mark-paid-${invoice.invoiceNumber}`}
                        >
                          <DollarSign className="w-4 h-4 mr-2" />
                          Mark as Paid
                        </Button>
                      ) : invoice.status === 'paid' ? (
                        <div className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Payment Complete</span>
                        </div>
                      ) : null}

                      {invoice.adminNotes && (
                        <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                          <p className="text-xs font-medium text-gray-700 mb-1">Admin Notes</p>
                          <p className="text-xs text-gray-600">{invoice.adminNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Mark as Paid Dialog */}
      <Dialog open={showMarkPaidDialog} onOpenChange={setShowMarkPaidDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Invoice as Paid</DialogTitle>
          </DialogHeader>

          {selectedInvoice && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Invoice #:</strong> {selectedInvoice.invoiceNumber}
                </p>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Business:</strong> {selectedInvoice.businessName}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Amount:</strong> £{parseFloat(selectedInvoice.amount).toFixed(2)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Payment Reference <span className="text-red-500">*</span>
                </label>
                <Input
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="Enter bank transfer reference or transaction ID"
                  data-testid="input-payment-reference"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Admin Notes (Optional)</label>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Any additional notes about this payment..."
                  rows={3}
                  data-testid="textarea-admin-notes"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowMarkPaidDialog(false);
                setSelectedInvoice(null);
                setPaymentReference('');
                setAdminNotes('');
              }}
              data-testid="button-cancel-mark-paid"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedInvoice && paymentReference.trim()) {
                  markPaidMutation.mutate({
                    invoiceId: selectedInvoice.id,
                    paymentReference,
                    adminNotes: adminNotes || undefined,
                  });
                }
              }}
              disabled={markPaidMutation.isPending || !paymentReference.trim()}
              className="bg-green-600 hover:bg-green-700"
              data-testid="button-confirm-mark-paid"
            >
              {markPaidMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

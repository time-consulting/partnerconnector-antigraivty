import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Banknote, CheckCircle2, Building2,
    Loader2, Info, Send, ClipboardList
} from "lucide-react";

interface FundingQuoteBuilderProps {
    dealId: string;
    businessName: string;
    deal: any;
    onQuoteCreated: (quoteId: string) => void;
    onCancel: () => void;
}

export default function FundingQuoteBuilder({
    dealId,
    businessName,
    deal,
    onQuoteCreated,
    onCancel
}: FundingQuoteBuilderProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fundingAmount = deal?.fundingAmount;

    const handleGenerateFundingQuote = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/deals/${dealId}/generate-funding-quote`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            if (response.ok) {
                const result = await response.json();
                onQuoteCreated(result.quoteId);
            } else {
                const err = await response.json();
                setError(err.message || "Failed to generate funding quote");
            }
        } catch (err) {
            console.error("Failed to generate funding quote:", err);
            setError("Network error. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Business Funding Quote</h2>
                    <p className="text-gray-600 mt-1">for {businessName}</p>
                </div>
                <Badge className="bg-green-100 text-green-800 text-lg px-4 py-2">
                    Existing Dojo Customer
                </Badge>
            </div>

            {/* What This Quote Does */}
            <Card className="border-2 border-green-300 rounded-2xl bg-green-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-800">
                        <Info className="w-5 h-5" />
                        About This Quote
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-green-700 space-y-3">
                    <p>
                        This is an <strong>existing Dojo customer</strong>, so there is no need for a card payment quote.
                        Instead, we'll send them a <strong>Business Funding overview</strong> explaining the process.
                    </p>
                    <p>
                        This quote generates a <strong>Quote ID</strong> and follows the same pipeline stages as
                        a card payments deal — ensuring commissions are tracked through to completion.
                    </p>
                </CardContent>
            </Card>

            {/* Deal Summary */}
            <Card className="border-2 rounded-2xl">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" />
                        Deal Summary
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm text-gray-500">Business Name</label>
                        <p className="font-medium text-lg">{businessName}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{deal?.businessEmail || 'N/A'}</p>
                    </div>
                    {fundingAmount && (
                        <div>
                            <label className="text-sm text-gray-500">Funding Amount Requested</label>
                            <p className="font-bold text-xl text-green-600">{fundingAmount}</p>
                        </div>
                    )}
                    <div>
                        <label className="text-sm text-gray-500">Card Provider</label>
                        <Badge className="bg-green-100 text-green-800">Dojo (Existing)</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* What the Customer Will See */}
            <Card className="border-2 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="w-5 h-5 text-blue-600" />
                        What the Customer Will Receive
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="p-4 bg-white/80 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-800 mb-3">Funding Overview Page</h4>
                        <p className="text-sm text-gray-700 mb-3">
                            The customer will receive a funding application overview explaining:
                        </p>
                        <ol className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                                <span className="text-sm text-gray-700">
                                    They need to <strong>complete the application form</strong> to request funding
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                                <span className="text-sm text-gray-700">
                                    They will receive <strong>3 different funding quotes</strong> — this is a <strong>soft search only</strong> and won't affect their credit
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                                <span className="text-sm text-gray-700">
                                    They can <strong>choose not to proceed</strong> at this stage if the funding amounts don't suit them
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                                <span className="text-sm text-gray-700">
                                    A <strong>specialised funding team</strong> will contact them directly with the quotes
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                                <span className="text-sm text-gray-700">
                                    If they proceed, the application goes straight to <strong>approved or declined</strong> — no further credit checks needed
                                </span>
                            </li>
                        </ol>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                        <Banknote className="w-4 h-4 text-amber-600 flex-shrink-0" />
                        <span className="text-sm text-amber-700 font-medium">
                            If approved, the deal moves to commission confirmation — same process as card payments
                        </span>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Error display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-end pt-4">
                <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={onCancel}
                    className="h-14 px-8 text-lg"
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    size="lg"
                    onClick={handleGenerateFundingQuote}
                    disabled={isSubmitting}
                    className="h-14 px-8 text-lg bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Generating...
                        </>
                    ) : (
                        <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Funding Overview to Customer
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

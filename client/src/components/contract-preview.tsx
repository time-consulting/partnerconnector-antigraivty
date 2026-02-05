import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  FileTextIcon, 
  DownloadIcon, 
  Send, 
  CheckCircleIcon,
  BuildingIcon,
  CalendarIcon,
  PoundSterlingIcon
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContractPreviewProps {
  deal?: {
    businessName: string;
    businessEmail: string;
    contactName?: string;
    estimatedCommission?: string;
    selectedProducts: string[];
  };
  onApprove: () => void;
  onReject: () => void;
  onSendToClient: () => void;
}

export default function ContractPreview({ deal, onApprove, onReject, onSendToClient }: ContractPreviewProps) {
  const { toast } = useToast();
  const [showFullContract, setShowFullContract] = useState(false);
  
  const contractDate = new Date().toLocaleDateString('en-GB');
  const contractNumber = `PC-${Date.now().toString().slice(-6)}`;
  
  const serviceDetails = [
    {
      service: "Payment Processing Solutions",
      description: "Competitive card processing rates and modern payment terminals",
      monthlyFee: "£25.00",
      transactionRate: "1.45% + 5p per transaction",
      included: deal?.selectedProducts.includes("Card Machines")
    },
    {
      service: "Business Funding Assessment", 
      description: "Access to merchant cash advances and business loans",
      monthlyFee: "No monthly fee",
      transactionRate: "3-8% of funded amount",
      included: deal?.selectedProducts.includes("Merchant Cash Advance")
    },
    {
      service: "Business Insurance",
      description: "Comprehensive business protection and liability coverage",
      monthlyFee: "From £45.00",
      transactionRate: "Based on coverage level",
      included: deal?.selectedProducts.includes("Business Insurance")
    },
    {
      service: "Utility Supply Management",
      description: "Competitive business gas and electricity rates",
      monthlyFee: "No monthly fee",
      transactionRate: "Competitive unit rates",
      included: deal?.selectedProducts.includes("Gas & Electric Supply")
    }
  ];

  const includedServices = serviceDetails.filter(service => service.included);

  const handleSendContract = () => {
    onSendToClient();
    toast({
      title: "Contract Sent",
      description: `Service agreement has been sent to ${deal?.businessEmail} for review and signature.`,
    });
  };

  const handleApproveContract = () => {
    onApprove();
    toast({
      title: "Contract Approved",
      description: "Contract has been approved and is ready for client signature.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Contract Header */}
      <Card>
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileTextIcon className="w-6 h-6 text-blue-600" />
              <span>Service Agreement Preview</span>
            </div>
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {contractNumber}
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <BuildingIcon className="w-4 h-4" />
              <span>{deal?.businessName}</span>
            </div>
            <div className="flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              <span>Generated: {contractDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <PoundSterlingIcon className="w-4 h-4" />
              <span>Est. Commission: {deal?.estimatedCommission || "£300-£2,000"}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Contract Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Agreement Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Client Information</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Business:</span> {deal?.businessName}</p>
                <p><span className="font-medium">Contact:</span> {deal?.contactName || "Business Owner"}</p>
                <p><span className="font-medium">Email:</span> {deal?.businessEmail}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Agreement Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Contract Type:</span> Business Services Agreement</p>
                <p><span className="font-medium">Duration:</span> 24 months minimum term</p>
                <p><span className="font-medium">Services:</span> {includedServices.length} selected services</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Services Breakdown */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Service Breakdown</h4>
            <div className="space-y-3">
              {includedServices.map((service, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold text-gray-900">{service.service}</h5>
                    <Badge variant="secondary" className="text-xs">
                      {service.monthlyFee}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <p className="text-xs text-gray-500">
                    <span className="font-medium">Rate:</span> {service.transactionRate}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contract Terms Preview */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2">Key Terms & Conditions</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Minimum 24-month service agreement</li>
              <li>• 30-day notice required for service changes</li>
              <li>• Competitive rates guaranteed for first 12 months</li>
              <li>• No setup fees for approved businesses</li>
              <li>• 24/7 customer support included</li>
              <li>• Monthly billing with detailed reporting</li>
            </ul>
          </div>

          {showFullContract && (
            <div className="bg-white border border-gray-300 rounded-lg p-6 max-h-96 overflow-y-auto">
              <h4 className="font-bold text-gray-900 mb-4 text-center">
                BUSINESS SERVICES AGREEMENT
              </h4>
              <div className="text-xs text-gray-700 space-y-3 leading-relaxed">
                <p>This Business Services Agreement ("Agreement") is entered into on {contractDate} between PartnerConnector Ltd ("Provider") and {deal?.businessName} ("Client").</p>
                
                <div>
                  <h5 className="font-semibold mb-1">1. SERVICES PROVIDED</h5>
                  <p>Provider agrees to facilitate access to the following business services: {includedServices.map(s => s.service).join(", ")}. All services are subject to approval by respective service providers.</p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-1">2. TERMS AND CONDITIONS</h5>
                  <p>This agreement shall commence on the date of client signature and continue for a minimum period of 24 months. Either party may terminate with 30 days written notice after the minimum term.</p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-1">3. PRICING AND FEES</h5>
                  <p>Service fees are as outlined in the service breakdown above. All fees are subject to change with 30 days notice. Setup fees may be waived for qualifying businesses.</p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-1">4. CLIENT OBLIGATIONS</h5>
                  <p>Client agrees to provide accurate business information, maintain good standing with service providers, and comply with all applicable terms and conditions of individual services.</p>
                </div>
                
                <div>
                  <h5 className="font-semibold mb-1">5. LIMITATION OF LIABILITY</h5>
                  <p>Provider's liability is limited to facilitating connections to service providers. Individual service terms and conditions apply to each service relationship.</p>
                </div>
                
                <p className="text-center mt-6 font-medium">
                  This preview is for review purposes only. Official contract will be provided upon approval.
                </p>
              </div>
            </div>
          )}
          
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShowFullContract(!showFullContract)}
              data-testid="button-toggle-full-contract"
            >
              {showFullContract ? "Hide" : "View"} Full Contract
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p className="font-medium">Next Steps:</p>
              <p>Review the contract details and approve to send to client for signature</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onReject}
                className="text-red-600 border-red-200 hover:bg-red-50"
                data-testid="button-reject-contract"
              >
                Needs Changes
              </Button>
              <Button
                variant="outline"
                onClick={handleSendContract}
                data-testid="button-send-contract"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Client
              </Button>
              <Button
                onClick={handleApproveContract}
                className="bg-green-600 hover:bg-green-700"
                data-testid="button-approve-contract"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Approve Contract
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
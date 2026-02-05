import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FileTextIcon, CheckCircleIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LOAFormProps {
  deals: {
    businessName: string;
    businessEmail: string;
    contactName?: string;
    estimatedCommission?: string;
  };
  onSubmit: (formData: LOAFormData) => void;
  onCancel: () => void;
}

export interface LOAFormData {
  partnerName: string;
  partnerTitle: string;
  clientBusinessName: string;
  clientContactName: string;
  clientEmail: string;
  servicesAuthorized: string[];
  specialInstructions: string;
  signatureDate: string;
  partnerSignature: string;
  clientConfirmation: boolean;
}

export default function LOAForm({ deals, onSubmit, onCancel }: LOAFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<LOAFormData>({
    partnerName: "Professional Partner", // Would come from user profile
    partnerTitle: "Business Development Specialist",
    clientBusinessName: deals.businessName,
    clientContactName: deals.contactName || "",
    clientEmail: deals.businessEmail,
    servicesAuthorized: ["Payment Processing Solutions", "Business Funding Assessment"],
    specialInstructions: "",
    signatureDate: new Date().toISOString().split('T')[0],
    partnerSignature: "",
    clientConfirmation: false
  });

  const availableServices = [
    "Payment Processing Solutions",
    "Business Funding Assessment", 
    "Merchant Cash Advance",
    "Business Insurance Quotes",
    "Utility Supply Arrangements",
    "Equipment Financing"
  ];

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      servicesAuthorized: prev.servicesAuthorized.includes(service)
        ? prev.servicesAuthorized.filter(s => s !== service)
        : [...prev.servicesAuthorized, service]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.partnerSignature) {
      toast({
        title: "Signature Required",
        description: "Please provide your digital signature to authorize this LOA.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.clientConfirmation) {
      toast({
        title: "Client Confirmation Required",
        description: "Please confirm you have client authorization to proceed.",
        variant: "destructive"
      });
      return;
    }

    onSubmit(formData);
    toast({
      title: "LOA Submitted",
      description: "Letter of Authority has been generated and submitted for processing.",
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <FileTextIcon className="w-6 h-6 text-blue-600" />
          Letter of Authority (LOA)
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Authorize services on behalf of {deals.businessName}
        </p>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Partner Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Partner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="partnerName">Partner Name</Label>
                <Input
                  id="partnerName"
                  value={formData.partnerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, partnerName: e.target.value }))}
                  required
                  data-testid="input-partner-name"
                />
              </div>
              <div>
                <Label htmlFor="partnerTitle">Title</Label>
                <Input
                  id="partnerTitle"
                  value={formData.partnerTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, partnerTitle: e.target.value }))}
                  required
                  data-testid="input-partner-title"
                />
              </div>
            </div>
          </div>

          {/* Client Information */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Client Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientBusinessName">Business Name</Label>
                <Input
                  id="clientBusinessName"
                  value={formData.clientBusinessName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientBusinessName: e.target.value }))}
                  required
                  data-testid="input-client-business"
                />
              </div>
              <div>
                <Label htmlFor="clientContactName">Contact Name</Label>
                <Input
                  id="clientContactName"
                  value={formData.clientContactName}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientContactName: e.target.value }))}
                  required
                  data-testid="input-client-contact"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="clientEmail">Client Email</Label>
                <Input
                  id="clientEmail"
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                  required
                  data-testid="input-client-email"
                />
              </div>
            </div>
          </div>

          {/* Services Authorization */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Services Authorized</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {availableServices.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={service}
                    checked={formData.servicesAuthorized.includes(service)}
                    onCheckedChange={() => handleServiceToggle(service)}
                    data-testid={`checkbox-service-${service.toLowerCase().replace(/\s+/g, '-')}`}
                  />
                  <Label htmlFor={service} className="text-sm font-medium">
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Special Instructions */}
          <div>
            <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Any specific requirements or notes for this authorization..."
              className="min-h-[100px]"
              data-testid="textarea-special-instructions"
            />
          </div>

          {/* Signature Section */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-gray-900 mb-4">Authorization & Signature</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="partnerSignature">Digital Signature</Label>
                <Input
                  id="partnerSignature"
                  value={formData.partnerSignature}
                  onChange={(e) => setFormData(prev => ({ ...prev, partnerSignature: e.target.value }))}
                  placeholder="Type your full name as digital signature"
                  required
                  data-testid="input-partner-signature"
                />
              </div>
              <div>
                <Label htmlFor="signatureDate">Date</Label>
                <Input
                  id="signatureDate"
                  type="date"
                  value={formData.signatureDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, signatureDate: e.target.value }))}
                  required
                  data-testid="input-signature-date"
                />
              </div>
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="clientConfirmation"
                  checked={formData.clientConfirmation}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, clientConfirmation: !!checked }))}
                  data-testid="checkbox-client-confirmation"
                />
                <Label htmlFor="clientConfirmation" className="text-sm leading-relaxed">
                  I confirm that I have obtained proper authorization from the client to act on their behalf 
                  and submit this Letter of Authority for the services listed above.
                </Label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              data-testid="button-cancel-loa"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              data-testid="button-submit-loa"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              Submit LOA
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
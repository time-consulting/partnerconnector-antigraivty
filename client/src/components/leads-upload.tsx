import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertLeadSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FieldHelpTooltip } from "@/components/contextual-help-tooltip";
import { UploadIcon, PlusIcon, FileSpreadsheetIcon, UserPlusIcon, CheckCircleIcon, AlertCircleIcon } from "lucide-react";

const formSchema = insertLeadSchema.extend({
  partnerId: z.string().optional(), // Will be set from user context
});

type FormData = z.infer<typeof formSchema>;

interface LeadsUploadProps {
  onLeadSubmit: (data: FormData) => void;
  onBulkUpload: (leads: FormData[]) => void;
  isSubmitting: boolean;
}

export default function LeadsUpload({ onLeadSubmit, onBulkUpload, isSubmitting }: LeadsUploadProps) {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvPreview, setCsvPreview] = useState<FormData[]>([]);
  const [csvError, setCsvError] = useState<string>("");
  const [uploadedLeads, setUploadedLeads] = useState<FormData[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      businessType: "",
      estimatedMonthlyVolume: "",
      leadSource: "",
      status: "uploaded",
      priority: "medium",
      notes: "",
      tags: [],
      estimatedValue: "",
      probabilityScore: 50,
    },
  });

  const handleManualSubmit = (data: FormData) => {
    onLeadSubmit(data);
    setUploadedLeads(prev => [...prev, data]);
    form.reset();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      setCsvError("Please upload a CSV file");
      return;
    }

    setCsvFile(file);
    setCsvError("");

    // Parse CSV file
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n').filter(line => line.trim());
        
        if (lines.length < 2) {
          setCsvError("CSV file must have at least a header row and one data row");
          return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const requiredHeaders = ['businessname', 'contactname'];
        
        const hasRequiredHeaders = requiredHeaders.every(required => 
          headers.some(header => header.includes(required.replace(/([A-Z])/g, '$1').toLowerCase()))
        );

        if (!hasRequiredHeaders) {
          setCsvError("CSV must include columns for: Business Name, Contact Name");
          return;
        }

        const leads: FormData[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"/, '').replace(/"$/, ''));
          
          const lead: FormData = {
            businessName: "",
            contactName: "",
            contactEmail: "",
            contactPhone: "",
            businessType: "",
            estimatedMonthlyVolume: "",
            leadSource: "csv_upload",
            status: "uploaded",
            priority: "medium",
            notes: "",
            tags: [],
            estimatedValue: "",
            probabilityScore: 50,
          };

          headers.forEach((header, index) => {
            const value = values[index] || "";
            
            if (header.includes('business') && header.includes('name')) {
              lead.businessName = value;
            } else if (header.includes('contact') && header.includes('name')) {
              lead.contactName = value;
            } else if (header.includes('email')) {
              lead.contactEmail = value;
            } else if (header.includes('phone')) {
              lead.contactPhone = value;
            } else if (header.includes('business') && header.includes('type')) {
              lead.businessType = value;
            } else if (header.includes('volume') || header.includes('turnover')) {
              lead.estimatedMonthlyVolume = value;
            } else if (header.includes('note')) {
              lead.notes = value;
            } else if (header.includes('value') || header.includes('worth')) {
              lead.estimatedValue = value;
            }
          });

          if (lead.businessName && lead.contactName) {
            leads.push(lead);
          }
        }

        setCsvPreview(leads);
      } catch (error) {
        setCsvError("Error parsing CSV file. Please check the format.");
      }
    };

    reader.readAsText(file);
  };

  const handleBulkSubmit = () => {
    onBulkUpload(csvPreview);
    setUploadedLeads(prev => [...prev, ...csvPreview]);
    setCsvPreview([]);
    setCsvFile(null);
  };

  const statusOptions = [
    { value: "uploaded", label: "Uploaded - Not Contacted" },
    { value: "contacted", label: "Contacted" },
    { value: "interested", label: "Interested" },
    { value: "quoted", label: "Quote Sent" },
    { value: "converted", label: "Converted to Deal" },
    { value: "not_interested", label: "Not Interested" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" },
  ];

  const leadSourceOptions = [
    { value: "deals", label: "Referral" },
    { value: "cold_call", label: "Cold Call" },
    { value: "networking", label: "Networking Event" },
    { value: "social_media", label: "Social Media" },
    { value: "website", label: "Website Inquiry" },
    { value: "csv_upload", label: "CSV Upload" },
    { value: "other", label: "Other" },
  ];

  return (
    <div className="space-y-6">
      {/* Success indicator for uploaded leads */}
      {uploadedLeads.length > 0 && (
        <Card className="border-green-200 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="font-medium">
                  Successfully uploaded {uploadedLeads.length} lead{uploadedLeads.length !== 1 ? 's' : ''} to your tracking system
                </span>
              </div>
              <Button 
                variant="outline" 
                className="ml-4 border-green-600 text-green-700 hover:bg-green-600 hover:text-white"
                onClick={() => window.location.href = '/submit-deal'}
                data-testid="button-submit-deals"
              >
                Submit Deal
              </Button>
            </div>
            <p className="text-sm text-green-600 mt-2">
              🎯 Next step: Review and qualify these leads, then submit the best ones as deals to earn commissions.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlusIcon className="h-5 w-5" />
            Lead Tracking System
          </CardTitle>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
            <p className="text-sm text-blue-800">
              💡 <strong>Important:</strong> This uploads leads to your tracking system. Once you qualify a lead, use the "Submit Deal" button to submit it for commission.
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="manual" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="manual" className="flex items-center gap-2">
                <PlusIcon className="h-4 w-4" />
                Manual Entry
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <FileSpreadsheetIcon className="h-4 w-4" />
                CSV Upload
              </TabsTrigger>
            </TabsList>

            <TabsContent value="manual" className="space-y-4">
              <form onSubmit={form.handleSubmit(handleManualSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName" className="flex items-center gap-2">
                      Business Name *
                      <FieldHelpTooltip content="The legal business name of the potential client" />
                    </Label>
                    <Input
                      id="businessName"
                      {...form.register("businessName")}
                      placeholder="Enter business name"
                      data-testid="input-lead-business-name"
                    />
                    {form.formState.errors.businessName && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.businessName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contactName" className="flex items-center gap-2">
                      Contact Name *
                      <FieldHelpTooltip content="Primary contact person at the business" />
                    </Label>
                    <Input
                      id="contactName"
                      {...form.register("contactName")}
                      placeholder="Enter contact name"
                      data-testid="input-lead-contact-name"
                    />
                    {form.formState.errors.contactName && (
                      <p className="text-destructive text-sm mt-1">
                        {form.formState.errors.contactName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="contactEmail">Email Address</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      {...form.register("contactEmail")}
                      placeholder="contact@business.com"
                      data-testid="input-lead-email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      {...form.register("contactPhone")}
                      placeholder="+44 7000 000000"
                      data-testid="input-lead-phone"
                    />
                  </div>

                  <div>
                    <Label htmlFor="businessType">Business Type</Label>
                    <Input
                      id="businessType"
                      {...form.register("businessType")}
                      placeholder="e.g., Restaurant, Retail, Construction"
                      data-testid="input-lead-business-type"
                    />
                  </div>

                  <div>
                    <Label htmlFor="estimatedMonthlyVolume" className="flex items-center gap-2">
                      Estimated Monthly Volume
                      <FieldHelpTooltip content="Approximate processing volume to help determine potential upfront commission value" />
                    </Label>
                    <Input
                      id="estimatedMonthlyVolume"
                      {...form.register("estimatedMonthlyVolume")}
                      placeholder="e.g., £10,000"
                      data-testid="input-lead-volume"
                    />
                  </div>

                  <div>
                    <Label htmlFor="leadSource">Lead Source</Label>
                    <Select onValueChange={(value) => form.setValue("leadSource", value)}>
                      <SelectTrigger data-testid="select-lead-source">
                        <SelectValue placeholder="Select lead source" />
                      </SelectTrigger>
                      <SelectContent>
                        {leadSourceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select onValueChange={(value) => form.setValue("priority", value)} defaultValue="medium">
                      <SelectTrigger data-testid="select-priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        {priorityOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Initial Notes</Label>
                  <Textarea
                    id="notes"
                    {...form.register("notes")}
                    placeholder="Any additional information about this lead..."
                    rows={3}
                    data-testid="textarea-lead-notes"
                  />
                </div>

                <Button type="submit" disabled={isSubmitting} data-testid="button-submit-lead">
                  {isSubmitting ? "Adding Lead..." : "Add Lead"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="csv" className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                <div className="text-center">
                  <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <Label htmlFor="csv-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        Upload CSV file
                      </span>
                    </Label>
                    <Input
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                      data-testid="input-csv-upload"
                    />
                    <p className="mt-2 text-sm text-gray-500">
                      CSV should include columns: Business Name, Contact Name, Email, Phone
                    </p>
                  </div>
                </div>
              </div>

              {csvError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 dark:text-red-300 text-sm">{csvError}</span>
                </div>
              )}

              {csvFile && csvPreview.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Preview: {csvPreview.length} leads found</h3>
                    <Button onClick={handleBulkSubmit} disabled={isSubmitting} data-testid="button-upload-csv">
                      {isSubmitting ? "Uploading..." : "Upload All Leads"}
                    </Button>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto border rounded-lg">
                    <div className="grid gap-2 p-4">
                      {csvPreview.slice(0, 5).map((lead, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium">{lead.businessName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{lead.contactName}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm">{lead.contactEmail}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{lead.contactPhone}</div>
                          </div>
                          <Badge variant="secondary">{lead.status}</Badge>
                        </div>
                      ))}
                      {csvPreview.length > 5 && (
                        <div className="text-center text-sm text-gray-500 py-2">
                          ... and {csvPreview.length - 5} more leads
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
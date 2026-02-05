import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FieldHelpTooltip } from "@/components/contextual-help-tooltip";
import { 
  UsersIcon, 
  PhoneIcon, 
  MailIcon, 
  CalendarIcon, 
  TrendingUpIcon,
  UserPlusIcon,
  MessageSquareIcon,
  EyeIcon,
  EditIcon,
  Send,
  FileTextIcon,
  FilterIcon,
  SearchIcon
} from "lucide-react";
import type { Lead } from "@shared/schema";

interface LeadsDashboardProps {
  leads: Lead[];
  onStatusUpdate: (leadId: string, status: string) => void;
  onAddInteraction: (leadId: string, interaction: any) => void;
  onSendInfo: (leadId: string, productInfo: any) => void;
}

export default function LeadsDashboard({ leads, onStatusUpdate, onAddInteraction, onSendInfo }: LeadsDashboardProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isInteractionDialogOpen, setIsInteractionDialogOpen] = useState(false);
  const [isInfoSharingDialogOpen, setIsInfoSharingDialogOpen] = useState(false);

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (lead.contactEmail && lead.contactEmail.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || lead.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Status options for the dropdown
  const statusOptions = [
    { value: "uploaded", label: "Uploaded - Haven't Discussed", color: "bg-gray-100 text-gray-800" },
    { value: "contacted", label: "Contacted", color: "bg-blue-100 text-blue-800" },
    { value: "interested", label: "In Progress", color: "bg-yellow-100 text-yellow-800" },
    { value: "quoted", label: "Requested More Info", color: "bg-purple-100 text-purple-800" },
    { value: "converted", label: "Converted to Deal", color: "bg-green-100 text-green-800" },
    { value: "not_interested", label: "Not Interested", color: "bg-red-100 text-red-800" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-gray-100 text-gray-700" },
    { value: "medium", label: "Medium", color: "bg-blue-100 text-blue-700" },
    { value: "high", label: "High", color: "bg-red-100 text-red-700" },
  ];

  // Get status display info
  const getStatusInfo = (status: string) => {
    return statusOptions.find(option => option.value === status) || statusOptions[0];
  };

  const getPriorityInfo = (priority: string) => {
    return priorityOptions.find(option => option.value === priority) || priorityOptions[1];
  };

  // Handle status update
  const handleStatusUpdate = (leadId: string, newStatus: string) => {
    onStatusUpdate(leadId, newStatus);
    toast({
      title: "Status Updated",
      description: "Lead status has been updated successfully.",
    });
  };

  // Statistics
  const stats = {
    total: leads.length,
    uploaded: leads.filter(l => l.status === "uploaded").length,
    inProgress: leads.filter(l => l.status === "interested").length,
    converted: leads.filter(l => l.status === "converted").length,
    requestedInfo: leads.filter(l => l.status === "quoted").length,
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Leads</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlusIcon className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-2xl font-bold">{stats.uploaded}</p>
                <p className="text-sm text-gray-600">Haven't Discussed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{stats.inProgress}</p>
                <p className="text-sm text-gray-600">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MessageSquareIcon className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.requestedInfo}</p>
                <p className="text-sm text-gray-600">Requested Info</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUpIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.converted}</p>
                <p className="text-sm text-gray-600">Converted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search" className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4" />
                Search Leads
              </Label>
              <Input
                id="search"
                placeholder="Search by business name, contact, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                data-testid="input-search-leads"
              />
            </div>
            
            <div>
              <Label htmlFor="status-filter">Status Filter</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger data-testid="select-status-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority-filter">Priority Filter</Label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger data-testid="select-priority-filter">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {priorityOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Leads ({filteredLeads.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <UsersIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-4 text-gray-600">No leads found matching your criteria</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => {
                const statusInfo = getStatusInfo(lead.status);
                const priorityInfo = getPriorityInfo(lead.priority || "medium");
                
                return (
                  <div key={lead.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{lead.businessName}</h3>
                          <Badge className={statusInfo.color} variant="secondary">
                            {statusInfo.label}
                          </Badge>
                          <Badge className={priorityInfo.color} variant="outline">
                            {priorityInfo.label}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <UsersIcon className="h-4 w-4" />
                            {lead.contactName}
                          </span>
                          {lead.contactEmail && (
                            <span className="flex items-center gap-1">
                              <MailIcon className="h-4 w-4" />
                              {lead.contactEmail}
                            </span>
                          )}
                          {lead.contactPhone && (
                            <span className="flex items-center gap-1">
                              <PhoneIcon className="h-4 w-4" />
                              {lead.contactPhone}
                            </span>
                          )}
                        </div>

                        {lead.businessType && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Business Type:</span> {lead.businessType}
                          </p>
                        )}

                        {lead.estimatedMonthlyVolume && (
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Est. Monthly Volume:</span> {lead.estimatedMonthlyVolume}
                          </p>
                        )}

                        {lead.notes && (
                          <p className="text-sm text-gray-700 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                            {lead.notes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        {/* Status Update */}
                        <Select
                          value={lead.status}
                          onValueChange={(value) => handleStatusUpdate(lead.id, value)}
                        >
                          <SelectTrigger className="w-48" data-testid={`select-status-${lead.id}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex gap-2">
                          {/* View/Edit Lead */}
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedLead(lead)}
                                data-testid={`button-view-lead-${lead.id}`}
                              >
                                <EyeIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl bg-white">
                              <DialogHeader>
                                <DialogTitle>Lead Details: {lead.businessName}</DialogTitle>
                              </DialogHeader>
                              <LeadDetailView lead={lead} />
                            </DialogContent>
                          </Dialog>

                          {/* Add Interaction */}
                          <Dialog open={isInteractionDialogOpen} onOpenChange={setIsInteractionDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsInteractionDialogOpen(true);
                                }}
                                data-testid={`button-add-interaction-${lead.id}`}
                              >
                                <MessageSquareIcon className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-white">
                              <DialogHeader>
                                <DialogTitle>Add Interaction</DialogTitle>
                              </DialogHeader>
                              <AddInteractionForm
                                lead={selectedLead}
                                onSubmit={(interaction) => {
                                  if (selectedLead) {
                                    onAddInteraction(selectedLead.id, interaction);
                                  }
                                  setIsInteractionDialogOpen(false);
                                }}
                              />
                            </DialogContent>
                          </Dialog>

                          {/* Send Info */}
                          <Dialog open={isInfoSharingDialogOpen} onOpenChange={setIsInfoSharingDialogOpen}>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedLead(lead);
                                  setIsInfoSharingDialogOpen(true);
                                }}
                                data-testid={`button-send-info-${lead.id}`}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl bg-white">
                              <DialogHeader>
                                <DialogTitle>Send Business Information</DialogTitle>
                              </DialogHeader>
                              <InfoSharingForm
                                lead={selectedLead}
                                onSubmit={(productInfo) => {
                                  if (selectedLead) {
                                    onSendInfo(selectedLead.id, productInfo);
                                  }
                                  setIsInfoSharingDialogOpen(false);
                                }}
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Lead Detail View Component
function LeadDetailView({ lead }: { lead: Lead | null }) {
  if (!lead) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Business Name</Label>
          <p className="font-medium">{lead.businessName}</p>
        </div>
        <div>
          <Label>Contact Name</Label>
          <p>{lead.contactName}</p>
        </div>
        <div>
          <Label>Email</Label>
          <p>{lead.contactEmail || "Not provided"}</p>
        </div>
        <div>
          <Label>Phone</Label>
          <p>{lead.contactPhone || "Not provided"}</p>
        </div>
        <div>
          <Label>Business Type</Label>
          <p>{lead.businessType || "Not specified"}</p>
        </div>
        <div>
          <Label>Estimated Monthly Volume</Label>
          <p>{lead.estimatedMonthlyVolume || "Not provided"}</p>
        </div>
        <div>
          <Label>Lead Source</Label>
          <p>{lead.leadSource || "Unknown"}</p>
        </div>
        <div>
          <Label>Priority</Label>
          <p className="capitalize">{lead.priority || "Medium"}</p>
        </div>
      </div>
      
      {lead.notes && (
        <div>
          <Label>Notes</Label>
          <p className="bg-gray-50 dark:bg-gray-800 p-3 rounded text-sm">{lead.notes}</p>
        </div>
      )}
    </div>
  );
}

// Add Interaction Form Component
function AddInteractionForm({ lead, onSubmit }: { lead: Lead | null; onSubmit: (interaction: any) => void }) {
  const [interactionType, setInteractionType] = useState("note");
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [outcome, setOutcome] = useState("neutral");
  const [nextAction, setNextAction] = useState("");

  if (!lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      interactionType,
      subject,
      details,
      outcome,
      nextAction,
    });
    
    // Reset form
    setSubject("");
    setDetails("");
    setNextAction("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Interaction Type</Label>
        <Select value={interactionType} onValueChange={setInteractionType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="call">Phone Call</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="meeting">Meeting</SelectItem>
            <SelectItem value="note">Note</SelectItem>
            <SelectItem value="status_change">Status Change</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Subject</Label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Brief description of the interaction"
        />
      </div>

      <div>
        <Label>Details</Label>
        <Textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Detailed notes about this interaction..."
          rows={4}
        />
      </div>

      <div>
        <Label>Outcome</Label>
        <Select value={outcome} onValueChange={setOutcome}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="follow_up_required">Follow-up Required</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Next Action</Label>
        <Textarea
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
          placeholder="What should be done next..."
          rows={2}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Interaction
      </Button>
    </form>
  );
}

// Info Sharing Form Component
function InfoSharingForm({ lead, onSubmit }: { lead: Lead | null; onSubmit: (productInfo: any) => void }) {
  const [productType, setProductType] = useState("business_funding");
  const [customMessage, setCustomMessage] = useState("");

  if (!lead) return null;

  const productTemplates = {
    business_funding: {
      title: "Business Growth Funding Solutions",
      content: `Hi ${lead.contactName},

I hope this message finds you well. Following our conversation about ${lead.businessName}, I wanted to share some information about business funding solutions that could help accelerate your growth.

🚀 **Business Growth Funding Options:**
• Working capital loans from £5,000 to £500,000
• Quick approval process (often within 24-48 hours)
• Flexible repayment terms
• No lengthy paperwork or collateral requirements

💡 **How This Could Help ${lead.businessName}:**
• Expand inventory or stock
• Invest in new equipment or technology
• Hire additional staff
• Launch marketing campaigns
• Smooth out seasonal cash flow

With your estimated monthly volume of ${lead.estimatedMonthlyVolume || 'N/A'}, you could qualify for competitive rates and terms.

As your trusted advisor, I've partnered with leading financial providers to ensure you get the best possible terms. There's no obligation to proceed, and I'm here to guide you through the entire process if you decide it's right for your business.

Would you like me to arrange a brief call to discuss your specific needs and explore what options might be available?

Best regards,
[Your Name]`
    },
    payment_processing: {
      title: "Cost-Saving Payment Processing Solutions",
      content: `Hi ${lead.contactName},

I hope you're doing well. I wanted to reach out regarding potential cost savings for ${lead.businessName} on your payment processing.

💳 **Payment Processing Benefits:**
• Competitive rates often 20-40% lower than current providers
• Next-day settlements available
• Accept all major card types and contactless payments
• Advanced fraud protection included
• 24/7 customer support

🔧 **Modern POS Solutions:**
• Latest card machines with contactless and chip & PIN
• Integrated inventory management
• Real-time sales reporting
• Mobile payment options for flexibility

With businesses in your sector typically processing £${lead.estimatedMonthlyVolume || '10,000'} monthly, the savings could be significant - often £200-£500+ per month.

Our partner, Dojo, is one of the UK's most trusted payment providers with excellent reviews and a proven track record of helping businesses like yours reduce costs while improving service.

I'd be happy to arrange a quick review of your current setup to see what savings might be possible. There's no obligation, and it only takes a few minutes to get an indication of potential savings.

Would you be interested in exploring this further?

Best regards,
[Your Name]`
    },
    utilities_insurance: {
      title: "Business Services Cost Review",
      content: `Hi ${lead.contactName},

I hope this finds you well. As we discussed ${lead.businessName}'s growth, I wanted to share how I might be able to help you reduce some of your ongoing business costs.

⚡ **Utility & Business Services Review:**
• Business energy supply optimization
• Commercial insurance review and quotes
• Telecoms and broadband comparison
• Waste management solutions
• Business banking reviews

💰 **Typical Savings We've Achieved:**
• Energy costs: 15-30% reduction
• Insurance premiums: 20-35% savings
• Telecoms: 25-40% cost reduction
• Combined annual savings often £2,000-£10,000+

The process is straightforward - I work with trusted partners who specialize in helping businesses like yours find better deals without compromising on quality or service.

As your advisor, my role is to identify opportunities that genuinely benefit your business. There are no upfront costs, and you're under no obligation to switch anything.

Would you be interested in a brief cost review? I can often provide indicative savings within 24-48 hours.

Best regards,
[Your Name]`
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const template = productTemplates[productType as keyof typeof productTemplates];
    
    onSubmit({
      productType,
      title: template.title,
      content: customMessage || template.content,
      leadId: lead.id,
      businessName: lead.businessName,
      contactName: lead.contactName,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Select Information Type</Label>
        <Select value={productType} onValueChange={setProductType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="business_funding">Business Growth Funding</SelectItem>
            <SelectItem value="payment_processing">Payment Processing Solutions (Dojo)</SelectItem>
            <SelectItem value="utilities_insurance">Utilities & Business Services</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Preview Message</Label>
        <Textarea
          value={customMessage || productTemplates[productType as keyof typeof productTemplates].content}
          onChange={(e) => setCustomMessage(e.target.value)}
          rows={15}
          className="text-sm"
        />
      </div>

      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={() => setCustomMessage("")}>
          Reset to Template
        </Button>
        <Button type="submit">
          <Send className="h-4 w-4 mr-2" />
          Send Information
        </Button>
      </div>
    </form>
  );
}
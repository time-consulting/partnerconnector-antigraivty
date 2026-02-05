import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  Mail,
  Send,
  UserPlus,
  Shield,
  Crown,
  Star,
  Info,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  ExternalLink,
} from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

// Form validation schema
const inviteFormSchema = z.object({
  email: z.string().email("Please enter a valid email address").optional(),
  phone: z.string().optional(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  role: z.enum(["member", "manager", "admin"], {
    required_error: "Please select a role",
  }),
  message: z.string().optional(),
  permissions: z.object({
    canSubmitReferrals: z.boolean().default(true),
    canViewCommissions: z.boolean().default(true),
    canManageTeam: z.boolean().default(false),
  }),
  sendWelcomeEmail: z.boolean().default(true),
  setCustomInviteLink: z.boolean().default(false),
  customInviteCode: z.string().optional(),
}).refine((data) => data.email || data.phone, {
  message: "Either email or phone number is required",
  path: ["email"],
});

type InviteFormData = z.infer<typeof inviteFormSchema>;

interface InviteTeamMemberProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userReferralCode?: string;
  onInviteSuccess?: (invitation: any) => void;
}

interface TeamRole {
  value: string;
  label: string;
  description: string;
  icon: any;
  permissions: string[];
}

export default function InviteTeamMember({
  isOpen,
  onOpenChange,
  userReferralCode = "demo123",
  onInviteSuccess,
}: InviteTeamMemberProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [step, setStep] = useState<"form" | "preview" | "success">("form");
  const [invitationData, setInvitationData] = useState<any>(null);

  const teamRoles: TeamRole[] = [
    {
      value: "member",
      label: "Team Member",
      description: "Can submit deals and view their own commissions",
      icon: Users,
      permissions: ["Submit deals", "View own commissions", "Access training"],
    },
    {
      value: "manager",
      label: "Team Manager",
      description: "Can manage team members and view team performance",
      icon: Star,
      permissions: [
        "All member permissions",
        "View team performance",
        "Manage team invites",
        "Access analytics",
      ],
    },
    {
      value: "admin",
      label: "Team Admin",
      description: "Full access to team management and settings",
      icon: Shield,
      permissions: [
        "All manager permissions",
        "Manage team settings",
        "Remove team members",
        "Access all data",
      ],
    },
  ];

  const form = useForm<InviteFormData>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: "",
      phone: "",
      firstName: "",
      lastName: "",
      role: "member",
      message: "",
      permissions: {
        canSubmitReferrals: true,
        canViewCommissions: true,
        canManageTeam: false,
      },
      sendWelcomeEmail: true,
      setCustomInviteLink: false,
      customInviteCode: "",
    },
  });

  const sendInviteMutation = useMutation({
    mutationFn: async (data: InviteFormData) => {
      const response = await apiRequest('/api/invites', 'POST', {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        message: data.message,
      });
      
      return {
        ...response,
        id: Date.now().toString(),
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        status: "pending",
        inviteCode: response.inviteCode || userReferralCode,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        sentAt: new Date(),
        inviteUrl: response.inviteUrl || `${window.location.origin}/signup?ref=${response.inviteCode || userReferralCode}`,
      };
    },
    onSuccess: (invitation) => {
      setInvitationData(invitation);
      setStep("success");
      queryClient.invalidateQueries({ queryKey: ["/api/team-invitations"] });
      onInviteSuccess?.(invitation);
      
      toast({
        title: "Invitation Sent",
        description: `Team invitation sent to ${invitation.email}`,
      });
    },
    onError: (error: any) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/login";
        }, 500);
        return;
      }
      
      toast({
        title: "Invitation Failed",
        description: "Failed to send team invitation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InviteFormData) => {
    // Update permissions based on role
    const updatedData = { ...data };
    if (data.role === "admin" || data.role === "manager") {
      updatedData.permissions.canManageTeam = true;
    }
    
    setStep("preview");
    // Store form data for preview
    setInvitationData(updatedData);
  };

  const confirmInvitation = () => {
    sendInviteMutation.mutate(invitationData);
  };

  const copyInviteLink = async () => {
    if (invitationData?.inviteUrl) {
      try {
        await navigator.clipboard.writeText(invitationData.inviteUrl);
        toast({
          title: "Link Copied",
          description: "Invitation link copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setStep("form");
    setInvitationData(null);
    form.reset();
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const selectedRole = teamRoles.find(role => role.value === form.watch("role"));
  const watchRole = form.watch("role");
  const watchSetCustomLink = form.watch("setCustomInviteLink");

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="!w-[98vw] !max-w-[98vw] !h-[95vh] !max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            {step === "form" && "Invite Team Member"}
            {step === "preview" && "Review Invitation"}
            {step === "success" && "Invitation Sent"}
          </DialogTitle>
          <DialogDescription>
            {step === "form" && "Add a new member to your team with the appropriate permissions"}
            {step === "preview" && "Review the invitation details before sending"}
            {step === "success" && "Your team invitation has been sent successfully"}
          </DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john.doe@company.com"
                              type="email"
                              {...field}
                              data-testid="input-invite-email"
                            />
                          </FormControl>
                          <FormDescription>Send invite via email</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number (Optional)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+44 7123 456789"
                              type="tel"
                              {...field}
                              data-testid="input-invite-phone"
                            />
                          </FormControl>
                          <FormDescription>Send invite via SMS</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John"
                              {...field}
                              data-testid="input-invite-firstname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Doe"
                              {...field}
                              data-testid="input-invite-lastname"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Role Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Role & Permissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Team Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-invite-role">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {teamRoles.map((role) => (
                              <SelectItem key={role.value} value={role.value}>
                                <div className="flex items-center gap-2">
                                  <role.icon className="w-4 h-4" />
                                  <div>
                                    <div className="font-medium">{role.label}</div>
                                    <div className="text-sm text-gray-500">{role.description}</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedRole && (
                    <div className="p-4 bg-blue-50 rounded-lg border">
                      <div className="flex items-center gap-2 mb-2">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-900">Role Permissions</span>
                      </div>
                      <div className="space-y-1">
                        {selectedRole.permissions.map((permission, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-blue-800">
                            <CheckCircle className="w-3 h-3" />
                            {permission}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Permissions */}
                  {watchRole === "member" && (
                    <div className="space-y-3">
                      <FormLabel className="text-sm font-medium">Custom Permissions</FormLabel>
                      
                      <FormField
                        control={form.control}
                        name="permissions.canSubmitReferrals"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-can-submit-deals"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                Can submit deals
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Allow this member to submit new deals
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="permissions.canViewCommissions"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                data-testid="checkbox-can-view-commissions"
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-sm font-normal">
                                Can view commissions
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Allow this member to view their commission earnings
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Invitation Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Invitation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Personal Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add a personal message to the invitation..."
                            className="resize-none"
                            {...field}
                            data-testid="textarea-invite-message"
                          />
                        </FormControl>
                        <FormDescription>
                          This message will be included in the invitation email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="sendWelcomeEmail"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-send-welcome-email"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              Send welcome email
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Send an onboarding email with getting started guide
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="setCustomInviteLink"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              data-testid="checkbox-custom-invite-link"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              Create custom invite code
                            </FormLabel>
                            <FormDescription className="text-xs">
                              Set a custom code for this invitation link
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    {watchSetCustomLink && (
                      <FormField
                        control={form.control}
                        name="customInviteCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Custom Invite Code</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="custom-code-123"
                                {...field}
                                data-testid="input-custom-invite-code"
                              />
                            </FormControl>
                            <FormDescription>
                              Leave empty to auto-generate a code
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  data-testid="button-cancel-invite"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  data-testid="button-review-invite"
                >
                  Review Invitation
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === "preview" && invitationData && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Invitation Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Name</span>
                    <div className="font-medium">
                      {invitationData.firstName} {invitationData.lastName}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <div className="font-medium">{invitationData.email}</div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Role</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {teamRoles.find(r => r.value === invitationData.role)?.label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Expires</span>
                    <div className="font-medium">7 days from now</div>
                  </div>
                </div>

                {invitationData.message && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Personal Message</span>
                    <div className="mt-1 p-3 bg-gray-50 rounded text-sm">
                      {invitationData.message}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep("form")}
                data-testid="button-back-to-form"
              >
                Back to Edit
              </Button>
              <Button
                onClick={confirmInvitation}
                disabled={sendInviteMutation.isPending}
                data-testid="button-send-invitation"
              >
                {sendInviteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "success" && invitationData && (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Invitation Sent Successfully!</h3>
              <p className="text-gray-600">
                An invitation has been sent to {invitationData.email}. They'll receive an email with
                instructions to join your team.
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <div className="text-sm text-gray-600 mb-2">Invitation Link</div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm font-mono">
                  <span className="flex-1 truncate">{invitationData.inviteUrl}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyInviteLink}
                    data-testid="button-copy-invite-link"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={resetForm}
                data-testid="button-invite-another"
              >
                Invite Another
              </Button>
              <Button
                onClick={handleClose}
                data-testid="button-done-inviting"
              >
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
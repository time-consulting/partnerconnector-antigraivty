import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { AlertCircle, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ImpersonationBanner() {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  if (!isMounted) {
    return null;
  }
  
  return <ImpersonationBannerContent />;
}

function ImpersonationBannerContent() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const exitImpersonation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/admin/exit-impersonation');
      return await response.json();
    },
    onSuccess: (data) => {
      // Invalidate auth cache
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      
      // Show toast notification
      toast({
        title: "Exited Impersonation",
        description: data.message || "You're back in admin mode",
      });
      
      // Redirect to admin page after a brief delay to ensure session is updated
      setTimeout(() => {
        window.location.href = '/admin';
      }, 300);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Exit",
        description: error.message || "Could not exit impersonation mode",
        variant: "destructive",
      });
    },
  });

  // Check if we're in impersonation mode
  // This is based on session data that would be sent from backend
  if (!(user as any)?.impersonating) {
    return null;
  }

  return (
    <div 
      className="bg-amber-500 text-white py-3 px-4 flex items-center justify-between shadow-lg sticky top-0 z-50"
      data-testid="impersonation-banner"
    >
      <div className="flex items-center gap-3">
        <AlertCircle className="h-5 w-5" />
        <div>
          <p className="font-semibold">
            Admin Mode: Viewing as {user?.firstName} {user?.lastName}
          </p>
          <p className="text-xs opacity-90">
            You're seeing the interface as this user. Changes you make will affect their account.
          </p>
        </div>
      </div>
      <Button
        onClick={() => exitImpersonation.mutate()}
        disabled={exitImpersonation.isPending}
        variant="secondary"
        size="sm"
        className="bg-white text-amber-600 hover:bg-amber-50"
        data-testid="button-exit-impersonation"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Exit Impersonation
      </Button>
    </div>
  );
}


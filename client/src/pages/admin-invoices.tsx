import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SideNavigation from "@/components/side-navigation";
import Navigation from "@/components/navigation";
import { AdminInvoicesView } from "@/components/admin-invoices-view";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminInvoicesPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <SideNavigation />
        <div className="lg:ml-16">
          <Navigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-red-600">Access Denied: Admin privileges required</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <SideNavigation />
      <div className="lg:ml-16">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setLocation("/admin")}
              className="gap-2 mb-4"
              data-testid="button-back-to-admin"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Admin Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title-admin-invoices">
              Partner Invoices
            </h1>
            <p className="text-gray-600 mt-2">
              Review and manage partner invoice submissions
            </p>
          </div>

          <AdminInvoicesView />
        </div>
      </div>
    </div>
  );
}

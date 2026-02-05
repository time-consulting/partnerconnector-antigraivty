import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SideNavigation from "@/components/side-navigation";
import Navigation from "@/components/navigation";
import MlmVisualization from "@/components/mlm-visualization";
import {
  ArrowLeft,
  Users,
  TrendingUp,
  Target,
  Settings,
  BarChart3,
  FileText,
  DollarSign,
} from "lucide-react";
import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminBackendPage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Fetch all users for backend management
  const { data: allUsers = [] } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch notification counts
  const { data: notificationData } = useQuery({
    queryKey: ["/api/admin/notifications"],
  });

  const notificationCounts = notificationData || {
    submissions: 0,
    signups: 0,
    pipeline: 0,
    messages: 0,
    completedDeals: 0,
  };

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
            <h1 className="text-3xl font-bold text-gray-900" data-testid="page-title-admin-backend">
              Backend Management
            </h1>
            <p className="text-gray-600 mt-2">
              System settings, user management, and analytics
            </p>
          </div>

          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="users" data-testid="tab-backend-users" className="gap-2">
                <Users className="h-4 w-4" />
                <span>Users</span>
              </TabsTrigger>
              <TabsTrigger value="mlm" data-testid="tab-backend-mlm" className="gap-2">
                <Target className="h-4 w-4" />
                <span>MLM Network</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" data-testid="tab-backend-analytics" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-backend-settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Management</h3>
                <div className="grid gap-4">
                  {allUsers.map((u: any) => (
                    <Card key={u.id} className="border-2">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{u.firstName} {u.lastName}</p>
                            <p className="text-sm text-gray-600">{u.email}</p>
                            {u.company && <p className="text-xs text-gray-500">{u.company}</p>}
                          </div>
                          <div className="flex gap-2">
                            {u.isAdmin && <Badge className="bg-purple-500">Admin</Badge>}
                            {u.emailVerified && <Badge variant="outline">Verified</Badge>}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mlm">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">MLM Network Visualization</h3>
                <MlmVisualization />
              </div>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Platform Analytics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-6 text-center">
                      <BarChart3 className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                      <p className="text-2xl font-bold">{allUsers.length}</p>
                      <p className="text-sm text-gray-600">Total Users</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <FileText className="h-8 w-8 mx-auto mb-2 text-green-600" />
                      <p className="text-2xl font-bold">{notificationCounts.submissions}</p>
                      <p className="text-sm text-gray-600">Pending Quotes</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-6 text-center">
                      <DollarSign className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                      <p className="text-2xl font-bold">{notificationCounts.completedDeals}</p>
                      <p className="text-sm text-gray-600">Completed Deals</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="settings">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">System Settings</h3>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-gray-600">System settings and configuration options will appear here.</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

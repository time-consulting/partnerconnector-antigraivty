import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, AlertTriangle, Activity, Webhook, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RequestLog {
  id: string;
  requestId: string;
  timestamp: string;
  userId?: string;
  method: string;
  route: string;
  statusCode: number;
  duration: number;
  userAgent?: string;
  ipAddress?: string;
  errorMessage?: string;
  metadata?: any;
}

interface WebhookLog {
  id: string;
  webhookType: string;
  targetUrl: string;
  payload: any;
  responseCode?: number;
  responseBody?: string;
  deliveryAttempt: number;
  delivered: boolean;
  deliveredAt?: string;
  nextRetryAt?: string;
  createdAt: string;
}

interface AuditLog {
  id: string;
  timestamp: string;
  actorUserId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: any;
  requestId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export default function AdminDiagnostics() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("requests");

  const { data: requestLogs, isLoading: loadingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['/api/admin/request-logs'],
    retry: false,
  });

  const { data: errorLogs, isLoading: loadingErrors, refetch: refetchErrors } = useQuery({
    queryKey: ['/api/admin/error-logs'], 
    retry: false,
  });

  const { data: webhookLogs, isLoading: loadingWebhooks, refetch: refetchWebhooks } = useQuery({
    queryKey: ['/api/admin/webhook-logs'],
    retry: false,
  });

  const { data: auditLogs, isLoading: loadingAudits, refetch: refetchAudits } = useQuery({
    queryKey: ['/api/admin/audit-logs'],
    retry: false,
  });

  const filteredRequestLogs = requestLogs?.filter((log: RequestLog) => 
    log.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.requestId.includes(searchTerm)
  ) || [];

  const filteredErrorLogs = errorLogs?.filter((log: RequestLog) => 
    log.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.errorMessage?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.requestId.includes(searchTerm)
  ) || [];

  const getStatusColor = (statusCode: number) => {
    if (statusCode < 300) return "bg-green-100 text-green-800";
    if (statusCode < 400) return "bg-blue-100 text-blue-800";
    if (statusCode < 500) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const refresh = () => {
    switch (activeTab) {
      case "requests":
        refetchRequests();
        break;
      case "errors":
        refetchErrors();
        break;
      case "webhooks":
        refetchWebhooks();
        break;
      case "audits":
        refetchAudits();
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Diagnostics</h1>
          <p className="text-gray-600">Monitor system health, view logs, and track operations</p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              data-testid="input-search-logs"
            />
          </div>
          <Button onClick={refresh} variant="outline" data-testid="button-refresh">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests" className="flex items-center gap-2" data-testid="tab-requests">
              <Activity className="h-4 w-4" />
              Requests
            </TabsTrigger>
            <TabsTrigger value="errors" className="flex items-center gap-2" data-testid="tab-errors">
              <AlertTriangle className="h-4 w-4" />
              Errors
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2" data-testid="tab-webhooks">
              <Webhook className="h-4 w-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="audits" className="flex items-center gap-2" data-testid="tab-audits">
              <Shield className="h-4 w-4" />
              Audit Trail
            </TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent HTTP Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingRequests ? (
                  <div className="text-center py-8">Loading requests...</div>
                ) : (
                  <div className="space-y-3">
                    {filteredRequestLogs.map((log: RequestLog) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                        data-testid={`request-log-${log.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline" className={getStatusColor(log.statusCode)}>
                              {log.statusCode}
                            </Badge>
                            <Badge variant="secondary">{log.method}</Badge>
                            <span className="font-mono text-sm">{log.route}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                          <div>Duration: {log.duration}ms</div>
                          <div>Request ID: {log.requestId}</div>
                          {log.userId && <div>User: {log.userId}</div>}
                          {log.ipAddress && <div>IP: {log.ipAddress}</div>}
                        </div>
                      </div>
                    ))}
                    {filteredRequestLogs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No requests found</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Error Logs</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingErrors ? (
                  <div className="text-center py-8">Loading errors...</div>
                ) : (
                  <div className="space-y-3">
                    {filteredErrorLogs.map((log: RequestLog) => (
                      <div
                        key={log.id}
                        className="border border-red-200 rounded-lg p-4 bg-red-50"
                        data-testid={`error-log-${log.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="destructive">{log.statusCode}</Badge>
                            <Badge variant="secondary">{log.method}</Badge>
                            <span className="font-mono text-sm">{log.route}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                        {log.errorMessage && (
                          <div className="bg-white p-3 rounded border mt-3">
                            <h4 className="font-medium text-red-800 mb-1">Error Message:</h4>
                            <pre className="text-sm text-red-700 whitespace-pre-wrap">
                              {log.errorMessage}
                            </pre>
                          </div>
                        )}
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-4 mt-3">
                          <div>Duration: {log.duration}ms</div>
                          <div>Request ID: {log.requestId}</div>
                          {log.userId && <div>User: {log.userId}</div>}
                          {log.ipAddress && <div>IP: {log.ipAddress}</div>}
                        </div>
                      </div>
                    ))}
                    {filteredErrorLogs.length === 0 && (
                      <div className="text-center py-8 text-gray-500">No errors found</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="webhooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingWebhooks ? (
                  <div className="text-center py-8">Loading webhooks...</div>
                ) : (
                  <div className="space-y-3">
                    {webhookLogs?.map((log: WebhookLog) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                        data-testid={`webhook-log-${log.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant={log.delivered ? "default" : "destructive"}>
                              {log.delivered ? "Delivered" : "Failed"}
                            </Badge>
                            <span className="font-medium">{log.webhookType}</span>
                            <span className="text-sm text-gray-500">→ {log.targetUrl}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                          <div>Attempt: {log.deliveryAttempt}</div>
                          {log.responseCode && <div>Response: {log.responseCode}</div>}
                          {log.deliveredAt && (
                            <div>Delivered: {formatDistanceToNow(new Date(log.deliveredAt), { addSuffix: true })}</div>
                          )}
                          {log.nextRetryAt && !log.delivered && (
                            <div>Next retry: {formatDistanceToNow(new Date(log.nextRetryAt), { addSuffix: true })}</div>
                          )}
                        </div>
                      </div>
                    )) || []}
                    {(!webhookLogs || webhookLogs.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No webhook logs found</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audits" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Trail</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingAudits ? (
                  <div className="text-center py-8">Loading audit logs...</div>
                ) : (
                  <div className="space-y-3">
                    {auditLogs?.map((log: AuditLog) => (
                      <div
                        key={log.id}
                        className="border rounded-lg p-4 hover:bg-gray-50"
                        data-testid={`audit-log-${log.id}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{log.action}</Badge>
                            <span className="font-medium">{log.entityType}</span>
                            {log.entityId && (
                              <span className="text-sm text-gray-500">ID: {log.entityId}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 grid grid-cols-2 gap-4">
                          {log.actorUserId && <div>Actor: {log.actorUserId}</div>}
                          {log.requestId && <div>Request ID: {log.requestId}</div>}
                          {log.ipAddress && <div>IP: {log.ipAddress}</div>}
                        </div>
                        {log.metadata && (
                          <div className="mt-3 p-2 bg-gray-100 rounded">
                            <pre className="text-xs text-gray-700">
                              {JSON.stringify(log.metadata, null, 2)}
                            </pre>
                          </div>
                        )}
                      </div>
                    )) || []}
                    {(!auditLogs || auditLogs.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No audit logs found</div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
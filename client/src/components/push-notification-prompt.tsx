import { useState, useEffect } from "react";
import { Bell, BellOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import {
  pushNotificationService,
  isPushNotificationSupported,
  getNotificationPermissionState,
  isSubscribedToPushNotifications,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  sendTestNotification
} from "@/lib/push-notifications";

interface PushNotificationPromptProps {
  onClose?: () => void;
  showAsCard?: boolean;
}

export function PushNotificationPrompt({ onClose, showAsCard = true }: PushNotificationPromptProps) {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkPushNotificationStatus();
  }, []);

  const checkPushNotificationStatus = async () => {
    setIsChecking(true);
    try {
      const supported = isPushNotificationSupported();
      setIsSupported(supported);

      if (supported) {
        const perm = getNotificationPermissionState();
        setPermission(perm);

        const subscribed = await isSubscribedToPushNotifications();
        setIsSubscribed(subscribed);
      }
    } catch (error) {
      console.error('Error checking push notification status:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleToggleSubscription = async () => {
    setIsLoading(true);
    try {
      if (isSubscribed) {
        // Unsubscribe
        const result = await unsubscribeFromPushNotifications();
        if (result.success) {
          setIsSubscribed(false);
          toast({
            title: "Notifications Disabled",
            description: "You will no longer receive push notifications."
          });
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to unsubscribe from notifications.",
            variant: "destructive"
          });
        }
      } else {
        // Subscribe
        const result = await subscribeToPushNotifications();
        if (result.success) {
          setIsSubscribed(true);
          setPermission('granted');
          toast({
            title: "Notifications Enabled",
            description: "You will now receive push notifications for important updates."
          });
        } else {
          if (result.error?.includes('denied')) {
            setPermission('denied');
            toast({
              title: "Permission Denied",
              description: "Please enable notifications in your browser settings.",
              variant: "destructive"
            });
          } else {
            toast({
              title: "Error",
              description: result.error || "Failed to subscribe to notifications.",
              variant: "destructive"
            });
          }
        }
      }
    } catch (error) {
      console.error('Error toggling push notifications:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestNotification = async () => {
    setIsLoading(true);
    try {
      const result = await sendTestNotification();
      if (result.success) {
        toast({
          title: "Test Sent",
          description: result.message || "Test notification sent successfully!"
        });
      } else {
        toast({
          title: "Test Failed",
          description: result.error || "Failed to send test notification.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send test notification.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return null;
  }

  if (!isSupported) {
    return (
      <Alert>
        <AlertDescription>
          Push notifications are not supported in your browser. Please use a modern browser like Chrome, Firefox, or Edge.
        </AlertDescription>
      </Alert>
    );
  }

  const content = (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            {isSubscribed ? (
              <Bell className="h-5 w-5 text-primary" />
            ) : (
              <BellOff className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-medium">Push Notifications</h4>
            <p className="text-sm text-muted-foreground">
              {isSubscribed 
                ? "You're receiving notifications" 
                : permission === 'denied'
                  ? "Notifications blocked by browser"
                  : "Enable to receive real-time updates"
              }
            </p>
          </div>
        </div>
        <Switch
          checked={isSubscribed}
          onCheckedChange={handleToggleSubscription}
          disabled={isLoading || permission === 'denied'}
          data-testid="switch-push-notifications"
        />
      </div>

      {permission === 'denied' && (
        <Alert className="mt-4">
          <AlertDescription>
            Notifications are blocked by your browser. To enable them:
            <ol className="mt-2 ml-4 list-decimal text-sm">
              <li>Click the lock icon in your browser's address bar</li>
              <li>Find "Notifications" in the permissions</li>
              <li>Change it from "Block" to "Allow"</li>
              <li>Refresh this page</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}

      {isSubscribed && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleTestNotification}
            disabled={isLoading}
            data-testid="button-test-notification"
          >
            Send Test Notification
          </Button>
        </div>
      )}
    </>
  );

  if (!showAsCard) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Enable Push Notifications</CardTitle>
            <CardDescription>
              Get instant alerts for commission approvals and important updates
            </CardDescription>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-notification-prompt"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
}

// Inline notification prompt (for settings page)
export function InlinePushNotificationToggle() {
  return <PushNotificationPrompt showAsCard={false} />;
}
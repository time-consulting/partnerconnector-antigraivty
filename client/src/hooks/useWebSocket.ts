import { useEffect, useState, useCallback, useRef } from "react";
import { wsClient, type WebSocketMessage, type Notification } from "@/lib/websocket";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./useAuth";

export interface UseWebSocketOptions {
  onNotification?: (notification: Notification) => void;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  autoConnect?: boolean;
  showToastNotifications?: boolean;
}

export function useWebSocket(options: UseWebSocketOptions = {}) {
  const { 
    onNotification, 
    onMessage, 
    onConnect, 
    onDisconnect,
    autoConnect = false,
    showToastNotifications = false
  } = options;

  const { user } = useAuth();
  const { toast } = useToast();
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "disconnected">("disconnected");
  const [lastNotification, setLastNotification] = useState<Notification | null>(null);
  const cleanupFunctions = useRef<Array<() => void>>([]);

  // Handle notification events
  const handleNotification = useCallback((notification: Notification) => {
    setLastNotification(notification);
    
    if (onNotification) {
      onNotification(notification);
    }

    // Show toast notification
    if (showToastNotifications) {
      const metadata = notification.metadata as any;
      toast({
        title: notification.title,
        description: notification.message,
        variant: notification.type === "commission_paid" ? "default" : 
                 notification.type === "status_update" && metadata?.newStatus === "approved" ? "default" :
                 notification.type === "status_update" && metadata?.newStatus === "rejected" ? "destructive" :
                 "default",
      });
    }
  }, [onNotification, showToastNotifications, toast]);

  // Setup WebSocket connection
  useEffect(() => {
    if (!user?.id || !autoConnect) return;

    // Connect to WebSocket
    wsClient.connect(user.id);

    // Set up event handlers
    const unsubscribeMessage = wsClient.onMessage((message) => {
      if (message.type === "notification") {
        handleNotification(message.data as Notification);
      }
      if (onMessage) {
        onMessage(message);
      }
    });

    const unsubscribeConnect = wsClient.onConnect(() => {
      setConnectionState("connected");
      if (onConnect) {
        onConnect();
      }
    });

    const unsubscribeDisconnect = wsClient.onDisconnect(() => {
      setConnectionState("disconnected");
      if (onDisconnect) {
        onDisconnect();
      }
    });

    // Listen for custom notification events (from wsClient)
    const handleCustomNotification = (event: CustomEvent) => {
      handleNotification(event.detail);
    };
    window.addEventListener("notification", handleCustomNotification as any);

    // Store cleanup functions
    cleanupFunctions.current = [
      unsubscribeMessage,
      unsubscribeConnect,
      unsubscribeDisconnect,
      () => window.removeEventListener("notification", handleCustomNotification as any)
    ];

    // Update connection state
    const updateState = () => {
      setConnectionState(wsClient.getConnectionState());
    };
    updateState();
    const stateInterval = setInterval(updateState, 1000);

    return () => {
      clearInterval(stateInterval);
      cleanupFunctions.current.forEach(fn => fn());
      cleanupFunctions.current = [];
      if (autoConnect) {
        wsClient.disconnect();
      }
    };
  }, [user?.id, autoConnect, handleNotification, onMessage, onConnect, onDisconnect]);

  // Methods to interact with WebSocket
  const sendMessage = useCallback((message: any) => {
    wsClient.send(message);
  }, []);

  const markAsRead = useCallback((notificationId: string) => {
    wsClient.markNotificationAsRead(notificationId);
  }, []);

  const subscribe = useCallback((type: string, options?: any) => {
    wsClient.subscribe(type, options);
  }, []);

  const connect = useCallback(() => {
    if (user?.id) {
      wsClient.connect(user.id);
    }
  }, [user?.id]);

  const disconnect = useCallback(() => {
    wsClient.disconnect();
  }, []);

  return {
    connectionState,
    isConnected: connectionState === "connected",
    lastNotification,
    sendMessage,
    markAsRead,
    subscribe,
    connect,
    disconnect,
  };
}

// Hook for managing notification center
export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Use WebSocket hook to listen for new notifications
  const { isConnected } = useWebSocket({
    onNotification: (notification) => {
      // Add new notification to the list
      setNotifications(prev => [notification, ...prev]);
      if (!notification.read) {
        setUnreadCount(prev => prev + 1);
      }
    },
    showToastNotifications: false, // We'll handle toasts separately
  });

  // Fetch notifications on mount
  useEffect(() => {
    if (!user?.id) return;

    fetchNotifications();
  }, [user?.id]);

  const fetchNotifications = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data: { notifications: Notification[]; unreadCount: number } = await response.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      // Update local state immediately
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));

      // Send to server
      wsClient.markNotificationAsRead(notificationId);
      
      // Also update via API for persistence
      await fetch(`/api/notifications/${notificationId}/read`, { 
        method: "PATCH" 
      });
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);

      // Update via API
      await fetch("/api/notifications/read-all", { 
        method: "PATCH" 
      });
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  }, []);

  const clearNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotification,
    refetch: fetchNotifications,
  };
}
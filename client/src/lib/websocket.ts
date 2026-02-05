import { queryClient } from "./queryClient";
import type { Notification } from "@shared/schema";

// Re-export the Notification type for convenience
export type { Notification };

export type NotificationType = 
  | "status_update" 
  | "deal_stage_update" 
  | "commission_paid" 
  | "team_invite" 
  | "system_message"
  | "quote_ready";

export interface WebSocketMessage {
  type: string;
  data: any;
}

type MessageHandler = (message: WebSocketMessage) => void;
type ConnectionHandler = () => void;

class WebSocketClient {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private pingInterval: NodeJS.Timeout | null = null;
  private messageHandlers: Set<MessageHandler> = new Set();
  private connectionHandlers: Set<ConnectionHandler> = new Set();
  private disconnectionHandlers: Set<ConnectionHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 1000; // Start with 1 second
  private maxReconnectDelay = 30000; // Max 30 seconds
  private userId: string | null = null;
  private isIntentionallyClosed = false;

  connect(userId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return;
    }

    this.userId = userId;
    this.isIntentionallyClosed = false;
    
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const wsUrl = `${protocol}//${host}/ws?userId=${encodeURIComponent(userId)}`;

    console.log("Connecting to WebSocket:", wsUrl);

    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      this.scheduleReconnect();
    }
  }

  private setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
      
      // Notify connection handlers
      this.connectionHandlers.forEach(handler => handler());

      // Start ping interval to keep connection alive
      this.startPingInterval();

      // Invalidate notifications query to fetch latest
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    };

    this.ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data);
        console.log("WebSocket message received:", message);

        // Handle specific message types
        if (message.type === "notification") {
          this.handleNotification(message.data as Notification);
        } else if (message.type === "notificationRead") {
          this.handleNotificationRead(message.data.notificationId);
        }

        // Notify all message handlers
        this.messageHandlers.forEach(handler => handler(message));
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
      
      // Clear ping interval
      if (this.pingInterval) {
        clearInterval(this.pingInterval);
        this.pingInterval = null;
      }

      // Notify disconnection handlers
      this.disconnectionHandlers.forEach(handler => handler());

      // Attempt to reconnect if not intentionally closed
      if (!this.isIntentionallyClosed && this.userId) {
        this.scheduleReconnect();
      }
    };
  }

  private handleNotification(notification: Notification) {
    // Invalidate relevant queries based on notification type
    if (notification.dealId) {
      queryClient.invalidateQueries({ queryKey: ["/api/deals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/deals", notification.dealId] });
    }
    
    if (notification.leadId) {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
    }

    if (notification.contactId) {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    }

    if (notification.opportunityId) {
      queryClient.invalidateQueries({ queryKey: ["/api/opportunities"] });
    }

    // Always invalidate notifications and dashboard stats
    queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    queryClient.invalidateQueries({ queryKey: ["/api/stats"] });

    // Show toast notification if available
    const toastEvent = new CustomEvent("notification", { 
      detail: notification 
    });
    window.dispatchEvent(toastEvent);
  }

  private handleNotificationRead(notificationId: string) {
    // Update the notification in the cache
    queryClient.setQueryData(["/api/notifications"], (old: any) => {
      if (!old) return old;
      return {
        ...old,
        notifications: old.notifications?.map((n: Notification) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      };
    });
  }

  private startPingInterval() {
    // Send ping every 25 seconds to keep connection alive
    this.pingInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: "ping", data: {} });
      }
    }, 25000);
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("Max reconnection attempts reached");
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1),
      this.maxReconnectDelay
    );

    console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    this.reconnectTimer = setTimeout(() => {
      if (this.userId && !this.isIntentionallyClosed) {
        this.connect(this.userId);
      }
    }, delay);
  }

  send(message: any) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn("WebSocket is not connected, cannot send message:", message);
    }
  }

  markNotificationAsRead(notificationId: string) {
    this.send({
      type: "markAsRead",
      data: { notificationId }
    });
  }

  subscribe(type: string, options?: any) {
    this.send({
      type: "subscribe",
      data: { type, ...options }
    });
  }

  onMessage(handler: MessageHandler) {
    this.messageHandlers.add(handler);
    return () => {
      this.messageHandlers.delete(handler);
    };
  }

  onConnect(handler: ConnectionHandler) {
    this.connectionHandlers.add(handler);
    return () => {
      this.connectionHandlers.delete(handler);
    };
  }

  onDisconnect(handler: ConnectionHandler) {
    this.disconnectionHandlers.add(handler);
    return () => {
      this.disconnectionHandlers.delete(handler);
    };
  }

  disconnect() {
    this.isIntentionallyClosed = true;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }

    if (this.ws) {
      this.ws.close(1000, "Client disconnect");
      this.ws = null;
    }

    this.messageHandlers.clear();
    this.connectionHandlers.clear();
    this.disconnectionHandlers.clear();
    this.userId = null;
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getConnectionState(): "connecting" | "connected" | "disconnected" {
    if (!this.ws) return "disconnected";
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return "connecting";
      case WebSocket.OPEN:
        return "connected";
      default:
        return "disconnected";
    }
  }
}

// Export singleton instance
export const wsClient = new WebSocketClient();
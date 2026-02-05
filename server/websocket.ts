import { WebSocketServer, WebSocket } from "ws";
import { Server } from "http";
import { IncomingMessage } from "http";
import { storage } from "./storage";
import { parse } from "url";

interface AuthenticatedWebSocket extends WebSocket {
  userId?: string;
  isAlive?: boolean;
  sessionId?: string;
}

interface NotificationPayload {
  id?: string;
  type: string;
  title: string;
  message: string;
  referralId?: string;
  leadId?: string;
  contactId?: string;
  opportunityId?: string;
  businessName?: string;
  metadata?: any;
  timestamp?: Date;
}

class WebSocketManager {
  private wss: WebSocketServer | null = null;
  private clients: Map<string, Set<AuthenticatedWebSocket>> = new Map();
  private heartbeatInterval: NodeJS.Timeout | null = null;

  initialize(server: Server) {
    this.wss = new WebSocketServer({ 
      server,
      path: "/ws",
      verifyClient: async (info, cb) => {
        // Verify authentication from query params or cookies
        const { query } = parse(info.req.url || "", true);
        const userId = query.userId as string;
        
        if (!userId) {
          // Try to get from session if available
          // For now, we'll require userId in query params
          cb(false, 401, "Unauthorized");
          return;
        }

        // Verify user exists
        try {
          const user = await storage.getUser(userId);
          if (!user) {
            cb(false, 401, "Invalid user");
            return;
          }
          cb(true);
        } catch (error) {
          console.error("WebSocket verification error:", error);
          cb(false, 500, "Internal error");
        }
      }
    });

    this.wss.on("connection", (ws: AuthenticatedWebSocket, request: IncomingMessage) => {
      this.handleConnection(ws, request);
    });

    // Set up heartbeat to detect disconnected clients
    this.heartbeatInterval = setInterval(() => {
      this.heartbeat();
    }, 30000); // Every 30 seconds

    console.log("WebSocket server initialized");
  }

  private handleConnection(ws: AuthenticatedWebSocket, request: IncomingMessage) {
    const { query } = parse(request.url || "", true);
    const userId = query.userId as string;

    if (!userId) {
      ws.close(1008, "User ID required");
      return;
    }

    // Set user ID on the WebSocket instance
    ws.userId = userId;
    ws.isAlive = true;

    // Add to clients map
    if (!this.clients.has(userId)) {
      this.clients.set(userId, new Set());
    }
    this.clients.get(userId)!.add(ws);

    console.log(`WebSocket client connected for user: ${userId}`);

    // Send welcome message
    this.sendToClient(ws, {
      type: "connection",
      data: { message: "Connected to notification server" }
    });

    // Handle messages from client
    ws.on("message", (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        this.handleClientMessage(ws, data);
      } catch (error) {
        console.error("Invalid message from client:", error);
      }
    });

    // Handle pong for heartbeat
    ws.on("pong", () => {
      ws.isAlive = true;
    });

    // Handle client disconnect
    ws.on("close", () => {
      this.handleDisconnect(ws);
    });

    ws.on("error", (error) => {
      console.error(`WebSocket error for user ${userId}:`, error);
      this.handleDisconnect(ws);
    });
  }

  private handleClientMessage(ws: AuthenticatedWebSocket, message: any) {
    const { type, data } = message;

    switch (type) {
      case "ping":
        this.sendToClient(ws, { type: "pong", data: { timestamp: Date.now() } });
        break;
      case "subscribe":
        // Handle subscription to specific notification types if needed
        console.log(`User ${ws.userId} subscribed to:`, data);
        break;
      case "markAsRead":
        // Mark notification as read
        if (data?.notificationId && ws.userId) {
          this.markNotificationAsRead(ws.userId, data.notificationId);
        }
        break;
      default:
        console.log(`Unknown message type from user ${ws.userId}:`, type);
    }
  }

  private handleDisconnect(ws: AuthenticatedWebSocket) {
    if (!ws.userId) return;

    const userClients = this.clients.get(ws.userId);
    if (userClients) {
      userClients.delete(ws);
      if (userClients.size === 0) {
        this.clients.delete(ws.userId);
      }
    }

    console.log(`WebSocket client disconnected for user: ${ws.userId}`);
  }

  private heartbeat() {
    this.clients.forEach((clientSet, userId) => {
      clientSet.forEach((ws) => {
        if (!ws.isAlive) {
          ws.terminate();
          return;
        }
        ws.isAlive = false;
        ws.ping();
      });
    });
  }

  private sendToClient(ws: WebSocket, data: any) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  // Public methods for sending notifications
  
  // New method: Broadcast an already-stored notification without creating duplicates
  async broadcastExistingNotification(userId: string, storedNotification: any) {
    try {
      // Send to all connected clients for this user
      const userClients = this.clients.get(userId);
      if (userClients) {
        const payload = {
          type: "notification",
          data: {
            ...storedNotification,
            timestamp: storedNotification.timestamp || new Date()
          }
        };

        userClients.forEach((ws) => {
          this.sendToClient(ws, payload);
        });
      }

      return storedNotification;
    } catch (error) {
      console.error(`Failed to broadcast notification to user ${userId}:`, error);
      throw error;
    }
  }

  // Original method: Create and send notification (kept for backward compatibility)
  // WARNING: This method creates a notification in the database. 
  // If you've already created a notification, use broadcastExistingNotification() instead.
  async sendNotificationToUser(userId: string, notification: NotificationPayload) {
    // Store notification in database
    try {
      const storedNotification = await storage.createNotification({
        userId,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        referralId: notification.referralId || null,
        leadId: notification.leadId || null,
        contactId: notification.contactId || null,
        opportunityId: notification.opportunityId || null,
        businessName: notification.businessName || null,
        metadata: notification.metadata || null,
      });

      // Broadcast the stored notification
      return this.broadcastExistingNotification(userId, storedNotification);
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error);
      throw error;
    }
  }

  async sendNotificationToMultipleUsers(userIds: string[], notification: NotificationPayload) {
    const promises = userIds.map(userId => 
      this.sendNotificationToUser(userId, notification)
    );
    return Promise.all(promises);
  }

  async broadcastNotification(notification: NotificationPayload) {
    const allUserIds = Array.from(this.clients.keys());
    return this.sendNotificationToMultipleUsers(allUserIds, notification);
  }

  private async markNotificationAsRead(userId: string, notificationId: string) {
    try {
      await storage.markNotificationAsRead(notificationId, userId);
      
      // Notify all user's clients about the update
      const userClients = this.clients.get(userId);
      if (userClients) {
        const payload = {
          type: "notificationRead",
          data: { notificationId }
        };
        userClients.forEach((ws) => {
          this.sendToClient(ws, payload);
        });
      }
    } catch (error) {
      console.error(`Failed to mark notification as read:`, error);
    }
  }

  // Status change notifications
  async notifyReferralStatusChange(
    userId: string, 
    referralId: string, 
    businessName: string, 
    oldStatus: string, 
    newStatus: string
  ) {
    const statusMessages: Record<string, string> = {
      quoted: `Quote has been generated for ${businessName}`,
      approved: `${businessName} has approved the quote!`,
      rejected: `${businessName} has rejected the quote`,
      completed: `Referral for ${businessName} has been completed successfully!`,
      pending: `Referral for ${businessName} is being reviewed`
    };

    const notification: NotificationPayload = {
      type: "status_update",
      title: "Referral Status Update",
      message: statusMessages[newStatus] || `Status changed from ${oldStatus} to ${newStatus} for ${businessName}`,
      referralId,
      businessName,
      metadata: {
        oldStatus,
        newStatus
      }
    };

    return this.sendNotificationToUser(userId, notification);
  }

  async notifyDealStageChange(
    userId: string,
    referralId: string,
    businessName: string,
    oldStage: string,
    newStage: string
  ) {
    const stageMessages: Record<string, string> = {
      quote_sent: `Quote has been sent to ${businessName}`,
      quote_approved: `${businessName} has approved the quote!`,
      docs_out_confirmation: `Documents have been sent to ${businessName}`,
      docs_received: `Documents received from ${businessName}`,
      processing: `${businessName} is now in processing`,
      completed: `Deal with ${businessName} has been completed!`
    };

    const notification: NotificationPayload = {
      type: "deal_stage_update",
      title: "Deal Progress Update",
      message: stageMessages[newStage] || `Deal stage changed for ${businessName}`,
      referralId,
      businessName,
      metadata: {
        oldStage,
        newStage
      }
    };

    return this.sendNotificationToUser(userId, notification);
  }

  // Get connection status
  isUserConnected(userId: string): boolean {
    const userClients = this.clients.get(userId);
    return userClients ? userClients.size > 0 : false;
  }

  getConnectedUserCount(): number {
    return this.clients.size;
  }

  shutdown() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }

    this.clients.forEach((clientSet) => {
      clientSet.forEach((ws) => {
        ws.close(1001, "Server shutting down");
      });
    });

    if (this.wss) {
      this.wss.close();
    }
  }
}

// Export singleton instance
export const wsManager = new WebSocketManager();
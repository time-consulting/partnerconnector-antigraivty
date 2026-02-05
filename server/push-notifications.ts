import webpush from "web-push";
import { storage } from "./storage";
import { logger } from "./logger";
import type { PushSubscription } from "@shared/schema";

// VAPID keys for Web Push - MUST be configured via environment variables
// You can generate new keys with: webpush.generateVAPIDKeys()
// Security: Never hardcode VAPID keys in source code
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:admin@partnerconnector.app";

// Track if push notifications are enabled
let pushNotificationsEnabled = false;

// Check if VAPID keys are configured
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
  const errorMessage = "VAPID keys are not configured. Push notifications will be disabled.";
  logger.warn(errorMessage);
  logger.info("To enable push notifications, set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.");
  logger.info("You can generate new VAPID keys by running: node -e \"const webpush = require('web-push'); const keys = webpush.generateVAPIDKeys(); console.log('VAPID_PUBLIC_KEY=' + keys.publicKey); console.log('VAPID_PRIVATE_KEY=' + keys.privateKey);\"");
  
  // In development, generate temporary keys with a warning
  if (process.env.NODE_ENV === 'development') {
    const tempKeys = webpush.generateVAPIDKeys();
    logger.warn("⚠️  DEVELOPMENT MODE: Using temporary VAPID keys. These should NOT be used in production!");
    logger.warn(`Temporary public key: ${tempKeys.publicKey}`);
    logger.warn(`Temporary private key: ${tempKeys.privateKey}`);
    logger.warn("Please set these as environment variables for persistence across restarts.");
    
    // Use temporary keys for development
    webpush.setVapidDetails(
      VAPID_SUBJECT,
      tempKeys.publicKey,
      tempKeys.privateKey
    );
    pushNotificationsEnabled = true;
  } else {
    // In production, just log a warning and disable push notifications
    logger.warn("⚠️  PRODUCTION MODE: Push notifications are disabled due to missing VAPID keys.");
    logger.warn("Your app will function normally but without push notification capabilities.");
  }
} else {
  // Configure web-push with VAPID keys from environment
  webpush.setVapidDetails(
    VAPID_SUBJECT,
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
  );
  pushNotificationsEnabled = true;
  logger.info("✅ Push notifications are enabled with configured VAPID keys.");
}

// Development mode VAPID key generation (run once to generate keys)
export function generateVapidKeys() {
  const vapidKeys = webpush.generateVAPIDKeys();
  console.log("VAPID Keys Generated:");
  console.log("Public Key:", vapidKeys.publicKey);
  console.log("Private Key:", vapidKeys.privateKey);
  console.log("\nAdd these to your environment variables:");
  console.log(`VAPID_PUBLIC_KEY="${vapidKeys.publicKey}"`);
  console.log(`VAPID_PRIVATE_KEY="${vapidKeys.privateKey}"`);
  return vapidKeys;
}

// Get public VAPID key for client
export function getPublicVapidKey(): string {
  // If push notifications are disabled, return empty string
  if (!pushNotificationsEnabled) {
    return "";
  }
  
  // In development mode with temporary keys, we need to get the key from webpush config
  if (!VAPID_PUBLIC_KEY && process.env.NODE_ENV === 'development') {
    // Return a placeholder or the key that was set during initialization
    // Note: This is a limitation - temporary keys change on each restart
    logger.warn("Using temporary VAPID public key. Configure VAPID_PUBLIC_KEY environment variable for consistency.");
    return "TEMPORARY_KEY_CONFIGURE_ENV_VARS";
  }
  return VAPID_PUBLIC_KEY || "";
}

// Save push subscription to database
export async function savePushSubscription(
  userId: string,
  subscription: webpush.PushSubscription,
  userAgent?: string
): Promise<PushSubscription | null> {
  try {
    const subscriptionData = {
      userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
      userAgent: userAgent || null,
      isActive: true
    };

    // Check if subscription already exists and update it
    const existingSubscription = await storage.getPushSubscriptionByEndpoint(subscription.endpoint);
    
    if (existingSubscription) {
      // Update existing subscription
      const updated = await storage.updatePushSubscription(existingSubscription.id, {
        userId,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: userAgent || null,
        isActive: true
      });
      logger.info(`Updated push subscription for user ${userId}`);
      return updated;
    } else {
      // Create new subscription
      const created = await storage.createPushSubscription(subscriptionData);
      logger.info(`Saved new push subscription for user ${userId}`);
      return created;
    }
  } catch (error) {
    logger.error("Failed to save push subscription:", error);
    return null;
  }
}

// Remove push subscription
export async function removePushSubscription(userId: string, endpoint: string): Promise<boolean> {
  try {
    const subscription = await storage.getPushSubscriptionByEndpoint(endpoint);
    if (subscription && subscription.userId === userId) {
      await storage.deletePushSubscription(subscription.id);
      logger.info(`Removed push subscription for user ${userId}`);
      return true;
    }
    return false;
  } catch (error) {
    logger.error("Failed to remove push subscription:", error);
    return false;
  }
}

// Send push notification to specific user
export async function sendPushNotificationToUser(
  userId: string,
  notification: {
    title: string;
    body: string;
    icon?: string;
    badge?: string;
    data?: any;
    tag?: string;
    requireInteraction?: boolean;
    actions?: Array<{
      action: string;
      title: string;
      icon?: string;
    }>;
  }
): Promise<{ success: boolean; sentCount: number; errors: any[] }> {
  const results = {
    success: false,
    sentCount: 0,
    errors: [] as any[]
  };

  // If push notifications are disabled, return early
  if (!pushNotificationsEnabled) {
    logger.info("Push notifications are disabled. Skipping notification send.");
    return results;
  }

  try {
    // Get all active subscriptions for user
    const subscriptions = await storage.getUserPushSubscriptions(userId);
    
    if (!subscriptions || subscriptions.length === 0) {
      logger.info(`No push subscriptions found for user ${userId}`);
      return results;
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title: notification.title,
      body: notification.body,
      icon: notification.icon || "/icon-192.png",
      badge: notification.badge || "/icon-192.png",
      timestamp: Date.now(),
      tag: notification.tag,
      requireInteraction: notification.requireInteraction || false,
      actions: notification.actions,
      data: {
        ...notification.data,
        userId,
        notificationId: `${Date.now()}_${userId}`
      }
    });

    // Send to all user's subscriptions
    const sendPromises = subscriptions.map(async (sub) => {
      try {
        const pushSubscription: webpush.PushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth
          }
        };

        await webpush.sendNotification(pushSubscription, payload);
        results.sentCount++;
        logger.info(`Push notification sent to user ${userId} at endpoint ${sub.endpoint.substring(0, 50)}...`);
        return true;
      } catch (error: any) {
        logger.error(`Failed to send push notification to endpoint ${sub.endpoint.substring(0, 50)}...`, error);
        
        // If subscription is invalid, mark it as inactive
        if (error.statusCode === 410 || error.statusCode === 404) {
          await storage.updatePushSubscription(sub.id, { isActive: false });
          logger.info(`Marked subscription ${sub.id} as inactive due to ${error.statusCode} error`);
        }
        
        results.errors.push({
          endpoint: sub.endpoint.substring(0, 50),
          error: error.message
        });
        return false;
      }
    });

    await Promise.all(sendPromises);
    results.success = results.sentCount > 0;

    return results;
  } catch (error) {
    logger.error("Failed to send push notifications:", error);
    results.errors.push({ general: (error as Error).message });
    return results;
  }
}

// Send push notification to multiple users
export async function sendPushNotificationToUsers(
  userIds: string[],
  notification: Parameters<typeof sendPushNotificationToUser>[1]
): Promise<{ totalSent: number; totalErrors: number; details: any[] }> {
  const results = {
    totalSent: 0,
    totalErrors: 0,
    details: [] as any[]
  };

  const sendPromises = userIds.map(async (userId) => {
    const result = await sendPushNotificationToUser(userId, notification);
    results.totalSent += result.sentCount;
    results.totalErrors += result.errors.length;
    results.details.push({
      userId,
      ...result
    });
    return result;
  });

  await Promise.all(sendPromises);
  return results;
}

// Send commission approval notification
export async function sendCommissionApprovalNotification(
  userId: string,
  commissionDetails: {
    referralId: string;
    businessName: string;
    amount: number;
    level: number;
    percentage: number;
  }
): Promise<{ success: boolean; sentCount: number; errors: any[] }> {
  const notification = {
    title: "Commission Approved! 🎉",
    body: `Your commission of £${commissionDetails.amount.toFixed(2)} for ${commissionDetails.businessName} has been approved!`,
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: `commission_${commissionDetails.referralId}`,
    requireInteraction: true,
    data: {
      type: "commission_approval",
      referralId: commissionDetails.referralId,
      businessName: commissionDetails.businessName,
      amount: commissionDetails.amount,
      level: commissionDetails.level,
      percentage: commissionDetails.percentage,
      url: `/dashboard?highlight=${commissionDetails.referralId}`
    },
    actions: [
      {
        action: "view",
        title: "View Details",
        icon: "/icon-192.png"
      },
      {
        action: "dismiss",
        title: "Dismiss",
        icon: "/icon-192.png"
      }
    ]
  };

  const result = await sendPushNotificationToUser(userId, notification);
  
  // Also create a notification in the database for persistent record
  try {
    await storage.createNotification({
      userId,
      type: "commission_approval",
      title: notification.title,
      message: notification.body,
      referralId: commissionDetails.referralId,
      businessName: commissionDetails.businessName,
      metadata: {
        amount: commissionDetails.amount,
        level: commissionDetails.level,
        percentage: commissionDetails.percentage
      }
    });
  } catch (error) {
    logger.error("Failed to create database notification:", error);
  }

  return result;
}

// Send test notification (for debugging)
export async function sendTestNotification(userId: string): Promise<{ success: boolean; sentCount: number; errors: any[] }> {
  const notification = {
    title: "Test Notification 🔔",
    body: "This is a test push notification from PartnerConnector. If you see this, push notifications are working!",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: "test",
    data: {
      type: "test",
      timestamp: Date.now()
    }
  };

  return sendPushNotificationToUser(userId, notification);
}

// Export push notification service
export const pushNotificationService = {
  generateVapidKeys,
  getPublicVapidKey,
  savePushSubscription,
  removePushSubscription,
  sendPushNotificationToUser,
  sendPushNotificationToUsers,
  sendCommissionApprovalNotification,
  sendTestNotification
};
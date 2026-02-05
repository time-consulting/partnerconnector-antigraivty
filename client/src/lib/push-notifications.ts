import { apiRequest } from "@/lib/queryClient";

// Convert a base64 string to Uint8Array
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Check if push notifications are supported
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
}

// Check if user has granted notification permission
export function getNotificationPermissionState(): NotificationPermission {
  if (!('Notification' in window)) {
    return 'default';
  }
  return Notification.permission;
}

// Request notification permission from user
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!isPushNotificationSupported()) {
    console.warn('Push notifications are not supported in this browser');
    return 'denied';
  }

  try {
    const permission = await Notification.requestPermission();
    console.log('Notification permission:', permission);
    return permission;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return 'denied';
  }
}

// Get VAPID public key from server
async function getVapidPublicKey(): Promise<string | null> {
  try {
    const response = await fetch('/api/push/vapid-key');
    if (!response.ok) {
      throw new Error('Failed to fetch VAPID public key');
    }
    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error('Error fetching VAPID public key:', error);
    return null;
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications(): Promise<{ success: boolean; subscription?: PushSubscription; error?: string }> {
  try {
    // Check support
    if (!isPushNotificationSupported()) {
      return { success: false, error: 'Push notifications are not supported in this browser' };
    }

    // Check permission
    const permission = await requestNotificationPermission();
    if (permission !== 'granted') {
      return { success: false, error: 'Notification permission denied' };
    }

    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Check if already subscribed
    const existingSubscription = await registration.pushManager.getSubscription();
    if (existingSubscription) {
      console.log('Already subscribed to push notifications');
      // Send to server anyway to ensure it's saved
      await saveSubscriptionToServer(existingSubscription);
      return { success: true, subscription: existingSubscription };
    }

    // Get VAPID public key
    const vapidPublicKey = await getVapidPublicKey();
    if (!vapidPublicKey) {
      return { success: false, error: 'Failed to get VAPID public key' };
    }

    // Subscribe to push notifications
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
    });

    console.log('Push notification subscription created:', subscription);

    // Save subscription to server
    const saved = await saveSubscriptionToServer(subscription);
    if (!saved) {
      // If saving failed, unsubscribe
      await subscription.unsubscribe();
      return { success: false, error: 'Failed to save subscription to server' };
    }

    return { success: true, subscription };
  } catch (error) {
    console.error('Error subscribing to push notifications:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Save subscription to server
async function saveSubscriptionToServer(subscription: PushSubscription): Promise<boolean> {
  try {
    const response = await apiRequest('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify({
        subscription: subscription.toJSON(),
        userAgent: navigator.userAgent
      })
    });

    if (!response.ok) {
      throw new Error('Failed to save subscription to server');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error saving subscription to server:', error);
    return false;
  }
}

// Unsubscribe from push notifications
export async function unsubscribeFromPushNotifications(): Promise<{ success: boolean; error?: string }> {
  try {
    // Get service worker registration
    const registration = await navigator.serviceWorker.ready;

    // Get existing subscription
    const subscription = await registration.pushManager.getSubscription();
    if (!subscription) {
      console.log('No push subscription found');
      return { success: true };
    }

    // Unsubscribe from browser
    const unsubscribed = await subscription.unsubscribe();
    if (!unsubscribed) {
      return { success: false, error: 'Failed to unsubscribe from push notifications' };
    }

    // Remove from server
    const removed = await removeSubscriptionFromServer(subscription.endpoint);
    if (!removed) {
      console.warn('Failed to remove subscription from server');
    }

    console.log('Successfully unsubscribed from push notifications');
    return { success: true };
  } catch (error) {
    console.error('Error unsubscribing from push notifications:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Remove subscription from server
async function removeSubscriptionFromServer(endpoint: string): Promise<boolean> {
  try {
    const response = await apiRequest('/api/push/unsubscribe', {
      method: 'DELETE',
      body: JSON.stringify({ endpoint })
    });

    if (!response.ok) {
      throw new Error('Failed to remove subscription from server');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error removing subscription from server:', error);
    return false;
  }
}

// Check if user is currently subscribed
export async function isSubscribedToPushNotifications(): Promise<boolean> {
  try {
    if (!isPushNotificationSupported()) {
      return false;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    return subscription !== null;
  } catch (error) {
    console.error('Error checking push subscription status:', error);
    return false;
  }
}

// Get current push subscription
export async function getCurrentPushSubscription(): Promise<PushSubscription | null> {
  try {
    if (!isPushNotificationSupported()) {
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    return await registration.pushManager.getSubscription();
  } catch (error) {
    console.error('Error getting current push subscription:', error);
    return null;
  }
}

// Test push notification
export async function sendTestNotification(): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    const response = await apiRequest('/api/push/test', {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error('Failed to send test notification');
    }

    const data = await response.json();
    return { 
      success: data.success, 
      message: data.message,
      error: data.errors ? JSON.stringify(data.errors) : undefined
    };
  } catch (error) {
    console.error('Error sending test notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Get subscription status from server
export async function getSubscriptionStatus(): Promise<{
  isSubscribed: boolean;
  subscriptionCount: number;
  subscriptions: any[];
}> {
  try {
    const response = await fetch('/api/push/status');
    if (!response.ok) {
      throw new Error('Failed to get subscription status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      isSubscribed: false,
      subscriptionCount: 0,
      subscriptions: []
    };
  }
}

// Initialize push notifications (called on app startup)
export async function initializePushNotifications(): Promise<void> {
  if (!isPushNotificationSupported()) {
    console.log('Push notifications are not supported in this browser');
    return;
  }

  try {
    // Register service worker if not already registered
    if (!('serviceWorker' in navigator)) {
      console.log('Service workers are not supported');
      return;
    }

    const registration = await navigator.serviceWorker.register('/service-worker.js');
    console.log('Service Worker registered with scope:', registration.scope);

    // Check if user is already subscribed
    const isSubscribed = await isSubscribedToPushNotifications();
    console.log('Push notification subscription status:', isSubscribed);

    // If permission was previously granted but not subscribed, auto-subscribe
    if (getNotificationPermissionState() === 'granted' && !isSubscribed) {
      console.log('Auto-subscribing to push notifications...');
      await subscribeToPushNotifications();
    }
  } catch (error) {
    console.error('Error initializing push notifications:', error);
  }
}

// Export all functions as a service object
export const pushNotificationService = {
  isPushNotificationSupported,
  getNotificationPermissionState,
  requestNotificationPermission,
  subscribeToPushNotifications,
  unsubscribeFromPushNotifications,
  isSubscribedToPushNotifications,
  getCurrentPushSubscription,
  sendTestNotification,
  getSubscriptionStatus,
  initializePushNotifications
};
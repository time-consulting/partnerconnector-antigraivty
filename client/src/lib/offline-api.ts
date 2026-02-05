// Offline-aware API wrapper for handling network failures gracefully
import { offlineDB, OfflineReferral, OfflineNotification } from './offline-db';
import { syncManager } from './offline-sync';
import { apiRequest as originalApiRequest } from './queryClient';
import { v4 as uuidv4 } from 'uuid';

// Extended response that includes offline metadata
export interface OfflineResponse<T = any> extends Response {
  offlineData?: T;
  isOffline?: boolean;
  fromCache?: boolean;
}

// Options for offline API requests
export interface OfflineApiOptions {
  skipOffline?: boolean; // Skip offline handling for this request
  forceOnline?: boolean; // Fail if offline instead of using cache
  cacheFirst?: boolean; // Try cache first even if online
  saveOffline?: boolean; // Save request to sync queue if offline
}

// Cache for recent API responses
const responseCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      responseCache.delete(key);
    }
  }
}, 60000); // Check every minute

// Helper to create cache key from request
function getCacheKey(method: string, url: string, data?: any): string {
  const key = `${method}:${url}`;
  if (data && (method === 'GET' || method === 'POST')) {
    return `${key}:${JSON.stringify(data)}`;
  }
  return key;
}

// Helper to check if URL is an API endpoint we can cache
function isCacheableEndpoint(url: string): boolean {
  const cacheablePatterns = [
    /^\/api\/deals?/,
    /^\/api\/notifications/,
    /^\/api\/dashboard/,
    /^\/api\/business-types/,
    /^\/api\/commission-approvals/,
    /^\/api\/auth\/user/
  ];
  
  return cacheablePatterns.some(pattern => pattern.test(url));
}

// Helper to check if request can be queued for sync
function isQueueableEndpoint(url: string, method: string): boolean {
  // Only queue mutations (POST, PATCH, DELETE)
  if (method === 'GET') return false;
  
  const queueablePatterns = [
    /^\/api\/deals?/,
    /^\/api\/notifications/,
    /^\/api\/auth\/user/
  ];
  
  return queueablePatterns.some(pattern => pattern.test(url));
}

// Extract entity type from URL
function getEntityFromUrl(url: string): 'deals?' | 'notification' | 'user' | null {
  if (url.includes('/deals?')) return 'deals?';
  if (url.includes('/notifications')) return 'notification';
  if (url.includes('/auth/user')) return 'user';
  return null;
}

// Offline-aware API request wrapper
export async function offlineApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
  options: OfflineApiOptions = {}
): Promise<OfflineResponse> {
  const {
    skipOffline = false,
    forceOnline = false,
    cacheFirst = false,
    saveOffline = true
  } = options;

  // Skip offline handling if requested
  if (skipOffline) {
    return originalApiRequest(method, url, data);
  }

  const cacheKey = getCacheKey(method, url, data);
  const isOnline = navigator.onLine;

  // Try cache first if requested and available
  if (cacheFirst && method === 'GET') {
    const cached = await getFromCache(url);
    if (cached) {
      const response = new Response(JSON.stringify(cached), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }) as OfflineResponse;
      response.offlineData = cached;
      response.fromCache = true;
      return response;
    }
  }

  // If offline and forceOnline is set, throw error
  if (!isOnline && forceOnline) {
    throw new Error('Network request failed: You are offline');
  }

  try {
    // Try the original request
    const response = await originalApiRequest(method, url, data);
    
    // Cache successful GET responses
    if (method === 'GET' && response.ok && isCacheableEndpoint(url)) {
      const responseData = await response.clone().json();
      responseCache.set(cacheKey, {
        data: responseData,
        timestamp: Date.now()
      });
      
      // Also update IndexedDB for persistent offline access
      await updateOfflineCache(url, responseData);
    }
    
    return response;
  } catch (error) {
    // Handle offline scenario
    if (!isOnline || (error instanceof Error && error.message.includes('Failed to fetch'))) {
      console.log(`Offline: Handling ${method} ${url} offline`);
      
      // For GET requests, try to return cached data
      if (method === 'GET') {
        const cachedData = await getFromCache(url);
        if (cachedData) {
          const response = new Response(JSON.stringify(cachedData), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }) as OfflineResponse;
          response.offlineData = cachedData;
          response.isOffline = true;
          response.fromCache = true;
          return response;
        }
      }
      
      // For mutations, queue for sync if enabled
      if (saveOffline && isQueueableEndpoint(url, method)) {
        const entity = getEntityFromUrl(url);
        if (entity) {
          // Extract ID from URL if it's an update/delete
          const urlParts = url.split('/');
          const entityId = urlParts[urlParts.length - 1];
          const isIdPresent = entityId && !entityId.includes('?');
          
          // Queue the action for sync
          await syncManager.queueAction(
            method === 'POST' ? 'create' : method === 'DELETE' ? 'delete' : 'update',
            entity,
            data,
            isIdPresent ? entityId : undefined
          );
          
          // For creates, also save to offline DB immediately
          if (method === 'POST' && entity === 'deals?' && data) {
            const offlineReferral: OfflineReferral = {
              id: uuidv4(),
              ...(data as any),
              createdAt: Date.now(),
              updatedAt: Date.now(),
              synced: false,
              localOnly: true
            };
            
            await offlineDB.saveReferral(offlineReferral);
            
            // Return a mock successful response
            const response = new Response(JSON.stringify(offlineReferral), {
              status: 201,
              headers: { 'Content-Type': 'application/json' }
            }) as OfflineResponse;
            response.offlineData = offlineReferral;
            response.isOffline = true;
            return response;
          }
          
          // Return a mock successful response for other mutations
          const response = new Response(JSON.stringify({ success: true, queued: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }) as OfflineResponse;
          response.isOffline = true;
          return response;
        }
      }
    }
    
    // Re-throw if we can't handle offline
    throw error;
  }
}

// Get data from offline cache
async function getFromCache(url: string): Promise<any> {
  // Check memory cache first
  const cacheKey = getCacheKey('GET', url, undefined);
  const memCached = responseCache.get(cacheKey);
  if (memCached && Date.now() - memCached.timestamp < CACHE_TTL) {
    return memCached.data;
  }
  
  // Check IndexedDB for specific endpoints
  if (url.includes('/api/deals')) {
    const deals = await offlineDB.getAllReferrals();
    if (deals?.length > 0) {
      return deals;
    }
  } else if (url.includes('/api/notifications')) {
    const notifications = await offlineDB.getAllNotifications();
    if (notifications.length > 0) {
      return { notifications };
    }
  } else if (url.includes('/api/auth/user')) {
    const user = await offlineDB.getMetadata('currentUser');
    if (user) {
      return user;
    }
  } else if (url.includes('/api/dashboard/stats')) {
    const stats = await offlineDB.getMetadata('dashboardStats');
    if (stats) {
      return stats;
    }
  } else if (url.includes('/api/business-types')) {
    const types = await offlineDB.getMetadata('businessTypes');
    if (types) {
      return types;
    }
  }
  
  return null;
}

// Update offline cache with fresh data
async function updateOfflineCache(url: string, data: any): Promise<void> {
  try {
    if (url.includes('/api/deals') && Array.isArray(data)) {
      // Convert and save deals
      const offlineReferrals: OfflineReferral[] = data.map(ref => ({
        ...ref,
        id: ref.id || uuidv4(),
        createdAt: ref.createdAt || Date.now(),
        updatedAt: ref.updatedAt || Date.now(),
        synced: true,
        localOnly: false,
        serverId: ref.id
      }));
      
      await offlineDB.bulkSaveReferrals(offlineReferrals);
    } else if (url.includes('/api/notifications')) {
      // Save notifications
      const notificationData = data.notifications || data;
      if (Array.isArray(notificationData)) {
        const offlineNotifications: OfflineNotification[] = notificationData.map(notif => ({
          ...notif,
          id: notif.id || uuidv4(),
          timestamp: notif.timestamp || Date.now(),
          synced: true
        }));
        
        await offlineDB.bulkSaveNotifications(offlineNotifications);
      }
    } else if (url.includes('/api/auth/user')) {
      // Save user data
      await offlineDB.setMetadata('currentUser', data);
    } else if (url.includes('/api/dashboard/stats')) {
      // Save dashboard stats
      await offlineDB.setMetadata('dashboardStats', data);
    } else if (url.includes('/api/business-types')) {
      // Save business types
      await offlineDB.setMetadata('businessTypes', data);
    }
  } catch (error) {
    console.error('Failed to update offline cache:', error);
  }
}

// React Query integration - Enhanced query client
import { QueryClient, QueryFunction } from "@tanstack/react-query";

type UnauthorizedBehavior = "returnNull" | "throw";

export const getOfflineQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const url = queryKey.join("/") as string;
    
    try {
      const res = await offlineApiRequest('GET', url, undefined, {
        cacheFirst: !navigator.onLine // Use cache first when offline
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      if (!res.ok && !(res as OfflineResponse).isOffline) {
        const text = (await res.text()) || res.statusText;
        throw new Error(`${res.status}: ${text}`);
      }

      // If we have offline data, return it directly
      if ((res as OfflineResponse).offlineData) {
        return (res as OfflineResponse).offlineData;
      }

      return await res.json();
    } catch (error) {
      // If offline, try to get cached data
      if (!navigator.onLine) {
        const cachedData = await getFromCache(url);
        if (cachedData) {
          return cachedData;
        }
      }
      throw error;
    }
  };

// Create offline-aware query client
export const offlineQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getOfflineQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: navigator.onLine ? 5 * 60 * 1000 : Infinity, // 5 min when online, infinite when offline
      retry: navigator.onLine ? 1 : false,
      networkMode: 'offlineFirst' // Always attempt, use cache if offline
    },
    mutations: {
      retry: navigator.onLine ? 1 : false,
      networkMode: 'offlineFirst'
    },
  },
});

// Listen for online/offline events to adjust query client
window.addEventListener('online', () => {
  // Refetch all queries when coming back online
  offlineQueryClient.refetchQueries();
});

window.addEventListener('offline', () => {
  // Cancel any in-flight queries when going offline
  offlineQueryClient.cancelQueries();
});

// Export the offline-aware API request as the default
export { offlineApiRequest as apiRequest };
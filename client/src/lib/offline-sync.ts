// Offline sync manager for handling network state and data synchronization
import { useEffect, useState } from 'react';
import { offlineDB, STORES, SyncQueueItem, OfflineReferral, OfflineNotification } from './offline-db';
import { apiRequest } from './queryClient';
import { queryClient } from './queryClient';
import { v4 as uuidv4 } from 'uuid';

// Sync events
export type SyncEvent = 
  | { type: 'online' }
  | { type: 'offline' }
  | { type: 'syncing' }
  | { type: 'syncComplete', count: number }
  | { type: 'syncError', error: string }
  | { type: 'conflict', data: any };

// Sync status
export interface SyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncAt: number | null;
  lastError: string | null;
  conflicts: any[];
}

// Conflict resolution strategies
export type ConflictResolution = 'lastWriteWins' | 'userChoice' | 'merge';

// Sync manager class
class OfflineSyncManager {
  private isOnline: boolean = navigator.onLine;
  private isSyncing: boolean = false;
  private syncInProgress: boolean = false;
  private listeners: Set<(event: SyncEvent) => void> = new Set();
  private syncInterval: number | null = null;
  private conflicts: any[] = [];
  private retryTimeout: number | null = null;
  private maxRetries: number = 3;
  private retryDelay: number = 5000; // Start with 5 seconds

  constructor() {
    this.init();
  }

  private init() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);

    // Check initial state
    this.updateOnlineStatus(navigator.onLine);

    // Start periodic sync check (every 30 seconds when online)
    this.startPeriodicSync();

    // Listen for visibility changes to sync when tab becomes visible
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  private handleOnline = () => {
    console.log('Network status: Online');
    this.updateOnlineStatus(true);
    
    // Only emit connection restored if we were actually offline for a while
    // Don't trigger on every Vite dev server reconnect
    setTimeout(() => {
      if (navigator.onLine) {
        const event = new CustomEvent('connection-restored');
        window.dispatchEvent(event);
      }
    }, 2000); // Wait 2 seconds to avoid Vite flicker
    
    this.syncPendingData();
  };

  private handleOffline = () => {
    console.log('Network status: Offline');
    this.updateOnlineStatus(false);
  };

  private handleVisibilityChange = () => {
    if (document.visibilityState === 'visible' && this.isOnline) {
      // Sync when tab becomes visible and we're online
      this.syncPendingData();
    }
  };

  private updateOnlineStatus(online: boolean) {
    this.isOnline = online;
    this.emit({ type: online ? 'online' : 'offline' });
    
    if (online) {
      // Clear retry timeout when coming online
      if (this.retryTimeout) {
        window.clearTimeout(this.retryTimeout);
        this.retryTimeout = null;
      }
      this.retryDelay = 5000; // Reset retry delay
    }
  }

  private startPeriodicSync() {
    this.syncInterval = window.setInterval(() => {
      if (this.isOnline && !this.syncInProgress) {
        this.syncPendingData();
      }
    }, 30000) as unknown as number;
  }

  // Subscribe to sync events
  subscribe(listener: (event: SyncEvent) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: SyncEvent) {
    this.listeners.forEach(listener => listener(event));
  }

  // Get current sync status
  async getStatus(): Promise<SyncStatus> {
    const pendingCount = await offlineDB.getSyncQueueCount();
    const lastSyncAt = await offlineDB.getMetadata('lastSyncAt');
    const lastError = await offlineDB.getMetadata('lastSyncError');

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount,
      lastSyncAt: lastSyncAt || null,
      lastError: lastError || null,
      conflicts: this.conflicts
    };
  }

  // Queue an action for sync
  async queueAction(
    action: 'create' | 'update' | 'delete',
    entity: 'deal' | 'notification' | 'user',
    data: any,
    entityId?: string
  ): Promise<void> {
    const queueItem: SyncQueueItem = {
      id: uuidv4(),
      action,
      entity,
      entityId,
      data,
      timestamp: Date.now(),
      retryCount: 0
    };

    await offlineDB.addToSyncQueue(queueItem);

    // Try to sync immediately if online
    if (this.isOnline) {
      this.syncPendingData();
    }
  }

  // Main sync function
  async syncPendingData(): Promise<void> {
    if (this.syncInProgress || !this.isOnline) {
      return;
    }

    this.syncInProgress = true;
    this.isSyncing = true;
    this.emit({ type: 'syncing' });

    try {
      // Get all pending items from sync queue
      const queueItems = await offlineDB.getAllSyncQueueItems();
      
      if (queueItems.length === 0) {
        this.syncInProgress = false;
        this.isSyncing = false;
        return;
      }

      let successCount = 0;
      let hasErrors = false;

      // Process each item in the queue
      for (const item of queueItems) {
        try {
          await this.processSyncItem(item);
          await offlineDB.removeSyncQueueItem(item.id);
          successCount++;
        } catch (error) {
          console.error(`Failed to sync item ${item.id}:`, error);
          hasErrors = true;
          
          // Update retry count
          item.retryCount = (item.retryCount || 0) + 1;
          item.error = error instanceof Error ? error.message : String(error);
          
          if (item.retryCount >= this.maxRetries) {
            // Move to conflicts if max retries exceeded
            this.conflicts.push({
              ...item,
              failedAt: Date.now()
            });
            await offlineDB.removeSyncQueueItem(item.id);
          } else {
            // Update the item with error info
            await offlineDB.addToSyncQueue(item);
          }
        }
      }

      // Update metadata
      await offlineDB.setMetadata('lastSyncAt', Date.now());
      if (!hasErrors) {
        await offlineDB.setMetadata('lastSyncError', null);
      }

      // Emit completion event
      this.emit({ type: 'syncComplete', count: successCount });

      // Invalidate React Query cache after successful sync
      if (successCount > 0) {
        queryClient.invalidateQueries({ queryKey: ['/api/deals'] });
        queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      }

      // Schedule retry if there were errors
      if (hasErrors && !this.retryTimeout) {
        this.scheduleRetry();
      }

    } catch (error) {
      console.error('Sync failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await offlineDB.setMetadata('lastSyncError', errorMessage);
      this.emit({ type: 'syncError', error: errorMessage });
      
      // Schedule retry
      this.scheduleRetry();
    } finally {
      this.syncInProgress = false;
      this.isSyncing = false;
    }
  }

  private scheduleRetry() {
    if (this.retryTimeout) {
      window.clearTimeout(this.retryTimeout);
    }

    this.retryTimeout = window.setTimeout(() => {
      this.retryTimeout = null;
      if (this.isOnline) {
        this.syncPendingData();
      }
    }, this.retryDelay) as unknown as number;

    // Exponential backoff
    this.retryDelay = Math.min(this.retryDelay * 2, 60000); // Max 1 minute
  }

  // Process a single sync item
  private async processSyncItem(item: SyncQueueItem): Promise<void> {
    switch (item.entity) {
      case 'deal':
        await this.syncReferral(item);
        break;
      case 'notification':
        await this.syncNotification(item);
        break;
      case 'user':
        await this.syncUser(item);
        break;
      default:
        throw new Error(`Unknown entity type: ${item.entity}`);
    }
  }

  // Sync a deal
  private async syncReferral(item: SyncQueueItem): Promise<void> {
    switch (item.action) {
      case 'create':
        const response = await apiRequest('POST', '/api/deals', item.data);
        const created = await response.json();
        
        // Update local deal with server ID
        if (item.entityId) {
          await offlineDB.markReferralSynced(item.entityId, created.id);
        }
        break;

      case 'update':
        if (!item.entityId) throw new Error('Entity ID required for update');
        
        // Get the server ID if we have it
        const deal = await offlineDB.getReferral(item.entityId);
        const serverId = deal?.serverId || item.entityId;
        
        await apiRequest('PATCH', `/api/deals/${serverId}`, item.data);
        await offlineDB.markReferralSynced(item.entityId);
        break;

      case 'delete':
        if (!item.entityId) throw new Error('Entity ID required for delete');
        
        const dealToDelete = await offlineDB.getReferral(item.entityId);
        const deleteId = dealToDelete?.serverId || item.entityId;
        
        await apiRequest('DELETE', `/api/deals/${deleteId}`);
        await offlineDB.delete(STORES.REFERRALS, item.entityId);
        break;
    }
  }

  // Sync a notification  
  private async syncNotification(item: SyncQueueItem): Promise<void> {
    switch (item.action) {
      case 'update':
        // Mark notification as read on server
        if (item.data.read && item.entityId) {
          await apiRequest('PATCH', `/api/notifications/${item.entityId}/read`);
        }
        break;
      // Notifications are typically read-only from server
      default:
        break;
    }
  }

  // Sync user data
  private async syncUser(item: SyncQueueItem): Promise<void> {
    switch (item.action) {
      case 'update':
        await apiRequest('PATCH', '/api/auth/user', item.data);
        break;
      default:
        break;
    }
  }

  // Manual sync trigger
  async manualSync(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot sync while offline');
    }
    return this.syncPendingData();
  }

  // Resolve a conflict
  async resolveConflict(
    conflictId: string, 
    resolution: ConflictResolution,
    resolvedData?: any
  ): Promise<void> {
    const conflictIndex = this.conflicts.findIndex(c => c.id === conflictId);
    if (conflictIndex === -1) {
      throw new Error('Conflict not found');
    }

    const conflict = this.conflicts[conflictIndex];
    
    switch (resolution) {
      case 'lastWriteWins':
        // Re-queue the action with reset retry count
        conflict.retryCount = 0;
        delete conflict.error;
        await offlineDB.addToSyncQueue(conflict);
        break;

      case 'userChoice':
        // Use user-provided resolved data
        if (resolvedData) {
          conflict.data = resolvedData;
          conflict.retryCount = 0;
          delete conflict.error;
          await offlineDB.addToSyncQueue(conflict);
        }
        break;

      case 'merge':
        // Implement merge logic based on entity type
        // This would need custom logic per entity
        break;
    }

    // Remove from conflicts array
    this.conflicts.splice(conflictIndex, 1);
    
    // Trigger sync
    if (this.isOnline) {
      this.syncPendingData();
    }
  }

  // Clear all conflicts
  clearConflicts(): void {
    this.conflicts = [];
  }

  // Get all conflicts
  getConflicts(): any[] {
    return [...this.conflicts];
  }

  // Clean up
  destroy() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    
    if (this.syncInterval) {
      window.clearInterval(this.syncInterval);
    }
    
    if (this.retryTimeout) {
      window.clearTimeout(this.retryTimeout);
    }
    
    this.listeners.clear();
  }
}

// Export singleton instance
export const syncManager = new OfflineSyncManager();

// React hook for using sync manager
export function useOfflineSync() {
  const [status, setStatus] = useState<SyncStatus>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingCount: 0,
    lastSyncAt: null,
    lastError: null,
    conflicts: []
  });

  useEffect(() => {
    // Get initial status
    syncManager.getStatus().then(setStatus);

    // Subscribe to sync events
    const unsubscribe = syncManager.subscribe(async (event) => {
      const newStatus = await syncManager.getStatus();
      setStatus(newStatus);
    });

    return unsubscribe;
  }, []);

  return {
    ...status,
    manualSync: () => syncManager.manualSync(),
    resolveConflict: (id: string, resolution: ConflictResolution, data?: any) => 
      syncManager.resolveConflict(id, resolution, data),
    clearConflicts: () => syncManager.clearConflicts()
  };
}
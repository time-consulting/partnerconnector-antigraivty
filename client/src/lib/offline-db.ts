// IndexedDB manager for offline data storage
import { z } from 'zod';

// Database configuration
const DB_NAME = 'PartnerConnectorDB';
const DB_VERSION = 1;

// Store names
export const STORES = {
  REFERRALS: 'deals',
  NOTIFICATIONS: 'notifications',
  SYNC_QUEUE: 'syncQueue',
  METADATA: 'metadata'
} as const;

// Sync action types
export type SyncAction = 'create' | 'update' | 'delete';

// Sync queue item schema
export const SyncQueueItemSchema = z.object({
  id: z.string(),
  action: z.enum(['create', 'update', 'delete']),
  entity: z.enum(['deal', 'notification', 'user']),
  entityId: z.string().optional(),
  data: z.any(),
  timestamp: z.number(),
  retryCount: z.number().default(0),
  error: z.string().optional(),
  conflictResolution: z.enum(['lastWriteWins', 'userChoice', 'merge']).optional()
});

export type SyncQueueItem = z.infer<typeof SyncQueueItemSchema>;

// Referral schema for offline storage
export const OfflineReferralSchema = z.object({
  id: z.string(),
  businessName: z.string(),
  contactName: z.string(),
  businessPhone: z.string(),
  businessEmail: z.string().optional(),
  businessTypeId: z.string().optional(),
  notes: z.string().optional(),
  status: z.string().default('pending'),
  gdprConsent: z.boolean().default(true),
  quickAdd: z.boolean().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
  synced: z.boolean().default(false),
  localOnly: z.boolean().default(false),
  serverId: z.string().optional(),
  lastSyncAt: z.number().optional()
});

export type OfflineReferral = z.infer<typeof OfflineReferralSchema>;

// Notification schema for offline storage
export const OfflineNotificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  body: z.string(),
  type: z.string(),
  read: z.boolean().default(false),
  timestamp: z.number(),
  data: z.any().optional(),
  synced: z.boolean().default(false)
});

export type OfflineNotification = z.infer<typeof OfflineNotificationSchema>;

// Metadata schema
export const MetadataSchema = z.object({
  key: z.string(),
  value: z.any(),
  updatedAt: z.number()
});

export type Metadata = z.infer<typeof MetadataSchema>;

class OfflineDB {
  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  // Initialize and open the database
  async init(): Promise<void> {
    if (this.db) return;
    
    if (this.dbPromise) {
      this.db = await this.dbPromise;
      return;
    }

    this.dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        const db = request.result;
        this.db = db;
        console.log('IndexedDB initialized successfully');
        resolve(db);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create deals store
        if (!db.objectStoreNames.contains(STORES.REFERRALS)) {
          const dealsStore = db.createObjectStore(STORES.REFERRALS, { keyPath: 'id' });
          dealsStore.createIndex('synced', 'synced', { unique: false });
          dealsStore.createIndex('status', 'status', { unique: false });
          dealsStore.createIndex('createdAt', 'createdAt', { unique: false });
          dealsStore.createIndex('serverId', 'serverId', { unique: false });
        }

        // Create notifications store
        if (!db.objectStoreNames.contains(STORES.NOTIFICATIONS)) {
          const notificationsStore = db.createObjectStore(STORES.NOTIFICATIONS, { keyPath: 'id' });
          notificationsStore.createIndex('read', 'read', { unique: false });
          notificationsStore.createIndex('timestamp', 'timestamp', { unique: false });
          notificationsStore.createIndex('synced', 'synced', { unique: false });
        }

        // Create sync queue store
        if (!db.objectStoreNames.contains(STORES.SYNC_QUEUE)) {
          const syncStore = db.createObjectStore(STORES.SYNC_QUEUE, { keyPath: 'id' });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('entity', 'entity', { unique: false });
          syncStore.createIndex('action', 'action', { unique: false });
        }

        // Create metadata store
        if (!db.objectStoreNames.contains(STORES.METADATA)) {
          db.createObjectStore(STORES.METADATA, { keyPath: 'key' });
        }
      };
    });

    this.db = await this.dbPromise;
  }

  // Ensure database is initialized
  private async ensureDB(): Promise<IDBDatabase> {
    if (!this.db) {
      await this.init();
    }
    return this.db!;
  }

  // Generic CRUD operations
  async add<T>(storeName: string, data: T): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.add(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, data: T): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, key: string): Promise<T | undefined> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllByIndex<T>(storeName: string, indexName: string, value: any): Promise<T[]> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const index = store.index(indexName);
      const request = index.getAll(value);

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName: string, key: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async count(storeName: string): Promise<number> {
    const db = await this.ensureDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.count();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  // Referral-specific operations
  async saveReferral(deal: OfflineReferral): Promise<void> {
    await this.put(STORES.REFERRALS, deal);
  }

  async getReferral(id: string): Promise<OfflineReferral | undefined> {
    return await this.get<OfflineReferral>(STORES.REFERRALS, id);
  }

  async getAllReferrals(): Promise<OfflineReferral[]> {
    return await this.getAll<OfflineReferral>(STORES.REFERRALS);
  }

  async getUnsyncedReferrals(): Promise<OfflineReferral[]> {
    return await this.getAllByIndex<OfflineReferral>(STORES.REFERRALS, 'synced', false);
  }

  async markReferralSynced(id: string, serverId?: string): Promise<void> {
    const deal = await this.getReferral(id);
    if (deal) {
      deal.synced = true;
      deal.lastSyncAt = Date.now();
      if (serverId) {
        deal.serverId = serverId;
      }
      await this.saveReferral(deal);
    }
  }

  // Notification-specific operations
  async saveNotification(notification: OfflineNotification): Promise<void> {
    await this.put(STORES.NOTIFICATIONS, notification);
  }

  async getNotification(id: string): Promise<OfflineNotification | undefined> {
    return await this.get<OfflineNotification>(STORES.NOTIFICATIONS, id);
  }

  async getAllNotifications(): Promise<OfflineNotification[]> {
    const notifications = await this.getAll<OfflineNotification>(STORES.NOTIFICATIONS);
    // Sort by timestamp descending
    return notifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getUnreadNotifications(): Promise<OfflineNotification[]> {
    return await this.getAllByIndex<OfflineNotification>(STORES.NOTIFICATIONS, 'read', false);
  }

  async markNotificationRead(id: string): Promise<void> {
    const notification = await this.getNotification(id);
    if (notification) {
      notification.read = true;
      await this.saveNotification(notification);
    }
  }

  // Sync queue operations
  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    await this.put(STORES.SYNC_QUEUE, item);
  }

  async getSyncQueueItem(id: string): Promise<SyncQueueItem | undefined> {
    return await this.get<SyncQueueItem>(STORES.SYNC_QUEUE, id);
  }

  async getAllSyncQueueItems(): Promise<SyncQueueItem[]> {
    const items = await this.getAll<SyncQueueItem>(STORES.SYNC_QUEUE);
    // Sort by timestamp ascending (oldest first)
    return items.sort((a, b) => a.timestamp - b.timestamp);
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    await this.delete(STORES.SYNC_QUEUE, id);
  }

  async clearSyncQueue(): Promise<void> {
    await this.clear(STORES.SYNC_QUEUE);
  }

  async getSyncQueueCount(): Promise<number> {
    return await this.count(STORES.SYNC_QUEUE);
  }

  // Metadata operations
  async setMetadata(key: string, value: any): Promise<void> {
    const metadata: Metadata = {
      key,
      value,
      updatedAt: Date.now()
    };
    await this.put(STORES.METADATA, metadata);
  }

  async getMetadata(key: string): Promise<any> {
    const metadata = await this.get<Metadata>(STORES.METADATA, key);
    return metadata?.value;
  }

  // Bulk operations for sync
  async bulkSaveReferrals(deals: OfflineReferral[]): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([STORES.REFERRALS], 'readwrite');
    const store = transaction.objectStore(STORES.REFERRALS);

    for (const deal of deals) {
      store.put(deal);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async bulkSaveNotifications(notifications: OfflineNotification[]): Promise<void> {
    const db = await this.ensureDB();
    const transaction = db.transaction([STORES.NOTIFICATIONS], 'readwrite');
    const store = transaction.objectStore(STORES.NOTIFICATIONS);

    for (const notification of notifications) {
      store.put(notification);
    }

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Clear all offline data
  async clearAll(): Promise<void> {
    await this.clear(STORES.REFERRALS);
    await this.clear(STORES.NOTIFICATIONS);
    await this.clear(STORES.SYNC_QUEUE);
    await this.clear(STORES.METADATA);
  }

  // Close database connection
  close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
      this.dbPromise = null;
    }
  }
}

// Export singleton instance
export const offlineDB = new OfflineDB();

// Initialize on import
if (typeof window !== 'undefined') {
  offlineDB.init().catch(console.error);
}
// Sync status component for displaying offline/online status and sync state
import { useEffect, useState } from 'react';
import { useOfflineSync } from '@/lib/offline-sync';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WifiIcon,
  WifiOffIcon,
  RefreshCwIcon,
  CloudIcon,
  CloudOffIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  InfoIcon,
  XIcon
} from 'lucide-react';

interface SyncStatusProps {
  className?: string;
  showDetails?: boolean;
  compact?: boolean;
}

export default function SyncStatus({ 
  className = '', 
  showDetails = true,
  compact = false 
}: SyncStatusProps) {
  const { toast } = useToast();
  const {
    isOnline,
    isSyncing,
    pendingCount,
    lastSyncAt,
    lastError,
    conflicts,
    manualSync,
    resolveConflict,
    clearConflicts
  } = useOfflineSync();

  const [showConflicts, setShowConflicts] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [isManualSyncing, setIsManualSyncing] = useState(false);

  // Format last sync time
  const formatLastSync = (timestamp: number | null) => {
    if (!timestamp) return 'Never';
    
    const now = Date.now();
    const diff = now - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (seconds > 30) return `${seconds} seconds ago`;
    return 'Just now';
  };

  // Handle manual sync
  const handleManualSync = async () => {
    if (!isOnline) {
      toast({
        title: 'Offline',
        description: 'Cannot sync while offline. Please check your connection.',
        variant: 'destructive'
      });
      return;
    }

    if (isSyncing || isManualSyncing) {
      return;
    }

    setIsManualSyncing(true);
    setSyncProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSyncProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      await manualSync();

      clearInterval(progressInterval);
      setSyncProgress(100);

      toast({
        title: 'Sync Complete',
        description: `Successfully synced ${pendingCount} item${pendingCount !== 1 ? 's' : ''}`,
      });

      setTimeout(() => setSyncProgress(0), 1000);
    } catch (error) {
      toast({
        title: 'Sync Failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsManualSyncing(false);
    }
  };

  // Handle conflict resolution
  const handleResolveConflict = async (conflictId: string, resolution: 'lastWriteWins' | 'discard') => {
    try {
      if (resolution === 'discard') {
        // Just remove from conflicts without retrying
        clearConflicts();
      } else {
        await resolveConflict(conflictId, resolution);
      }
      
      toast({
        title: 'Conflict Resolved',
        description: 'The conflict has been resolved successfully',
      });
      
      setShowConflicts(false);
    } catch (error) {
      toast({
        title: 'Resolution Failed',
        description: 'Failed to resolve conflict',
        variant: 'destructive'
      });
    }
  };

  // Get status color
  const getStatusColor = () => {
    if (!isOnline) return 'text-red-500';
    if (isSyncing || isManualSyncing) return 'text-yellow-500';
    if (pendingCount > 0) return 'text-orange-500';
    if (lastError) return 'text-red-500';
    return 'text-green-500';
  };

  // Get status icon
  const getStatusIcon = () => {
    if (!isOnline) return <WifiOffIcon className="w-4 h-4" />;
    if (isSyncing || isManualSyncing) {
      return (
        <RefreshCwIcon className="w-4 h-4 animate-spin" />
      );
    }
    if (pendingCount > 0) return <CloudIcon className="w-4 h-4" />;
    if (lastError) return <AlertCircleIcon className="w-4 h-4" />;
    return <WifiIcon className="w-4 h-4" />;
  };

  // Compact mode - just an icon
  if (compact) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button 
            className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${className}`}
            data-testid="button-sync-status"
          >
            <div className={`flex items-center space-x-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              {pendingCount > 0 && (
                <span className="text-xs font-medium">{pendingCount}</span>
              )}
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <SyncStatusDetails
            isOnline={isOnline}
            isSyncing={isSyncing || isManualSyncing}
            pendingCount={pendingCount}
            lastSyncAt={lastSyncAt}
            lastError={lastError}
            conflicts={conflicts}
            syncProgress={syncProgress}
            onManualSync={handleManualSync}
            onShowConflicts={() => setShowConflicts(true)}
            formatLastSync={formatLastSync}
          />
        </PopoverContent>
      </Popover>
    );
  }

  // Full status display
  return (
    <>
      <Card className={`p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <div className={getStatusColor()}>
              {getStatusIcon()}
            </div>
            <h3 className="font-semibold">Sync Status</h3>
          </div>
          <Badge variant={isOnline ? 'default' : 'destructive'}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
        </div>

        {showDetails && (
          <SyncStatusDetails
            isOnline={isOnline}
            isSyncing={isSyncing || isManualSyncing}
            pendingCount={pendingCount}
            lastSyncAt={lastSyncAt}
            lastError={lastError}
            conflicts={conflicts}
            syncProgress={syncProgress}
            onManualSync={handleManualSync}
            onShowConflicts={() => setShowConflicts(true)}
            formatLastSync={formatLastSync}
          />
        )}
      </Card>

      {/* Conflicts Modal */}
      <AnimatePresence>
        {showConflicts && conflicts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowConflicts(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Sync Conflicts ({conflicts.length})</h2>
                <button
                  onClick={() => setShowConflicts(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                  data-testid="button-close-conflicts"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {conflicts.map((conflict: any) => (
                  <Card key={conflict.id} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-medium">{conflict.entity}</p>
                        <p className="text-sm text-gray-500">{conflict.action}</p>
                      </div>
                      <Badge variant="destructive">Failed</Badge>
                    </div>
                    
                    {conflict.error && (
                      <p className="text-sm text-red-600 mb-3">{conflict.error}</p>
                    )}

                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => handleResolveConflict(conflict.id, 'lastWriteWins')}
                      >
                        Retry
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleResolveConflict(conflict.id, 'discard')}
                      >
                        Discard
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Sync status details component
function SyncStatusDetails({
  isOnline,
  isSyncing,
  pendingCount,
  lastSyncAt,
  lastError,
  conflicts,
  syncProgress,
  onManualSync,
  onShowConflicts,
  formatLastSync
}: any) {
  return (
    <div className="space-y-3">
      {/* Sync progress */}
      {syncProgress > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-sm">
            <span>Syncing...</span>
            <span>{syncProgress}%</span>
          </div>
          <Progress value={syncProgress} className="h-2" />
        </div>
      )}

      {/* Status info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-500">Pending sync:</span>
          <span className="font-medium">
            {pendingCount} item{pendingCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-500">Last sync:</span>
          <span className="font-medium flex items-center space-x-1">
            <ClockIcon className="w-3 h-3" />
            <span>{formatLastSync(lastSyncAt)}</span>
          </span>
        </div>

        {conflicts.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Conflicts:</span>
            <button
              onClick={onShowConflicts}
              className="font-medium text-red-600 hover:underline"
              data-testid="button-view-conflicts"
            >
              {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''}
            </button>
          </div>
        )}

        {lastError && (
          <div className="p-2 bg-red-50 rounded-md">
            <p className="text-xs text-red-600 flex items-start space-x-1">
              <AlertCircleIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>{lastError}</span>
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant={isOnline ? 'default' : 'secondary'}
          disabled={!isOnline || isSyncing || pendingCount === 0}
          onClick={onManualSync}
          className="flex-1"
          data-testid="button-manual-sync"
        >
          {isSyncing ? (
            <>
              <RefreshCwIcon className="w-4 h-4 mr-1 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCwIcon className="w-4 h-4 mr-1" />
              Sync Now
            </>
          )}
        </Button>
      </div>

      {/* Offline notice */}
      {!isOnline && (
        <div className="p-3 bg-yellow-50 rounded-md">
          <p className="text-xs text-yellow-800 flex items-start space-x-1">
            <InfoIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
            <span>
              You're offline. Changes will be saved locally and synced when you reconnect.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function OfflinePage() {
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [cachedPages, setCachedPages] = useState<string[]>([]);

  useEffect(() => {
    // Check for cached pages
    if ('caches' in window) {
      caches.open('partner-connector-v1').then(cache => {
        cache.keys().then(requests => {
          const pages = requests
            .filter(req => {
              const url = new URL(req.url);
              return url.pathname !== '/' && 
                     !url.pathname.includes('.') &&
                     !url.pathname.startsWith('/api/');
            })
            .map(req => new URL(req.url).pathname);
          setCachedPages(pages);
        });
      });
    }
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    setLastChecked(new Date());

    try {
      const response = await fetch('/api/health', {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      if (response.ok) {
        // Connection restored - show success message instead of auto-reloading
        // User can manually refresh if needed
        const event = new CustomEvent('connection-restored');
        window.dispatchEvent(event);
      }
    } catch (error) {
      // Still offline
      console.log('Still offline');
    } finally {
      setIsChecking(false);
    }
  };

  const formatLastChecked = () => {
    if (!lastChecked) return '';
    const seconds = Math.floor((new Date().getTime() - lastChecked.getTime()) / 1000);
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'over an hour ago';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <Card className="border-2 shadow-xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
              <WifiOff className="h-10 w-10 text-orange-600 dark:text-orange-400" />
            </div>
            <CardTitle className="text-2xl">You're Offline</CardTitle>
            <CardDescription className="text-lg mt-2">
              It looks like you've lost your internet connection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
              <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-sm">
                Don't worry! PartnerConnector works offline. You can still access cached content and your work will sync when you're back online.
              </AlertDescription>
            </Alert>

            {cachedPages.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Available offline pages:
                </p>
                <div className="flex flex-wrap gap-2">
                  {cachedPages.map(page => (
                    <Button
                      key={page}
                      variant="outline"
                      size="sm"
                      onClick={() => window.location.href = page}
                      data-testid={`button-cached-page-${page}`}
                    >
                      {page.replace('/', '').replace('-', ' ') || 'Home'}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <Button 
                onClick={checkConnection}
                disabled={isChecking}
                className="w-full"
                size="lg"
                data-testid="button-retry-connection"
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Checking connection...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Check Connection
                  </>
                )}
              </Button>

              {lastChecked && (
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Last checked: {formatLastChecked()}
                </p>
              )}
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-2 text-sm">What can you do offline?</h3>
              <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>View previously loaded pages</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Access cached partner information</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Review commission structures</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Work will sync when reconnected</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400">
          Your data is safe and will automatically sync once you're back online
        </p>
      </div>
    </div>
  );
}
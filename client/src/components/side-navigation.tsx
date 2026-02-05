import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  Home,
  Users, 
  Plus,
  GraduationCap,
  Settings,
  ChevronLeft,
  ChevronRight,
  Contact,
  Target,
  ClipboardList,
  FileText,
  Wallet
} from "lucide-react";

export default function SideNavigation() {
  const [location] = useLocation();
  const { isAuthenticated } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path: string) => location === path;

  // Don't show side navigation if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  const navigationItems = [
    {
      icon: Home,
      label: "Dashboard",
      path: "/dashboard",
      testId: "sidenav-dashboard"
    },
    {
      icon: Contact,
      label: "Contacts", 
      path: "/contacts",
      testId: "sidenav-contacts"
    },
    {
      icon: Target,
      label: "Opportunities", 
      path: "/opportunities",
      testId: "sidenav-opportunities"
    },
    {
      icon: Plus,
      label: "Submit Deal",
      path: "/submit-deal", 
      testId: "sidenav-submit-deals"
    },
    {
      icon: ClipboardList,
      label: "Track Submissions",
      path: "/track-deals",
      testId: "sidenav-track-submissions"
    },
    {
      icon: FileText,
      label: "Quotes",
      path: "/quotes",
      testId: "sidenav-quotes"
    },
    {
      icon: Users,
      label: "Team",
      path: "/team-management",
      testId: "sidenav-team"
    },
    {
      icon: Wallet,
      label: "Commissions",
      path: "/commissions",
      testId: "sidenav-commissions"
    },
    {
      icon: GraduationCap,
      label: "Training",
      path: "/training",
      testId: "sidenav-training"
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/account/profile",
      testId: "sidenav-settings"
    }
  ];

  return (
    <div 
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg border-r border-gray-200 z-40 transition-all duration-300 ease-in-out hidden lg:block ${
        isExpanded ? 'w-64' : 'w-16'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      data-testid="side-navigation"
    >
      {/* Header/Toggle */}
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-center text-gray-600 hover:text-blue-600 transition-colors"
          data-testid="button-toggle-sidenav"
        >
          {isExpanded ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="mt-4">
        <ul className="space-y-2 px-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div 
                    className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                      active 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
                    }`}
                    data-testid={item.testId}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {isExpanded && (
                      <span className="font-medium text-sm whitespace-nowrap overflow-hidden">
                        {item.label}
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
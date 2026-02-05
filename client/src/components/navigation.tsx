import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  ChevronDownIcon, 
  UsersIcon, 
  TrendingUpIcon, 
  DollarSignIcon, 
  BookOpenIcon,
  ShieldCheckIcon,
  BarChart3Icon,
  HeadphonesIcon,
  FileTextIcon,
  PlayCircleIcon,
  NetworkIcon,
  TargetIcon,
  GraduationCapIcon,
  HelpCircleIcon,
  User,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Shield,
  MessageSquare,
  Activity,
  Menu,
  X,
  Home
} from "lucide-react";

export default function Navigation() {
  let location = "/";
  try {
    [location] = useLocation();
  } catch (error) {
    console.warn("Navigation: useLocation failed, using fallback", error);
  }
  
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  
  // Prevent navigation flashing during auth check - show public navigation during loading
  const showAuthenticatedNav = !isLoading && isAuthenticated;
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  const handleDropdownToggle = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleDropdownClose = () => {
    setOpenDropdown(null);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null); // Close any open dropdowns
  };

  const handleMobileMenuClose = () => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="flex items-center cursor-pointer" data-testid="link-logo">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                    <NetworkIcon className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-xl font-bold text-gray-900">
                    PartnerConnector
                  </h1>
                </div>
              </Link>
            </div>
            
            {!showAuthenticatedNav && (
              <div className="hidden lg:flex items-center space-x-8">
                {/* For Partners Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => handleDropdownToggle('partners')}
                    data-testid="dropdown-partners"
                  >
                    For Partners
                    <ChevronDownIcon className="ml-1 w-4 h-4" />
                  </button>
                  
                  {openDropdown === 'partners' && (
                    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-6 px-6 z-50">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">GET STARTED</h3>
                          <div className="space-y-3">
                            <Link href="/partner-onboarding">
                              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <UsersIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">Partner Onboarding</h4>
                                  <p className="text-sm text-gray-600">Learn how to get started and maximize earnings</p>
                                </div>
                              </div>
                            </Link>
                            <Link href="/commission-structure">
                              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                  <DollarSignIcon className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">Commission Structure</h4>
                                  <p className="text-sm text-gray-600">Understand our multi-tier payment system</p>
                                </div>
                              </div>
                            </Link>
                            <Link href="/lead-tracking">
                              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                  <BarChart3Icon className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">Lead Tracking</h4>
                                  <p className="text-sm text-gray-600">Track your deals from submission to payout</p>
                                </div>
                              </div>
                            </Link>
                          </div>
                        </div>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">PARTNER TOOLS</h3>
                          <div className="grid grid-cols-2 gap-3">
                            <Link href="/partner-portal">
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                                <span className="text-sm text-gray-700">Partner Portal</span>
                              </div>
                            </Link>
                            <Link href="/team-management">
                              <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <UsersIcon className="w-4 h-4 text-green-600" />
                                <span className="text-sm text-gray-700">Team Management</span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* For Vendors Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => handleDropdownToggle('vendors')}
                    data-testid="dropdown-vendors"
                  >
                    For Vendors
                    <ChevronDownIcon className="ml-1 w-4 h-4" />
                  </button>
                  
                  {openDropdown === 'vendors' && (
                    <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 py-6 px-6 z-50">
                      <div className="grid grid-cols-1 gap-4">
                        <div className="mb-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-2">PLATFORM FEATURES</h3>
                          <div className="space-y-3">
                            <Link href="/partner-recruitment">
                              <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                  <TargetIcon className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">Partner Recruitment</h4>
                                  <p className="text-sm text-gray-600">Find and onboard high-quality partners</p>
                                </div>
                              </div>
                            </Link>
                            <Link href="/program-management" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Program Management</h4>
                                <p className="text-sm text-gray-600">Manage your entire partner ecosystem</p>
                              </div>
                            </Link>
                            <Link href="/analytics-reporting" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BarChart3Icon className="w-5 h-5 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">Analytics & Reporting</h4>
                                <p className="text-sm text-gray-600">Track performance and optimize programs</p>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Resources Dropdown */}
                <div className="relative">
                  <button
                    className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                    onClick={() => handleDropdownToggle('resources')}
                    data-testid="dropdown-resources"
                  >
                    Resources
                    <ChevronDownIcon className="ml-1 w-4 h-4" />
                  </button>
                  
                  {openDropdown === 'resources' && (
                    <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-6 px-6 z-50">
                      <div className="grid grid-cols-1 gap-3">
                        <Link href="/help-center" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <HeadphonesIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Help Center</h4>
                            <p className="text-sm text-gray-600">Get support and find answers</p>
                          </div>
                        </Link>
                        {/* Quick Tour link - shown when tour was skipped */}
                        {typeof window !== 'undefined' && localStorage.getItem('tour_skipped') && (
                          <button
                            onClick={() => {
                              // Clear skip flag and reload to restart tour
                              localStorage.removeItem('tour_skipped');
                              localStorage.removeItem('tour_completed');
                              window.location.reload();
                            }}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer w-full text-left"
                            data-testid="button-quick-tour"
                          >
                            <PlayCircleIcon className="w-5 h-5 text-green-600 mt-0.5" />
                            <div>
                              <h4 className="font-medium text-gray-900">Quick tour</h4>
                              <p className="text-sm text-gray-600">Take a 20-second tour of your dashboard</p>
                            </div>
                          </button>
                        )}
                        <Link href="/training" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <GraduationCapIcon className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Training Center</h4>
                            <p className="text-sm text-gray-600">Interactive modules and onboarding</p>
                          </div>
                        </Link>
                        <Link href="/api-docs" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <FileTextIcon className="w-5 h-5 text-purple-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">API Documentation</h4>
                            <p className="text-sm text-gray-600">Developer resources and guides</p>
                          </div>
                        </Link>
                        <Link href="/webinars" className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <PlayCircleIcon className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">Webinars & Events</h4>
                            <p className="text-sm text-gray-600">Live training and networking events</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* About Us Link */}
                <Link href="/about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
                  About Us
                </Link>
              </div>
            )}

            {/* Desktop navigation links are hidden for authenticated users - using sidebar instead */}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Help Icon - visible on desktop and tablet */}
            <Link href="/help-center" 
              className="hidden md:inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors hover:bg-gray-100 h-9 w-9 text-gray-600 hover:text-blue-600"
              data-testid="button-help"
            >
              <HelpCircleIcon className="w-5 h-5" />
            </Link>
            
            {/* Notifications Bell - for authenticated users only */}
            {showAuthenticatedNav && (
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-600 hover:bg-gray-100 h-9 w-9 p-0 relative"
                data-testid="button-notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </Button>
            )}
            
            {/* Mobile Menu Button - mobile only */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-600 hover:text-blue-600 hover:bg-gray-100 h-9 w-9 p-0"
              onClick={handleMobileMenuToggle}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            
            {showAuthenticatedNav ? (
              <div className="relative ml-2">
                <button
                  className="flex items-center text-gray-700 hover:text-blue-600 hover:bg-gray-100 rounded-md px-3 py-2 text-sm font-medium transition-colors gap-2"
                  onClick={() => handleDropdownToggle('account')}
                  data-testid="dropdown-account"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="hidden sm:inline">{(user as any)?.firstName || 'Account'}</span>
                  <ChevronDownIcon className="w-4 h-4" />
                </button>
                
                {openDropdown === 'account' && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-200 py-6 px-6 z-[9999]">
                    <div className="space-y-4">
                      {/* User Info Section */}
                      <div className="border-b border-gray-200 pb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{(user as any)?.firstName} {(user as any)?.lastName}</h4>
                            <p className="text-sm text-gray-600">{(user as any)?.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Dashboard Quick Access */}
                      <div className="border-b border-gray-200 pb-4">
                        <Link href="/dashboard">
                          <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all cursor-pointer">
                            <Home className="w-5 h-5" />
                            <div>
                              <h4 className="font-medium">Go to Dashboard</h4>
                              <p className="text-xs text-blue-100">Manage your deals and earnings</p>
                            </div>
                          </div>
                        </Link>
                      </div>

                      {/* User Settings */}
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 mb-3">ACCOUNT SETTINGS</h3>
                        <div className="space-y-2">
                          <Link href="/account/profile">
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <Settings className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Personal Information</span>
                            </div>
                          </Link>
                          <Link href="/account/banking">
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <CreditCard className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Banking Details</span>
                            </div>
                          </Link>
                          <Link href="/account/feedback">
                            <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                              <MessageSquare className="w-4 h-4 text-gray-600" />
                              <span className="text-sm text-gray-700">Feedback & Support</span>
                            </div>
                          </Link>
                        </div>
                      </div>

                      {/* Admin Section - only for d.skeats@gmail.com */}
                      {(user as any)?.email === 'd.skeats@gmail.com' && (
                        <div className="border-t border-gray-200 pt-4">
                          <h3 className="text-sm font-semibold text-gray-900 mb-3">ADMIN PORTAL</h3>
                          <div className="space-y-2">
                            <Link href="/admin">
                              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <Shield className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-gray-700">System Administration</span>
                              </div>
                            </Link>
                            <Link href="/admin/diagnostics">
                              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                                <Activity className="w-4 h-4 text-red-600" />
                                <span className="text-sm text-gray-700">System Diagnostics</span>
                              </div>
                            </Link>
                          </div>
                        </div>
                      )}

                      {/* Logout Section */}
                      <div className="border-t border-gray-200 pt-4">
                        <Button 
                          variant="ghost" 
                          onClick={logout}
                          data-testid="button-logout"
                          className="w-full justify-start text-gray-700 hover:bg-gray-50 p-2"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  onClick={() => window.location.href = "/login"}
                  data-testid="button-login"
                  className="text-gray-700 hover:text-blue-600"
                >
                  Login
                </Button>
                <Button 
                  onClick={() => window.location.href = "/login"}
                  data-testid="button-get-started"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Get started
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[100] sm:hidden"
          onClick={handleMobileMenuClose}
        />
      )}

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-[101] sm:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center mr-2">
                <NetworkIcon className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">PartnerConnector</h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-blue-600 p-1"
              onClick={handleMobileMenuClose}
              data-testid="button-close-mobile-menu"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          {/* Mobile Menu Content */}
          <div className="flex-1 overflow-y-auto">
            {isAuthenticated ? (
              /* Authenticated Mobile Menu */
              <div className="py-4">
                {/* User Info */}
                <div className="px-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{(user as any)?.firstName} {(user as any)?.lastName}</h4>
                      <p className="text-sm text-gray-600">{(user as any)?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Main Navigation */}
                <div className="space-y-1 px-4 mb-6">
                  <Link href="/" onClick={handleMobileMenuClose}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`} data-testid="mobile-link-dashboard">
                      <TrendingUpIcon className="w-5 h-5" />
                      <span className="font-medium">Dashboard</span>
                    </div>
                  </Link>
                  <Link href="/opportunities" onClick={handleMobileMenuClose}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/opportunities') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`} data-testid="mobile-link-opportunities">
                      <BarChart3Icon className="w-5 h-5" />
                      <span className="font-medium">Opportunities</span>
                    </div>
                  </Link>
                  <Link href="/submit-deal" onClick={handleMobileMenuClose}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/submit-deal') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`} data-testid="mobile-link-submit-deals">
                      <UsersIcon className="w-5 h-5" />
                      <span className="font-medium">Submit Deal</span>
                    </div>
                  </Link>
                  <Link href="/team-management" onClick={handleMobileMenuClose}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/team-management') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`} data-testid="mobile-link-team-management">
                      <UsersIcon className="w-5 h-5" />
                      <span className="font-medium">Team</span>
                    </div>
                  </Link>
                  <Link href="/training" onClick={handleMobileMenuClose}>
                    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                      isActive('/training') ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                    }`} data-testid="mobile-link-training">
                      <GraduationCapIcon className="w-5 h-5" />
                      <span className="font-medium">Training</span>
                    </div>
                  </Link>
                  <Link href="/help-center" onClick={handleMobileMenuClose}>
                    <div className="flex items-center gap-3 p-3 rounded-lg transition-colors text-gray-700 hover:bg-gray-50" data-testid="mobile-link-help-center">
                      <HelpCircleIcon className="w-5 h-5" />
                      <span className="font-medium">Help Center</span>
                    </div>
                  </Link>
                </div>

                {/* Account Section */}
                <div className="border-t border-gray-200 pt-4 px-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">ACCOUNT</h3>
                  <div className="space-y-1">
                    <Link href="/account/profile" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Settings className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Personal Information</span>
                      </div>
                    </Link>
                    <Link href="/account/banking" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Banking Details</span>
                      </div>
                    </Link>
                    <Link href="/account/feedback" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <MessageSquare className="w-4 h-4 text-gray-600" />
                        <span className="text-sm text-gray-700">Feedback & Support</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Admin Section - only for d.skeats@gmail.com */}
                {(user as any)?.email === 'd.skeats@gmail.com' && (
                  <div className="border-t border-gray-200 pt-4 px-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-3">ADMIN</h3>
                    <div className="space-y-1">
                      <Link href="/admin" onClick={handleMobileMenuClose}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <Shield className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">System Administration</span>
                        </div>
                      </Link>
                      <Link href="/admin/diagnostics" onClick={handleMobileMenuClose}>
                        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <Activity className="w-4 h-4 text-red-600" />
                          <span className="text-sm text-gray-700">System Diagnostics</span>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}

                {/* Logout Section */}
                <div className="border-t border-gray-200 pt-4 px-4">
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      logout();
                      handleMobileMenuClose();
                    }}
                    data-testid="mobile-button-logout"
                    className="w-full justify-start text-gray-700 hover:bg-gray-50 p-3"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              /* Non-authenticated Mobile Menu */
              <div className="py-4">
                {/* For Partners Section */}
                <div className="px-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">FOR PARTNERS</h3>
                  <div className="space-y-2">
                    <Link href="/partner-onboarding" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <UsersIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Partner Onboarding</h4>
                          <p className="text-xs text-gray-600">Get started and maximize earnings</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/commission-structure" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <DollarSignIcon className="w-5 h-5 text-green-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Commission Structure</h4>
                          <p className="text-xs text-gray-600">Multi-tier payment system</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/lead-tracking" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <BarChart3Icon className="w-5 h-5 text-purple-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Lead Tracking</h4>
                          <p className="text-xs text-gray-600">Track deals to payout</p>
                        </div>
                      </div>
                    </Link>
                    <Link href="/partner-portal" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <TrendingUpIcon className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-gray-700">Partner Portal</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* For Vendors Section */}
                <div className="border-t border-gray-200 pt-4 px-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">FOR VENDORS</h3>
                  <div className="space-y-2">
                    <Link href="/partner-recruitment" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <TargetIcon className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">Partner Recruitment</h4>
                          <p className="text-xs text-gray-600">Find quality partners</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Resources Section */}
                <div className="border-t border-gray-200 pt-4 px-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">RESOURCES</h3>
                  <div className="space-y-2">
                    <Link href="/help-center" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <HeadphonesIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700">Help Center</span>
                      </div>
                    </Link>
                    <Link href="/training" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <GraduationCapIcon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700">Training Center</span>
                      </div>
                    </Link>
                    <Link href="/about" onClick={handleMobileMenuClose}>
                      <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <FileTextIcon className="w-5 h-5 text-purple-600" />
                        <span className="text-sm text-gray-700">About Us</span>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Login Section */}
                <div className="border-t border-gray-200 pt-4 px-4">
                  <div className="space-y-2">
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        window.location.href = "/login";
                        handleMobileMenuClose();
                      }}
                      data-testid="mobile-button-login"
                      className="w-full justify-start text-gray-700 hover:bg-gray-50 p-3"
                    >
                      Login
                    </Button>
                    <Button 
                      onClick={() => {
                        window.location.href = "/login";
                        handleMobileMenuClose();
                      }}
                      data-testid="mobile-button-get-started"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3"
                    >
                      Get started
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop dropdown overlay */}
      {openDropdown && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={handleDropdownClose}
        />
      )}

      {/* Click outside to close dropdowns */}
      {openDropdown && (
        <div 
          className="fixed inset-0 z-30 hidden lg:block"
          onClick={handleDropdownClose}
        />
      )}

      {/* Floating Action Button for Mobile - Submit Deal */}
      {isAuthenticated && (
        <div className="fixed bottom-6 right-6 sm:hidden z-50">
          <Link href="/submit-deal">
            <Button
              size="lg"
              className="h-14 w-14 rounded-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              data-testid="button-floating-submit"
            >
              <div className="flex flex-col items-center">
                <UsersIcon className="w-6 h-6" />
              </div>
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
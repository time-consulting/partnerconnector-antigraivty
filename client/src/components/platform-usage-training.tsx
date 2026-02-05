import { useState, type ReactNode } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  LayoutDashboardIcon,
  UsersIcon,
  BriefcaseIcon,
  SendIcon,
  ActivityIcon,
  DollarSignIcon,
  UserPlusIcon,
  SmartphoneIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  LightbulbIcon,
  TargetIcon,
  ClockIcon,
  TrendingUpIcon
} from "lucide-react";

interface Section {
  id: string;
  title: string;
  icon: ReactNode;
  description: string;
  image: string;
  keyPoints: string[];
  details: string[];
}

export default function PlatformUsageTraining() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [showKeyPoints, setShowKeyPoints] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const sections: Section[] = [
    {
      id: "dashboard",
      title: "Dashboard Overview",
      icon: <LayoutDashboardIcon className="w-6 h-6" />,
      description: "Your central hub for monitoring performance, tracking deals, and accessing quick actions.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      keyPoints: [
        "View real-time statistics on deals submitted, commissions pending, and total deals",
        "Access quick actions to submit deals, track deals, and view payout history",
        "Monitor your progress with visual charts and metrics",
        "Stay engaged with weekly tasks and daily suggestions"
      ],
      details: [
        "The dashboard is designed to give you a complete overview at a glance. When you log in, you'll see snapshot cards showing your key metrics.",
        "The Action Hub provides one-click access to common tasks like submitting new deals or inviting team members.",
        "The Engagement Feed keeps you motivated with personalized tasks and suggestions based on your activity.",
        "Use the dashboard as your starting point each session to stay informed about your performance."
      ]
    },
    {
      id: "contacts",
      title: "Managing Contacts",
      icon: <UsersIcon className="w-6 h-6" />,
      description: "Build and organize your client database for easy access and opportunity tracking.",
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&auto=format&fit=crop",
      keyPoints: [
        "Add new contacts with business name, contact person, email, and phone details",
        "Organize contacts by business type and monthly card volume",
        "Quick search and filter to find specific clients",
        "Track which contacts have open opportunities or completed deals"
      ],
      details: [
        "The Contacts section is your personal CRM. You can add clients manually as you meet them during your regular accounting or consulting work.",
        "Store essential information like business details, contact preferences, and notes about their payment processing needs.",
        "Use contacts as the foundation for creating opportunities - when a client shows interest, you can quickly convert them to an active opportunity.",
        "Keep your contact list organized for future reference and follow-ups."
      ]
    },
    {
      id: "opportunities",
      title: "Opportunities Section",
      icon: <BriefcaseIcon className="w-6 h-6" />,
      description: "Track potential deals and manage your sales pipeline for payment processing opportunities.",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop",
      keyPoints: [
        "Create opportunities for clients interested in Dojo payment solutions",
        "Track opportunity stage from initial contact to quote sent",
        "Add notes about client requirements and preferences",
        "Monitor estimated commission value for each opportunity"
      ],
      details: [
        "Opportunities represent potential deals that haven't been formally submitted yet. Use this section to track clients who have shown interest.",
        "You can record details about what products they're interested in (card machines, business funding, etc.) and their specific needs.",
        "As you gather more information, update the opportunity stage to reflect progress.",
        "When ready, you can submit the opportunity as a formal deal for specialist partner review."
      ]
    },
    {
      id: "submission",
      title: "Deal Submission Process",
      icon: <SendIcon className="w-6 h-6" />,
      description: "Submit client deals for review and quote generation by specialist partners.",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&auto=format&fit=crop",
      keyPoints: [
        "Submit deals using the simple 3-stage mobile-first form",
        "Provide client business details, contact information, and address",
        "Select Dojo products they need (card machines, business funding, etc.)",
        "Upload supporting documents like payment processing bills",
        "Deals are sent to specialist partners for review and quote generation"
      ],
      details: [
        "When you submit a deal, it goes through our specialist partner review process. These experts assess the client's needs and prepare accurate quotes.",
        "You don't need to be a payment processing expert - just provide the basic client information and product interest.",
        "The submission form is designed to be completed quickly, even on mobile devices.",
        "Once submitted, you can track the deal status in your dashboard and receive notifications as it progresses.",
        "Specialist partners handle all technical aspects, pricing negotiations, and quote preparation - you just make the introduction."
      ]
    },
    {
      id: "tracking",
      title: "Tracking Referrals",
      icon: <ActivityIcon className="w-6 h-6" />,
      description: "Monitor the status of all your submitted deals in real-time.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop",
      keyPoints: [
        "View all submitted deals with current status (Submitted, Under Review, Quote Sent, Won, Lost)",
        "See which deals are awaiting specialist partner review",
        "Track when quotes have been sent to clients",
        "Monitor deal outcomes and commission status",
        "Filter and search through your deals history"
      ],
      details: [
        "The tracking system keeps you informed at every stage of the deals process.",
        "You'll see when a deal moves from 'Submitted' to 'Under Review' as specialist partners begin their assessment.",
        "When a quote is sent to your client, the status updates to 'Quote Sent' - this is a good time to follow up with them.",
        "If the client accepts and signs up, the deal moves to 'Won' and commission is calculated.",
        "You can review historical data to understand which types of deals convert best."
      ]
    },
    {
      id: "commissions",
      title: "Commission Tracking",
      icon: <DollarSignIcon className="w-6 h-6" />,
      description: "View your earnings, payment history, and commission breakdown.",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&auto=format&fit=crop",
      keyPoints: [
        "See total commissions earned and pending amounts",
        "View detailed breakdown by deal and product type",
        "Track payment history with dates and amounts",
        "Monitor monthly earning trends",
        "Export commission reports for your records"
      ],
      details: [
        "Commissions are calculated based on the products your clients sign up for and their transaction volumes.",
        "You earn recurring commissions on card payment processing as long as the client remains active.",
        "Business funding deals generate one-time commission payments.",
        "The commission dashboard shows both confirmed earnings and pending amounts awaiting payment processing.",
        "Payment histories help you reconcile your records and plan your finances."
      ]
    },
    {
      id: "team",
      title: "Team Management",
      icon: <UserPlusIcon className="w-6 h-6" />,
      description: "Build your network and earn override commissions from your team's deals.",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop",
      keyPoints: [
        "Invite colleagues and business contacts to join as partners",
        "Earn 20% override commission on direct team members (Level 2)",
        "Earn 10% override on extended network (Level 3)",
        "View team performance and hierarchy",
        "Share your unique deals link for easy sign-ups"
      ],
      details: [
        "Building a team creates passive income through override commissions on their deals.",
        "Your direct invites are Level 2 - you earn 20% of their commissions without reducing their earnings.",
        "When your Level 2 partners invite others (Level 3), you earn 10% of those commissions.",
        "Use your unique deals link to invite accountants, bookkeepers, business consultants, or financial advisors.",
        "The platform tracks all relationships automatically, ensuring you receive proper credit for your network."
      ]
    },
    {
      id: "mobile",
      title: "Mobile Features",
      icon: <SmartphoneIcon className="w-6 h-6" />,
      description: "Use the platform on-the-go with mobile-optimized features and quick actions.",
      image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop",
      keyPoints: [
        "Access full platform functionality from your phone or tablet",
        "Use Quick Add feature for 30-second lead capture",
        "Receive push notifications for deal status updates",
        "Works offline with automatic sync when reconnected",
        "Progressive Web App - install on home screen like a native app"
      ],
      details: [
        "The mobile experience is optimized for quick actions when you're meeting clients or on the move.",
        "The Quick Add floating button lets you capture leads in seconds with just essential details.",
        "Push notifications keep you informed about quote approvals, deal wins, and commission payments.",
        "Offline mode means you can view contacts and add leads even without internet connection.",
        "Install the app to your home screen for instant access without opening a browser."
      ]
    }
  ];

  const currentSection = sections.find(s => s.id === activeSection) || sections[0];
  const progress = (completedSections.length / sections.length) * 100;

  const handleMarkComplete = () => {
    if (!completedSections.includes(activeSection)) {
      setCompletedSections([...completedSections, activeSection]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full">
          <UsersIcon className="w-6 h-6" />
          <span className="font-semibold text-lg">Platform Usage Training</span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Learn how to use every feature of the PartnerConnector platform to maximize your success
        </p>
      </div>

      {/* Progress Tracker */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Training Progress
            </span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {completedSections.length} of {sections.length} sections completed
            </span>
          </div>
          <Progress value={progress} className="h-3" data-testid="platform-training-progress" />
        </CardContent>
      </Card>

      {/* Navigation Pills */}
      <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {sections.map((section) => (
            <Button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              variant={activeSection === section.id ? "default" : "outline"}
              className={`flex-shrink-0 ${
                activeSection === section.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  : "hover:bg-gray-100 dark:hover:bg-slate-700"
              }`}
              data-testid={`section-nav-${section.id}`}
            >
              <span className="mr-2">{section.icon}</span>
              <span className="whitespace-nowrap">{section.title}</span>
              {completedSections.includes(section.id) && (
                <CheckCircleIcon className="w-4 h-4 ml-2 text-green-400" />
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white dark:bg-slate-800 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                {currentSection.icon}
              </div>
              <div>
                <CardTitle className="text-2xl mb-2">{currentSection.title}</CardTitle>
                <p className="text-blue-100 text-sm">{currentSection.description}</p>
              </div>
            </div>
            {completedSections.includes(activeSection) && (
              <Badge className="bg-green-500 text-white border-0">
                <CheckCircleIcon className="w-4 h-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Featured Image */}
          <div className="rounded-xl overflow-hidden shadow-lg">
            <img
              src={currentSection.image}
              alt={currentSection.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop";
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => setShowKeyPoints(true)}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              data-testid="button-key-points"
            >
              <LightbulbIcon className="w-4 h-4 mr-2" />
              View Key Points
            </Button>
            <Button
              onClick={() => setShowDetails(true)}
              className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
              data-testid="button-details"
            >
              <TargetIcon className="w-4 h-4 mr-2" />
              Learn More
            </Button>
            {!completedSections.includes(activeSection) && (
              <Button
                onClick={handleMarkComplete}
                variant="outline"
                className="flex-1 min-w-[200px] border-2 border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                data-testid="button-mark-complete"
              >
                <CheckCircleIcon className="w-4 h-4 mr-2" />
                Mark as Complete
              </Button>
            )}
          </div>

          {/* Quick Overview */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-5 border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <ClockIcon className="w-5 h-5 text-blue-600" />
              Quick Overview
            </h4>
            <ul className="space-y-2">
              {currentSection.keyPoints.slice(0, 2).map((point, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <ArrowRightIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => {
                const currentIdx = sections.findIndex(s => s.id === activeSection);
                if (currentIdx > 0) setActiveSection(sections[currentIdx - 1].id);
              }}
              variant="outline"
              disabled={sections.findIndex(s => s.id === activeSection) === 0}
              data-testid="button-previous"
            >
              Previous Section
            </Button>
            <Button
              onClick={() => {
                const currentIdx = sections.findIndex(s => s.id === activeSection);
                if (currentIdx < sections.length - 1) setActiveSection(sections[currentIdx + 1].id);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              disabled={sections.findIndex(s => s.id === activeSection) === sections.length - 1}
              data-testid="button-next"
            >
              Next Section
              <ArrowRightIcon className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Points Modal */}
      <Dialog open={showKeyPoints} onOpenChange={setShowKeyPoints}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <LightbulbIcon className="w-6 h-6 text-blue-600" />
              {currentSection.title} - Key Points
            </DialogTitle>
            <DialogDescription>
              Essential information to remember about this feature
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {currentSection.keyPoints.map((point, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
              >
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {idx + 1}
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 pt-0.5">{point}</p>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <TargetIcon className="w-6 h-6 text-purple-600" />
              {currentSection.title} - Detailed Information
            </DialogTitle>
            <DialogDescription>
              In-depth guide to using this feature effectively
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {currentSection.details.map((detail, idx) => (
              <div
                key={idx}
                className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
              >
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{detail}</p>
              </div>
            ))}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800 mt-6">
              <div className="flex items-start gap-3">
                <TrendingUpIcon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h5 className="font-semibold text-gray-900 dark:text-white mb-2">Pro Tip</h5>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Practice using this feature with test data first to build confidence before working with real client information.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowRightIcon,
  StarIcon,
  CheckIcon,
  TrendingUpIcon,
  UsersIcon,
  DollarSignIcon,
  ShieldCheckIcon,
  Menu,
  X,
  Home,
  ChevronDown,
  UserPlus,
  BarChart3
} from "lucide-react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import heroVideo from "@assets/generated_videos/professional_office_saas_video.mp4";

const rotatingWords = [
  "& EARN MORE",
  "& BUILD TEAMS", 
  "& GET PAID",
  "& GROW FAST"
];

export default function Landing() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [formStep, setFormStep] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPartnerDropdownOpen, setIsPartnerDropdownOpen] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const showAuthenticatedHero = !isLoading && isAuthenticated;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleEmailStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setFormStep(2);
    }
  };

  const handleNameStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (name) {
      window.location.href = `/signup?email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}`;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a1014' }}>
      {/* Simplified Dark Navigation - Exact GetRocket Style */}
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ backgroundColor: 'rgba(10, 16, 20, 0.9)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link href="/">
              <div className="flex items-center cursor-pointer">
                <span className="text-2xl font-bold text-white tracking-tight" style={{ letterSpacing: '0.05em' }}>
                  PARTNER<span style={{ color: '#00d4aa' }}>•</span>
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center space-x-10">
              <div 
                className="relative"
                onMouseEnter={() => setIsPartnerDropdownOpen(true)}
                onMouseLeave={() => setIsPartnerDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-gray-300 hover:text-white text-sm font-medium tracking-wider transition-colors">
                  FOR PARTNERS
                  <ChevronDown className={`w-4 h-4 transition-transform ${isPartnerDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isPartnerDropdownOpen && (
                  <div 
                    className="absolute top-full left-0 mt-2 w-72 rounded-xl shadow-2xl py-4 z-50"
                    style={{ backgroundColor: '#1a2228', border: '1px solid rgba(255,255,255,0.1)' }}
                  >
                    <Link href="/partner-onboarding">
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(0,212,170,0.15)' }}>
                          <UserPlus className="w-5 h-5" style={{ color: '#00d4aa' }} />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">Partner Onboarding</div>
                          <div className="text-gray-400 text-xs">Learn how to get started and maximize earnings</div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/commission-structure">
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.15)' }}>
                          <DollarSignIcon className="w-5 h-5" style={{ color: '#22c55e' }} />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">Commission Structure</div>
                          <div className="text-gray-400 text-xs">Understand our multi-tier payment system</div>
                        </div>
                      </div>
                    </Link>
                    <Link href="/lead-tracking">
                      <div className="flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(59,130,246,0.15)' }}>
                          <BarChart3 className="w-5 h-5" style={{ color: '#3b82f6' }} />
                        </div>
                        <div>
                          <div className="text-white font-medium text-sm">Lead Tracking</div>
                          <div className="text-gray-400 text-xs">Track your deals from submission to payout</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )}
              </div>
              <Link href="/login" className="text-gray-300 hover:text-white text-sm font-medium tracking-wider transition-colors">
                LOGIN
              </Link>
              <Link href="/signup">
                <Button 
                  className="text-sm font-semibold px-6 py-2 rounded-full transition-all tracking-wider"
                  style={{ 
                    backgroundColor: 'transparent', 
                    border: '2px solid #00d4aa', 
                    color: '#00d4aa'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#00d4aa';
                    e.currentTarget.style.color = '#0a1014';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#00d4aa';
                  }}
                >
                  GET STARTED FREE
                </Button>
              </Link>
            </div>

            <button 
              className="md:hidden text-white p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden px-4 py-6 space-y-4" style={{ backgroundColor: '#0a1014', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-xs font-semibold text-gray-500 tracking-wider mb-2">FOR PARTNERS</div>
            <Link href="/partner-onboarding" className="block text-gray-300 hover:text-white text-sm font-medium py-2 tracking-wider">
              Partner Onboarding
            </Link>
            <Link href="/commission-structure" className="block text-gray-300 hover:text-white text-sm font-medium py-2 tracking-wider">
              Commission Structure
            </Link>
            <Link href="/lead-tracking" className="block text-gray-300 hover:text-white text-sm font-medium py-2 tracking-wider">
              Lead Tracking
            </Link>
            <div className="border-t border-white/10 my-3"></div>
            <Link href="/login" className="block text-gray-300 hover:text-white text-sm font-medium py-2 tracking-wider">
              LOGIN
            </Link>
            <Link href="/signup">
              <Button 
                className="w-full font-semibold rounded-full"
                style={{ backgroundColor: '#00d4aa', color: '#0a1014' }}
              >
                GET STARTED FREE
              </Button>
            </Link>
          </div>
        )}
      </nav>

      {/* Authenticated User Quick Access */}
      {showAuthenticatedHero && (
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Video Background */}
          <div className="absolute inset-0 overflow-hidden">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,16,20,0.7), rgba(10,16,20,0.6), rgba(10,16,20,0.95))' }}></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto px-4 text-center pt-20">
            <div className="inline-block mb-8 px-5 py-2 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <span className="text-sm font-semibold tracking-widest" style={{ color: '#00d4aa' }}>
                WELCOME BACK, {((user as any)?.firstName || 'PARTNER').toUpperCase()}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-none" style={{ letterSpacing: '-0.02em' }}>
              READY TO MANAGE
            </h1>
            <h2 className="text-5xl md:text-7xl font-black mb-8 leading-none" style={{ color: '#00d4aa', letterSpacing: '-0.02em' }}>
              YOUR SUCCESS?
            </h2>
            
            <p className="text-lg text-gray-300 mb-10 max-w-xl mx-auto leading-relaxed">
              Access your dashboard to track deals, monitor commissions, and manage your growing partner network.
            </p>

            <Link href="/dashboard">
              <Button 
                size="lg" 
                className="px-12 py-7 text-lg font-bold rounded-full shadow-2xl"
                style={{ backgroundColor: '#22c55e', color: 'white' }}
              >
                <Home className="mr-3 w-5 h-5" />
                GO TO DASHBOARD
                <ArrowRightIcon className="ml-3 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      )}

      {/* Hero Section for Non-Authenticated Users - Exact GetRocket Style */}
      {!showAuthenticatedHero && (
        <section className="relative min-h-screen flex items-center justify-center">
          {/* Video Background */}
          <div className="absolute inset-0 overflow-hidden">
            <video 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(10,16,20,0.6), rgba(10,16,20,0.5), rgba(10,16,20,0.95))' }}></div>
          </div>
          
          <div className="relative max-w-5xl mx-auto px-4 text-center py-20">
            {/* Category Badge */}
            <div className="inline-block mb-10 px-5 py-2 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <span className="text-xs sm:text-sm font-semibold tracking-widest" style={{ color: '#00d4aa' }}>
                PARTNER EARNINGS PLATFORM
              </span>
            </div>
            
            {/* Main Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white mb-2 leading-none" style={{ letterSpacing: '-0.02em' }}>
              CONNECT CLIENTS
            </h1>
            
            {/* Animated Rotating Text */}
            <div className="h-20 sm:h-24 md:h-32 flex items-center justify-center overflow-hidden mb-8">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentWordIndex}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -60, opacity: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="text-5xl sm:text-6xl md:text-8xl font-black leading-none"
                  style={{ color: '#00d4aa', letterSpacing: '-0.02em' }}
                >
                  {rotatingWords[currentWordIndex]}
                </motion.h2>
              </AnimatePresence>
            </div>
            
            {/* Subheadline */}
            <p className="text-base sm:text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
              Your clients already need payment and funding solutions. Connect them with the services they want and get paid for every partnership.
            </p>

            {/* Lead Capture Form - Animated Two-Step */}
            <div className="max-w-xl mx-auto mb-8">
              <AnimatePresence mode="wait">
                {formStep === 1 ? (
                  <motion.form
                    key="email-step"
                    initial={{ opacity: 0, x: 0 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onSubmit={handleEmailStep}
                  >
                    <div 
                      className="flex items-center rounded-full p-2"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      <span className="pl-4 text-2xl">👋</span>
                      <Input
                        type="email"
                        placeholder="Enter your email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4"
                        style={{ backgroundColor: 'transparent' }}
                        required
                      />
                      <Button 
                        type="submit"
                        className="px-8 py-3 font-bold rounded-full text-sm"
                        style={{ backgroundColor: '#22c55e', color: 'white' }}
                      >
                        DO IT <ArrowRightIcon className="ml-2 w-4 h-4 inline" />
                      </Button>
                    </div>
                  </motion.form>
                ) : (
                  <motion.form
                    key="name-step"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onSubmit={handleNameStep}
                  >
                    <div 
                      className="flex items-center rounded-full p-2"
                      style={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      <span className="pl-4 text-2xl">👤</span>
                      <Input
                        type="text"
                        placeholder="What's your name?"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="flex-1 bg-transparent border-0 text-white placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 text-base px-4"
                        style={{ backgroundColor: 'transparent' }}
                        autoFocus
                        required
                      />
                      <Button 
                        type="submit"
                        className="px-8 py-3 font-bold rounded-full text-sm"
                        style={{ backgroundColor: '#22c55e', color: 'white' }}
                      >
                        LET'S GO <ArrowRightIcon className="ml-2 w-4 h-4 inline" />
                      </Button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-sm text-gray-400">
              <span>*Trusted by 500+ partners</span>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[1,2,3,4,5].map((i) => (
                    <StarIcon key={i} className="w-4 h-4 fill-current" style={{ color: '#fbbf24' }} />
                  ))}
                </div>
                <span className="font-semibold text-white">4.9/5 stars</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24" style={{ backgroundColor: '#0a1014' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-block mb-6 px-5 py-2 rounded-full" style={{ backgroundColor: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }}>
              <span className="text-xs font-semibold tracking-widest" style={{ color: '#00d4aa' }}>
                PARTNERSHIP SOLUTIONS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Build your business through <br className="hidden md:block" />strategic partnerships
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              Connect your clients with payment and funding solutions while earning substantial commissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                icon: UsersIcon, 
                title: "Connect Clients", 
                desc: "Match clients with payment solutions", 
                color: '#00d4aa',
                expandedTitle: "Trusted Partner Referrals",
                expandedContent: "Your clients already trust you with their business. When you recommend our payment and funding solutions, they're far more likely to take action because it comes from someone they know and respect. You become their go-to advisor for financial services.",
                expandedBullets: ["Clients prefer working with trusted advisors", "Seamless handoff to our expert team", "You stay informed throughout the process"]
              },
              { 
                icon: DollarSignIcon, 
                title: "Earn 60%", 
                desc: "Industry-leading commission rates", 
                color: '#22c55e',
                expandedTitle: "Maximum Earnings Potential",
                expandedContent: "Our commission structure is designed to reward your efforts. Start at 60% commission on every deal you refer, plus earn additional overrides from your team's performance. The more you build, the more you earn.",
                expandedBullets: ["60% minimum commission on all referrals", "Earn overrides on team member deals", "Weekly payouts directly to your account"]
              },
              { 
                icon: TrendingUpIcon, 
                title: "Build Team", 
                desc: "Grow your network and earnings", 
                color: '#a855f7',
                expandedTitle: "Multi-Level Team Building",
                expandedContent: "Create a network of partners and earn from their success too. When you invite others to join, you'll earn override commissions on their referrals - plus overrides on THEIR team members' deals, up to 3 levels deep.",
                expandedBullets: ["Earn 20% override on Level 1 partners", "10% override on Level 2 partners", "5% override on Level 3 partners"]
              },
              { 
                icon: ShieldCheckIcon, 
                title: "Full Support", 
                desc: "Training and resources provided", 
                color: '#fbbf24',
                expandedTitle: "Complete Training & Support",
                expandedContent: "We don't just sign you up and leave you to figure it out. Our comprehensive training program ensures you understand every aspect of our solutions, and our dedicated support team is always available to help you succeed.",
                expandedBullets: ["Step-by-step onboarding training", "Marketing materials & resources", "Dedicated partner success manager"]
              },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                layout
                className="rounded-2xl p-8 text-center cursor-pointer overflow-hidden"
                style={{ 
                  backgroundColor: expandedCard === i ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)', 
                  border: `1px solid ${expandedCard === i ? `${feature.color}60` : 'rgba(255,255,255,0.08)'}`
                }}
                onClick={() => setExpandedCard(expandedCard === i ? null : i)}
                whileHover={{ scale: expandedCard === i ? 1 : 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <feature.icon className="w-8 h-8" style={{ color: feature.color }} />
                </div>
                <h3 className="font-semibold text-white text-xl mb-3">{feature.title}</h3>
                <p className="text-gray-400 mb-2">{feature.desc}</p>
                
                <AnimatePresence>
                  {expandedCard === i && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 text-left" style={{ borderTop: `1px solid ${feature.color}30` }}>
                        <h4 className="font-semibold text-lg mb-3" style={{ color: feature.color }}>{feature.expandedTitle}</h4>
                        <p className="text-gray-300 text-sm leading-relaxed mb-4">{feature.expandedContent}</p>
                        <ul className="space-y-2">
                          {feature.expandedBullets.map((bullet, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-400">
                              <CheckIcon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: feature.color }} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <motion.div 
                  className="mt-4 text-xs font-medium tracking-wide"
                  style={{ color: feature.color }}
                  animate={{ opacity: expandedCard === i ? 0.5 : 1 }}
                >
                  {expandedCard === i ? 'TAP TO COLLAPSE' : 'TAP TO LEARN MORE'}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "£1.2M+", label: "Commissions Paid" },
              { value: "500+", label: "Active Partners" },
              { value: "60%", label: "Commission Rate" },
              { value: "24/7", label: "Support Available" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold mb-3" style={{ color: '#00d4aa' }}>{stat.value}</div>
                <div className="text-sm text-gray-400 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24" style={{ backgroundColor: '#0c1418' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="inline-block mb-6 px-5 py-2 rounded-full" style={{ backgroundColor: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)' }}>
                <span className="text-xs font-semibold tracking-widest" style={{ color: '#22c55e' }}>
                  WHY CHOOSE US
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
                Everything you need to succeed
              </h2>
              <p className="text-lg text-gray-400 mb-10">
                Our platform provides all the tools and support you need to build a thriving referral business.
              </p>
              
              <div className="space-y-5">
                {[
                  "Industry-leading 60% commission rates",
                  "Fast weekly payouts to your account",
                  "Full training and onboarding support",
                  "Real-time dashboard to track your earnings",
                  "Multi-level team building opportunities"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34,197,94,0.2)' }}>
                      <CheckIcon className="w-4 h-4" style={{ color: '#22c55e' }} />
                    </div>
                    <span className="text-gray-300 text-lg">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-5">
              {[
                { icon: ShieldCheckIcon, title: "Secure", desc: "Bank-level security" },
                { icon: TrendingUpIcon, title: "Growth", desc: "3x average earnings" },
                { icon: UsersIcon, title: "Network", desc: "500+ active partners" },
                { icon: DollarSignIcon, title: "ROI", desc: "250% average return" },
              ].map((card, i) => (
                <div 
                  key={i}
                  className="rounded-2xl p-8 text-center"
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)'
                  }}
                >
                  <card.icon className="w-12 h-12 mx-auto mb-4" style={{ color: '#00d4aa' }} />
                  <h3 className="font-semibold text-white text-lg mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-400">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.1), rgba(34,197,94,0.1))' }}></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Ready to start earning?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join hundreds of professionals already earning commissions through our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/signup">
              <Button 
                size="lg"
                className="px-12 py-7 text-lg font-bold rounded-full shadow-2xl"
                style={{ backgroundColor: '#22c55e', color: 'white' }}
              >
                GET STARTED FREE
                <ArrowRightIcon className="ml-3 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/book-demo">
              <Button 
                variant="outline"
                size="lg"
                className="px-12 py-7 text-lg font-semibold rounded-full"
                style={{ border: '2px solid rgba(255,255,255,0.3)', color: 'white', backgroundColor: 'transparent' }}
              >
                BOOK A DEMO
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20" style={{ backgroundColor: '#070a0c', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
            <div>
              <h3 className="text-white font-semibold mb-5 tracking-wider text-sm">PLATFORM</h3>
              <ul className="space-y-3">
                <li><Link href="/pricing" className="text-gray-400 hover:text-white text-sm transition-colors">Pricing</Link></li>
                <li><Link href="/features" className="text-gray-400 hover:text-white text-sm transition-colors">Features</Link></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white text-sm transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-5 tracking-wider text-sm">RESOURCES</h3>
              <ul className="space-y-3">
                <li><Link href="/help-center" className="text-gray-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
                <li><Link href="/training" className="text-gray-400 hover:text-white text-sm transition-colors">Training</Link></li>
                <li><Link href="/book-demo" className="text-gray-400 hover:text-white text-sm transition-colors">Book Demo</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-5 tracking-wider text-sm">COMPANY</h3>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white text-sm transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white text-sm transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-5 tracking-wider text-sm">LEGAL</h3>
              <ul className="space-y-3">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-10 flex flex-col md:flex-row justify-between items-center gap-6" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-white tracking-tight">
                PARTNER<span style={{ color: '#00d4aa' }}>•</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              © 2026 PartnerConnector. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <StarIcon key={i} className="w-4 h-4 fill-current" style={{ color: '#fbbf24' }} />
                ))}
              </div>
              <span className="text-gray-400 text-sm">4.9/5 from 500+ partners</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

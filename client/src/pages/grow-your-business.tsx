import { useState } from "react";
import Sidebar from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Rocket,
    Users,
    Mail,
    Calendar,
    BarChart3,
    MessageSquare,
    Globe,
    Bot,
    Phone,
    ArrowRight,
    CheckCircle2,
    Sparkles,
    Zap,
    Star,
    TrendingUp,
    Shield,
    Clock,
    Layers,
    ChevronRight,
    ExternalLink,
} from "lucide-react";
import { motion } from "framer-motion";

const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
};

const features = [
    {
        icon: Users,
        title: "CRM & Pipeline Management",
        description: "Manage all your contacts, leads, and deals in one place. Track every interaction, automate follow-ups, and never let a lead slip through the cracks.",
        replaces: "HubSpot, Salesforce, Pipedrive",
        color: "from-blue-500 to-cyan-500",
        highlight: "£89/mo saved",
    },
    {
        icon: Mail,
        title: "Email Marketing",
        description: "Beautiful email campaigns, drip sequences, and newsletters. Segment your audience, A/B test subject lines, and track opens and clicks in real time.",
        replaces: "Mailchimp, ConvertKit, ActiveCampaign",
        color: "from-rose-500 to-pink-500",
        highlight: "£49/mo saved",
    },
    {
        icon: MessageSquare,
        title: "SMS & WhatsApp Marketing",
        description: "Reach customers where they are. Send bulk SMS, WhatsApp messages, and two-way conversations from a unified inbox.",
        replaces: "Twilio, TextMagic, WhatsApp Business",
        color: "from-green-500 to-emerald-500",
        highlight: "£39/mo saved",
    },
    {
        icon: Calendar,
        title: "Booking & Scheduling",
        description: "Online booking calendars with automated confirmations, reminders, and rescheduling. Sync with Google Calendar and Outlook.",
        replaces: "Calendly, Acuity, Square Appointments",
        color: "from-purple-500 to-violet-500",
        highlight: "£15/mo saved",
    },
    {
        icon: Globe,
        title: "Website & Funnel Builder",
        description: "Drag-and-drop website and landing page builder with conversion-optimised templates. Build sales funnels, membership sites, and more.",
        replaces: "ClickFunnels, Wix, WordPress",
        color: "from-amber-500 to-orange-500",
        highlight: "£97/mo saved",
    },
    {
        icon: Bot,
        title: "AI Voice Agents & Chatbots",
        description: "Deploy AI-powered voice agents and chatbots that answer calls, book appointments, and qualify leads 24/7 — even when you're closed.",
        replaces: "Intercom, Drift, AI phone services",
        color: "from-violet-500 to-fuchsia-500",
        highlight: "£149/mo saved",
    },
    {
        icon: BarChart3,
        title: "Analytics & Reporting",
        description: "Real-time dashboards tracking revenue, leads, conversion rates, ad spend ROI, and customer lifetime value across all channels.",
        replaces: "Google Analytics, Databox, custom dashboards",
        color: "from-teal-500 to-cyan-500",
        highlight: "£29/mo saved",
    },
    {
        icon: Phone,
        title: "Reputation Management",
        description: "Automatically request and respond to Google reviews, monitor your online reputation, and turn happy customers into 5-star advocates.",
        replaces: "Trustpilot, Podium, Birdeye",
        color: "from-yellow-500 to-amber-500",
        highlight: "£59/mo saved",
    },
    {
        icon: Layers,
        title: "Business Automations",
        description: "Visual workflow builder to automate repetitive tasks — lead nurturing, invoice reminders, follow-ups, internal notifications, and more.",
        replaces: "Zapier, Make, manual processes",
        color: "from-indigo-500 to-blue-500",
        highlight: "£29/mo saved",
    },
];

const stats = [
    { value: "10+", label: "Tools Replaced", icon: Layers },
    { value: "£500+", label: "Monthly Savings", icon: TrendingUp },
    { value: "24/7", label: "AI Working For You", icon: Clock },
    { value: "100%", label: "White-Labelled", icon: Shield },
];

const testimonials = [
    {
        quote: "Rocket replaced 6 different tools for us. We went from spending £400/month on software to one platform that does it all.",
        name: "James T.",
        role: "Estate Agent, London",
        stars: 5,
    },
    {
        quote: "The AI voice agent alone paid for itself in the first week. We're booking 3x more appointments without hiring anyone.",
        name: "Sarah M.",
        role: "Salon Owner, Manchester",
        stars: 5,
    },
    {
        quote: "Setting up automated follow-ups took 20 minutes. We've seen a 40% increase in repeat bookings since we started.",
        name: "Raj P.",
        role: "Restaurant Owner, Birmingham",
        stars: 5,
    },
];

export default function GrowYourBusiness() {
    const [sidebarExpanded, setSidebarExpanded] = useState(false);

    const totalSaved = features.reduce((sum, f) => {
        const match = f.highlight.match(/£(\d+)/);
        return sum + (match ? parseInt(match[1]) : 0);
    }, 0);

    return (
        <div className="flex min-h-screen bg-[#0a0a0f]">
            <Sidebar onExpandChange={setSidebarExpanded} />
            <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "ml-64" : "ml-20"}`}>
                {/* Hero Section */}
                <section className="relative overflow-hidden">
                    {/* Animated background gradients */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
                        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-fuchsia-600/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
                    </div>

                    <div className="relative max-w-6xl mx-auto px-6 pt-20 pb-16">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="text-center"
                        >
                            <motion.div variants={fadeIn} className="mb-6">
                                <Badge className="bg-violet-500/20 text-violet-300 border-violet-500/30 px-4 py-1.5 text-sm">
                                    <Sparkles className="w-4 h-4 mr-2" />
                                    Replace 10+ Tools With One Platform
                                </Badge>
                            </motion.div>

                            <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight">
                                Grow Your Business{" "}
                                <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                                    with Rocket
                                </span>
                            </motion.h1>

                            <motion.p variants={fadeIn} className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                                Stop paying for 10 different tools that don't talk to each other.{" "}
                                <span className="text-white font-medium">Rocket</span> gives you CRM, email marketing, SMS, AI voice agents,
                                booking systems, website builder, automations, and more —{" "}
                                <span className="text-violet-400 font-semibold">all in one platform</span>.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-6 text-lg font-bold rounded-xl shadow-2xl shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-105"
                                    onClick={() => window.open('https://app.gorocket.uk', '_blank')}
                                >
                                    <Rocket className="w-5 h-5 mr-2" />
                                    Apply for Free Trial
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                                <p className="text-sm text-gray-500">
                                    No credit card required • 14-day free trial
                                </p>
                            </motion.div>

                            {/* Stats bar */}
                            <motion.div
                                variants={fadeIn}
                                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                            >
                                {stats.map((stat) => (
                                    <div
                                        key={stat.label}
                                        className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center"
                                    >
                                        <stat.icon className="w-5 h-5 text-violet-400 mx-auto mb-2" />
                                        <div className="text-2xl font-black text-white">{stat.value}</div>
                                        <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* "What You're Currently Paying For" comparison */}
                <section className="relative py-16 border-t border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeIn} className="text-center mb-12">
                                <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                                    One Platform.{" "}
                                    <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                                        Unlimited Possibilities.
                                    </span>
                                </h2>
                                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                                    Every tool below is included in Rocket. No more juggling subscriptions,
                                    logging into different platforms, or paying for features you don't use.
                                </p>
                            </motion.div>

                            {/* Feature Grid */}
                            <motion.div
                                variants={staggerContainer}
                                className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                            >
                                {features.map((feature) => (
                                    <motion.div
                                        key={feature.title}
                                        variants={fadeIn}
                                        className="group relative bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-violet-500/30 transition-all duration-300 hover:shadow-xl hover:shadow-violet-500/5"
                                    >
                                        {/* Highlight badge */}
                                        <div className="absolute top-4 right-4">
                                            <span className="text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2.5 py-1 rounded-full">
                                                {feature.highlight}
                                            </span>
                                        </div>

                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                            <feature.icon className="w-6 h-6 text-white" />
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                                        <p className="text-sm text-gray-400 leading-relaxed mb-4">{feature.description}</p>

                                        {/* Replaces */}
                                        <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                            <span className="text-[10px] uppercase tracking-wider text-gray-600 font-semibold">Replaces:</span>
                                            <span className="text-xs text-gray-500 line-through">{feature.replaces}</span>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Total Savings Banner */}
                <section className="py-12">
                    <div className="max-w-4xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-pink-600/20 border border-violet-500/20 p-8 md:p-12"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-[80px]" />
                            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
                                <div>
                                    <p className="text-sm text-violet-300 font-semibold uppercase tracking-wider mb-2">Total Software Savings</p>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl md:text-6xl font-black text-white">£{totalSaved}</span>
                                        <span className="text-xl text-gray-400">/month</span>
                                    </div>
                                    <p className="text-gray-400 mt-2">That's <span className="text-green-400 font-bold">£{totalSaved * 12}/year</span> you could save by switching to Rocket</p>
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <Rocket className="w-16 h-16 text-violet-400 animate-bounce" style={{ animationDuration: '2s' }} />
                                    <span className="text-xs text-gray-500 text-center">All included in<br /><span className="text-violet-400 font-bold text-sm">one subscription</span></span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16 border-t border-white/5">
                    <div className="max-w-4xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-white text-center mb-12">
                                Get Started in{" "}
                                <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                    3 Simple Steps
                                </span>
                            </motion.h2>

                            <div className="space-y-8">
                                {[
                                    {
                                        step: "01",
                                        title: "Apply for Your Free Trial",
                                        description: "Click the button below to apply. We'll review your application and get you set up within 24 hours. No credit card needed.",
                                        icon: Rocket,
                                    },
                                    {
                                        step: "02",
                                        title: "We Set Up Your Account",
                                        description: "Our team will configure Rocket for your business — CRM pipelines, automations, email templates, and more. All customised to your industry.",
                                        icon: Zap,
                                    },
                                    {
                                        step: "03",
                                        title: "Watch Your Business Grow",
                                        description: "Start capturing leads, automating follow-ups, booking appointments, and managing everything from one dashboard. See results in weeks, not months.",
                                        icon: TrendingUp,
                                    },
                                ].map((item, index) => (
                                    <motion.div
                                        key={item.step}
                                        variants={fadeIn}
                                        className="flex items-start gap-6 group"
                                    >
                                        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 border border-violet-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <span className="text-2xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                                                {item.step}
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                                                {item.title}
                                                <item.icon className="w-5 h-5 text-violet-400" />
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed">{item.description}</p>
                                            {index < 2 && (
                                                <div className="h-8 w-px bg-violet-500/20 ml-8 mt-4" />
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Testimonials */}
                <section className="py-16 border-t border-white/5">
                    <div className="max-w-5xl mx-auto px-6">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.h2 variants={fadeIn} className="text-3xl font-black text-white text-center mb-10">
                                Businesses Already{" "}
                                <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                                    Thriving on Rocket
                                </span>
                            </motion.h2>

                            <motion.div variants={staggerContainer} className="grid md:grid-cols-3 gap-6">
                                {testimonials.map((t) => (
                                    <motion.div
                                        key={t.name}
                                        variants={fadeIn}
                                        className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] transition-colors"
                                    >
                                        <div className="flex gap-1 mb-4">
                                            {Array.from({ length: t.stars }).map((_, i) => (
                                                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                                            ))}
                                        </div>
                                        <p className="text-gray-300 text-sm leading-relaxed mb-4 italic">
                                            "{t.quote}"
                                        </p>
                                        <div>
                                            <p className="text-white font-semibold text-sm">{t.name}</p>
                                            <p className="text-gray-500 text-xs">{t.role}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-20">
                    <div className="max-w-3xl mx-auto px-6 text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeIn}>
                                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-fuchsia-600 flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-violet-600/30">
                                    <Rocket className="w-10 h-10 text-white" />
                                </div>
                            </motion.div>

                            <motion.h2 variants={fadeIn} className="text-3xl md:text-4xl font-black text-white mb-4">
                                Ready to Launch Your Business?
                            </motion.h2>

                            <motion.p variants={fadeIn} className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
                                Apply for your free 14-day trial today. No credit card, no commitment.
                                Just powerful tools that help you grow.
                            </motion.p>

                            <motion.div variants={fadeIn} className="flex flex-col items-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-10 py-7 text-xl font-bold rounded-2xl shadow-2xl shadow-violet-600/30 transition-all hover:shadow-violet-600/50 hover:scale-105"
                                    onClick={() => window.open('https://app.gorocket.uk', '_blank')}
                                >
                                    <Rocket className="w-6 h-6 mr-3" />
                                    Apply for Free Trial
                                    <ExternalLink className="w-5 h-5 ml-3" />
                                </Button>

                                <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Free 14-day trial
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        No credit card
                                    </span>
                                    <span className="flex items-center gap-1.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Cancel anytime
                                    </span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer spacer */}
                <div className="h-8" />
            </main>
        </div>
    );
}

import { useLocation } from "wouter";
// For Accountants Landing Page
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
    CheckCircle2,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
    Clock,
    Briefcase,
    Users,
    Zap,
    ChevronDown,
    ChevronUp,
    PlayCircle
} from "lucide-react";

// ─── Color Palette ───────────────────────────────────────────────
const C = {
    primary: "#0F172A", // Deep Navy/Slate
    secondary: "#3B82F6", // Bright Blue
    accent: "#10B981", // Emerald Green
    bg: "#F8FAFC", // Very Light Blue/Grey
    text: "#334155", // Slate 700
    textLight: "#64748B", // Slate 500
    white: "#FFFFFF",
    cardBg: "#FFFFFF",
    border: "#E2E8F0",
};

// ─── Animations ──────────────────────────────────────────────────
const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

// ─── Reusable Components ─────────────────────────────────────────

function Section({
    children,
    id,
    dark = false,
    className = "",
    style = {},
}: {
    children: React.ReactNode;
    id?: string;
    dark?: boolean;
    className?: string;
    style?: React.CSSProperties;
}) {
    return (
        <section
            id={id}
            className={className}
            style={{
                backgroundColor: dark ? C.primary : C.bg,
                color: dark ? C.white : C.text,
                padding: "100px 24px",
                position: "relative",
                overflow: "hidden",
                ...style,
            }}
        >
            <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>{children}</div>
        </section>
    );
}

function SectionHeader({
    title,
    subtitle,
    center = true,
    light = false,
}: {
    title: string;
    subtitle?: string;
    center?: boolean;
    light?: boolean;
}) {
    return (
        <div
            style={{
                textAlign: center ? "center" : "left",
                marginBottom: 60,
                maxWidth: center ? 800 : "100%",
                margin: center ? "0 auto 60px" : "0 0 40px",
            }}
        >
            <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                style={{
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(32px, 5vw, 42px)",
                    letterSpacing: "-0.02em",
                    color: light ? C.white : C.primary,
                    marginBottom: 16,
                    lineHeight: 1.1,
                }}
            >
                {title}
            </motion.h2>
            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(16px, 2vw, 18px)",
                        lineHeight: 1.6,
                        color: light ? "rgba(255,255,255,0.7)" : C.textLight,
                    }}
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}

function Button({
    children,
    variant = "primary",
    onClick,
    icon,
}: {
    children: React.ReactNode;
    variant?: "primary" | "secondary" | "outline" | "ghost";
    onClick?: () => void;
    icon?: React.ReactNode;
}) {
    const baseStyle = {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "16px 32px",
        borderRadius: 50,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        fontSize: 16,
        cursor: "pointer",
        transition: "all 0.2s ease",
        border: "none",
        outline: "none",
    };

    const variants = {
        primary: {
            backgroundColor: C.secondary,
            color: C.white,
            boxShadow: "0 4px 14px 0 rgba(59, 130, 246, 0.39)",
        },
        secondary: {
            backgroundColor: C.white,
            color: C.primary,
            boxShadow: "0 4px 14px 0 rgba(0,0,0,0.1)",
        },
        outline: {
            backgroundColor: "transparent",
            color: C.white,
            border: "1px solid rgba(255,255,255,0.3)",
        },
        ghost: {
            backgroundColor: "transparent",
            color: C.primary,
            padding: "12px 24px",
        },
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            style={{ ...baseStyle, ...variants[variant] }}
        >
            {children}
            {icon}
        </motion.button>
    );
}

function FeatureCard({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) {
    return (
        <motion.div
            variants={fadeIn}
            style={{
                backgroundColor: C.white,
                borderRadius: 16,
                padding: 32,
                border: `1px solid ${C.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
            }}
        >
            <div
                style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: `${C.secondary}15`,
                    color: C.secondary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                }}
            >
                {icon}
            </div>
            <h3
                style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: C.primary,
                    marginBottom: 12,
                }}
            >
                {title}
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.6, color: C.textLight }}>
                {desc}
            </p>
        </motion.div>
    );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div
            style={{
                borderBottom: `1px solid ${C.border}`,
                marginBottom: 16,
            }}
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "20px 0",
                    background: "none",
                    border: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                }}
            >
                <span
                    style={{
                        fontSize: 18,
                        fontWeight: 600,
                        color: C.primary,
                    }}
                >
                    {question}
                </span>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: "hidden" }}
                    >
                        <p
                            style={{
                                paddingBottom: 24,
                                lineHeight: 1.6,
                                color: C.text,
                            }}
                        >
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ─── Main Page Component ─────────────────────────────────────────

export default function ForAccountants() {
    const [, navigate] = useLocation();

    const scrollTo = (id: string) => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div style={{ fontFamily: "'Inter', sans-serif", backgroundColor: C.bg, overflowX: "hidden" }}>

            {/* ── Navbar ────────────────────────────────────────────────── */}
            <nav
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    backgroundColor: `rgba(255,255,255,0.9)`, // Glassmorphism
                    backdropFilter: "blur(12px)",
                    borderBottom: `1px solid ${C.border}`,
                    padding: "16px 24px",
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <div
                        onClick={() => navigate("/")}
                        style={{
                            fontSize: 20,
                            fontWeight: 700,
                            color: C.primary,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <div style={{ width: 28, height: 28, background: C.secondary, borderRadius: 6 }}></div>
                        <span>PartnerConnector</span>
                    </div>
                    <div style={{ display: "flex", gap: 16 }}>
                        <button
                            onClick={() => scrollTo("hero")}
                            style={{
                                background: "none",
                                border: "none",
                                fontSize: 14,
                                fontWeight: 600,
                                color: C.text,
                                cursor: "pointer"
                            }}
                        >
                            For Accountants
                        </button>
                        <Button variant="primary" onClick={() => navigate("/book-demo")}>
                            Book a Demo
                        </Button>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ──────────────────────────────────────────── */}
            <Section id="hero" className="hero-pattern"> {/* Add a CSS pattern class if available, else standard bg */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        paddingTop: 60,
                        paddingBottom: 60,
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span
                            style={{
                                display: "inline-block",
                                padding: "8px 16px",
                                borderRadius: 50,
                                backgroundColor: "#DBEAFE",
                                color: "#1E40AF",
                                fontSize: 13,
                                fontWeight: 600,
                                marginBottom: 24,
                                letterSpacing: "0.05em",
                                textTransform: "uppercase",
                            }}
                        >
                            The Operating System for Modern Firms
                        </span>
                        <h1
                            style={{
                                fontSize: "clamp(42px, 6vw, 64px)",
                                fontWeight: 800,
                                letterSpacing: "-0.03em",
                                lineHeight: 1.1,
                                color: C.primary,
                                maxWidth: 900,
                                marginBottom: 24,
                            }}
                        >
                            Grow your firm without <br />
                            <span style={{ color: C.secondary }}>increasing your workload.</span>
                        </h1>
                        <p
                            style={{
                                fontSize: "clamp(18px, 2vw, 22px)",
                                lineHeight: 1.6,
                                color: C.textLight,
                                maxWidth: 700,
                                margin: "0 auto 40px",
                            }}
                        >
                            Partner Connector automates your admin, delights your clients, and unlocks new revenue streams—all without changing how you work.
                        </p>
                        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                            <Button onClick={() => navigate("/book-demo")} icon={<ArrowRight size={18} />}>
                                Start Your Free Trial
                            </Button>
                            <Button variant="secondary" onClick={() => scrollTo("how-it-works")} icon={<PlayCircle size={18} />}>
                                See How It Works
                            </Button>
                        </div>
                    </motion.div>

                    {/* Hero Visual/Dashboard Mockup Placeholder - Replacing abstract shapes with a clean interface hint */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        style={{
                            marginTop: 80,
                            width: "100%",
                            maxWidth: 1000,
                            borderRadius: 20,
                            overflow: "hidden",
                            boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.15)",
                            border: `1px solid ${C.border}`,
                            background: C.white,
                            position: "relative"
                        }}
                    >
                        {/* Abstract UI Representation */}
                        <div style={{ padding: "20px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 12 }}>
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#EF4444" }} />
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#F59E0B" }} />
                            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#10B981" }} />
                            <div style={{ flex: 1, background: "#F1F5F9", height: 24, borderRadius: 6, marginLeft: 20, maxWidth: 400 }} />
                        </div>
                        <div style={{ display: "flex", height: 500, background: "#F8FAFC" }}>
                            <div style={{ width: 240, borderRight: `1px solid ${C.border}`, background: C.white, padding: 20 }}>
                                <div style={{ height: 20, width: "70%", background: "#E2E8F0", borderRadius: 4, marginBottom: 30 }} />
                                {[1, 2, 3, 4, 5].map(i => (
                                    <div key={i} style={{ height: 16, width: "100%", background: i === 2 ? "#DBEAFE" : "transparent", borderRadius: 4, marginBottom: 16, padding: 8, color: i === 2 ? C.secondary : "inherit" }}>
                                        <div style={{ height: 8, width: "60%", background: i === 2 ? C.secondary : "#E2E8F0", borderRadius: 2 }} />
                                    </div>
                                ))}
                            </div>
                            <div style={{ flex: 1, padding: 40 }}>
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
                                    <div style={{ height: 32, width: 200, background: "#CBD5E1", borderRadius: 4 }} />
                                    <div style={{ height: 32, width: 120, background: C.secondary, borderRadius: 4 }} />
                                </div>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
                                    {[1, 2, 3].map(i => (
                                        <div key={i} style={{ height: 140, background: C.white, borderRadius: 12, border: `1px solid ${C.border}`, padding: 20 }}>
                                            <div style={{ width: 40, height: 40, borderRadius: 8, background: i === 1 ? "#DCFCE7" : i === 2 ? "#DBEAFE" : "#FAE8FF", marginBottom: 16 }} />
                                            <div style={{ height: 12, width: "50%", background: "#E2E8F0", borderRadius: 4, marginBottom: 10 }} />
                                            <div style={{ height: 24, width: "30%", background: "#94A3B8", borderRadius: 4 }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Overlay Gradient for "Coming to Life" feel */}
                        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 200, background: "linear-gradient(to top, #F8FAFC 0%, transparent 100%)" }} />
                    </motion.div>
                </div>
            </Section>

            {/* ── Social Proof / Trusted By ─────────────────────────────────── */}
            <div style={{ background: C.white, padding: "40px 0", borderBottom: `1px solid ${C.border}` }}>
                <div style={{ maxWidth: 1200, margin: "0 auto", textAlign: "center" }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: 1, marginBottom: 24 }}>
                        Powering Modern Accounting Firms
                    </p>
                    <div style={{ display: "flex", justifyContent: "center", gap: 40, flexWrap: "wrap", opacity: 0.5, filter: "grayscale(100%)" }}>
                        {/* Placeholders for logos */}
                        {["Acme Corp", "Global Tax", "Summit Financial", "NextGen Accounting", "Growth Partners"].map((brand, i) => (
                            <span key={i} style={{ fontSize: 20, fontWeight: 700, fontFamily: "serif", color: C.primary }}>{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── The Problem / Comparison ──────────────────────────────── */}
            <Section id="problem-solution">
                <SectionHeader
                    title="Stop the manual chase."
                    subtitle="Most firms are stuck in a cycle of admin overload. There's a better way."
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: 40 }}>
                    {/* Old Way */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ padding: 40, borderRadius: 24, background: "#FFF1F2", border: "1px solid #FECDD3" }}
                    >
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: "#9F1239", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 24 }}>❌</span> The Old Way
                        </h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                "Chasing clients for bank statements via email",
                                "Manually updating spreadsheets for every deal",
                                "Missing funding opportunities because you're too busy",
                                "Admin eating up 40% of your billable time",
                                "Disconnect between your software tools"
                            ].map((item, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "#881337", fontSize: 16 }}>
                                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#E11D48" }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* New Way */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        style={{ padding: 40, borderRadius: 24, background: "#ECFDF5", border: "1px solid #A7F3D0", boxShadow: "0 10px 40px -10px rgba(16, 185, 129, 0.2)" }}
                    >
                        <h3 style={{ fontSize: 22, fontWeight: 700, color: "#065F46", marginBottom: 24, display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontSize: 24 }}>✅</span> The Connected Way
                        </h3>
                        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
                            {[
                                "Automated document collection & reminders",
                                "Real-time deal tracking dashboard",
                                "Smart notifications for revenue opportunities",
                                "Team focused on advisory & high-value work",
                                "One unified platform for everything"
                            ].map((item, i) => (
                                <li key={i} style={{ display: "flex", alignItems: "center", gap: 12, color: "#064E3B", fontSize: 16, fontWeight: 500 }}>
                                    <CheckCircle2 size={20} color={C.accent} style={{ flexShrink: 0 }} />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>
            </Section>

            {/* ── How It Works (Visual Flow) ────────────────────────────── */}
            <Section id="how-it-works" dark>
                <SectionHeader
                    title="How it Works"
                    subtitle="A simple, powerful workflow designed for busy firms."
                    light
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 40, position: "relative" }}>
                    {/* Connecting Line (Desktop Only) */}
                    <div
                        style={{
                            position: "absolute",
                            top: 40,
                            left: "10%",
                            right: "10%",
                            height: 2,
                            background: "linear-gradient(to right, #3B82F6 0%, #10B981 100%)",
                            opacity: 0.3,
                            display: "none", // Hide on Mobile by default, add via media query if possible or keep simple
                            zIndex: 0
                        }}
                    />

                    {[
                        { num: "01", title: "Connect", desc: "Sync your practice management software in one click.", icon: <Zap size={28} /> },
                        { num: "02", title: "Identify", desc: "Our AI spots opportunities for funding & savings.", icon: <TrendingUp size={28} /> },
                        { num: "03", title: "Automate", desc: "We contact the client & collect documents for you.", icon: <Clock size={28} /> },
                        { num: "04", title: "Grow", desc: "Client gets funded. You get paid. Everyone wins.", icon: <Briefcase size={28} /> },
                    ].map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.15 }}
                            viewport={{ once: true }}
                            style={{ position: "relative", zIndex: 1, textAlign: "center" }}
                        >
                            <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#1E293B", border: `2px solid ${i === 3 ? C.accent : C.secondary}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", color: C.white, boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)" }}>
                                {step.icon}
                            </div>
                            <h3 style={{ fontSize: 20, fontWeight: 700, color: C.white, marginBottom: 12 }}>{step.title}</h3>
                            <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{step.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* ── Bento Grid Benefits ───────────────────────────────────── */}
            <Section id="benefits">
                <SectionHeader
                    title="Everything you need to scale."
                    subtitle="Built specifically for the needs of modern accounting firms."
                />

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
                    {/* Main Large Card */}
                    <motion.div
                        variants={fadeIn}
                        initial="hidden"
                        whileInView="visible"
                        style={{ gridColumn: "span 2", minHeight: 400, background: C.primary, borderRadius: 24, padding: 40, color: C.white, display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}
                    >
                        <div style={{ position: "relative", zIndex: 2 }}>
                            <div style={{ background: "rgba(255,255,255,0.1)", width: "fit-content", padding: "8px 16px", borderRadius: 50, marginBottom: 24, fontSize: 13, fontWeight: 600 }}>FEATURED</div>
                            <h3 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Unified Partner Dashboard</h3>
                            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.8)", maxWidth: 500 }}>
                                See every client, every active deal, and every commission dollar in one single, beautiful view. No more jumping between tabs.
                            </p>
                        </div>
                        {/* Decorative Element */}
                        <div style={{ position: "absolute", bottom: -50, right: -50, width: 300, height: 300, background: C.secondary, borderRadius: "50%", filter: "blur(80px)", opacity: 0.5 }} />
                    </motion.div>

                    {/* Smaller Cards */}
                    <FeatureCard
                        icon={<ShieldCheck />}
                        title="Bank-Grade Security"
                        desc="Your client data is encrypted and protected with enterprise-level security standards."
                    />
                    <FeatureCard
                        icon={<Users />}
                        title="Client Retention"
                        desc="Firms using Partner Connector see a 24% increase in client retention rates."
                    />
                    <FeatureCard
                        icon={<Zap />}
                        title="Instant Setup"
                        desc="Get up and running in less than 5 minutes. No technical team required."
                    />
                    <FeatureCard
                        icon={<TrendingUp />}
                        title="Revenue Share"
                        desc="Earn competitive commissions on every successful funding deal or payment integration."
                    />
                </div>
            </Section>

            {/* ── Zero Complexity Promise ───────────────────────────────── */}
            <Section id="promise" style={{ background: "#F0F9FF" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", textAlign: "center" }}>
                    <h2 style={{ fontSize: 36, fontWeight: 800, color: C.primary, marginBottom: 24 }}>Our "Zero Complexity" Promise</h2>
                    <p style={{ fontSize: 18, color: C.text, maxWidth: 600, marginBottom: 40, lineHeight: 1.6 }}>
                        We know you're busy. That's why we built Partner Connector to run in the background. If it takes more than 5 minutes of your time per week, we haven't done our job.
                    </p>
                    <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
                        {[
                            "No new software to learn",
                            "No sales training required",
                            "No awkward conversations",
                            "No monthly fees"
                        ].map((item, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 16, fontWeight: 600, color: C.primary }}>
                                <CheckCircle2 color={C.accent} size={20} />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* ── FAQ ───────────────────────────────────────────────────── */}
            <Section id="faq">
                <SectionHeader title="Common Questions" center />
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <FAQItem
                        question="Does this replace my existing staff?"
                        answer="Not at all. Partner Connector empowers your existing staff by removing low-value admin tasks, allowing them to focus on high-value advisory work."
                    />
                    <FAQItem
                        question="Is my client data secure?"
                        answer="Absolutely. We use bank-grade encryption (AES-256) and are fully GDPR/SOC2 compliant. We never share client data with third parties without explicit consent."
                    />
                    <FAQItem
                        question="How do I get paid?"
                        answer="Commissions are tracked automatically in your dashboard and paid out monthly directly to your firm's bank account."
                    />
                    <FAQItem
                        question="What if a client isn't interested?"
                        answer="No problem. Our smart system ensures we only surface relevant offers. If they decline, we simply note it and move on. No hard selling."
                    />
                </div>
            </Section>

            {/* ── CTA / Footer ──────────────────────────────────────────── */}
            <Section id="cta" dark>
                <div style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
                    <h2 style={{ fontSize: 48, fontWeight: 800, color: C.white, marginBottom: 24 }}>
                        Ready to modernize your firm?
                    </h2>
                    <p style={{ fontSize: 20, color: "rgba(255,255,255,0.8)", marginBottom: 40 }}>
                        Join hundreds of forward-thinking accountants using Partner Connector today.
                    </p>
                    <Button variant="primary" onClick={() => navigate("/signup")}>
                        Get Started for Free
                    </Button>
                    <p style={{ marginTop: 24, fontSize: 14, color: "rgba(255,255,255,0.5)" }}>
                        No credit card required • Cancel anytime
                    </p>
                </div>
            </Section>

            <footer style={{ background: C.primary, padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.1)", textAlign: "center" }}>
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                    © {new Date().getFullYear()} PartnerConnector. All rights reserved.
                </p>
            </footer>

        </div>
    );
}

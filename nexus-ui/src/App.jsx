import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const G = {
  font: {
    display: "'Syne', sans-serif",
    body: "'DM Sans', sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  color: {
    bg: "#0A0A0F",
    surface: "#111118",
    surfaceHigh: "#1A1A26",
    accent: "#7C3AED",
    accentGlow: "#9F67FF",
    accentSoft: "rgba(124,58,237,0.15)",
    gold: "#F5C842",
    text: "#F0EEF8",
    textMuted: "#8B87A8",
    border: "rgba(124,58,237,0.2)",
  },
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const useScrollY = () => {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);
  return y;
};

const FadeUp = ({ children, delay = 0, className = "" }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── GLOBAL STYLES (injected) ─────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: ${G.color.bg}; color: ${G.color.text}; font-family: ${G.font.body}; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: ${G.color.bg}; }
    ::-webkit-scrollbar-thumb { background: ${G.color.accent}; border-radius: 3px; }
    a { color: inherit; text-decoration: none; }
    button { cursor: pointer; border: none; background: none; font-family: inherit; }
  `}</style>
);

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
const Navbar = ({ onOpenSidebar }) => {
  const scrollY = useScrollY();
  const [active, setActive] = useState("Home");
  const links = ["Home", "Features", "Testimonials", "Components", "Contact"];

  const scrollTo = (id) => {
    setActive(id);
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 2rem",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrollY > 40 ? "rgba(10,10,15,0.92)" : "transparent",
        backdropFilter: scrollY > 40 ? "blur(20px)" : "none",
        borderBottom: scrollY > 40 ? `1px solid ${G.color.border}` : "none",
        transition: "background 0.4s, backdrop-filter 0.4s, border 0.4s",
      }}
    >
      {/* Logo */}
      <div style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "1.3rem", letterSpacing: "-0.02em" }}>
        <span style={{ color: G.color.accentGlow }}>◆</span> NEXUS
      </div>

      {/* Links */}
      <div style={{ display: "flex", gap: "2rem" }}>
        {links.map((l) => (
          <button
            key={l}
            onClick={() => scrollTo(l)}
            style={{
              fontFamily: G.font.body, fontSize: "0.875rem", fontWeight: 500,
              color: active === l ? G.color.accentGlow : G.color.textMuted,
              transition: "color 0.2s",
              position: "relative", padding: "4px 0",
            }}
          >
            {l}
            {active === l && (
              <motion.div
                layoutId="nav-indicator"
                style={{
                  position: "absolute", bottom: -2, left: 0, right: 0,
                  height: 2, background: G.color.accentGlow, borderRadius: 2,
                }}
              />
            )}
          </button>
        ))}
      </div>

      {/* CTA + menu */}
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          onClick={onOpenSidebar}
          style={{
            background: G.color.accentSoft, border: `1px solid ${G.color.border}`,
            color: G.color.accentGlow, borderRadius: 8, padding: "7px 14px",
            fontSize: "0.8rem", fontWeight: 500,
          }}
        >
          ☰ Menu
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${G.color.accent}60` }}
          whileTap={{ scale: 0.97 }}
          style={{
            background: `linear-gradient(135deg, ${G.color.accent}, ${G.color.accentGlow})`,
            color: "#fff", borderRadius: 8, padding: "7px 18px",
            fontSize: "0.8rem", fontWeight: 600,
          }}
        >
          Get Started →
        </motion.button>
      </div>
    </motion.nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = ({ onOpenModal }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section id="home" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "6rem 2rem 4rem" }}>
      {/* Animated mesh bg */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: 0 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0], scale: [1, 1.1, 0.95, 1] }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
            style={{
              position: "absolute",
              width: 400 + i * 80, height: 400 + i * 80,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${i % 2 === 0 ? G.color.accent : "#1E1B4B"}44 0%, transparent 70%)`,
              left: `${[10, 60, 30, 70, 5, 80][i]}%`,
              top: `${[20, 10, 60, 40, 70, 30][i]}%`,
              transform: "translate(-50%,-50%)",
              filter: "blur(40px)",
            }}
          />
        ))}
        {/* Grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `linear-gradient(${G.color.border} 1px, transparent 1px), linear-gradient(90deg, ${G.color.border} 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)",
        }} />
      </div>

      <motion.div style={{ y, opacity, position: "relative", zIndex: 1, textAlign: "center", maxWidth: 800 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: G.color.accentSoft, border: `1px solid ${G.color.border}`,
            borderRadius: 999, padding: "6px 18px", marginBottom: "2rem",
            fontSize: "0.8rem", fontFamily: G.font.mono, color: G.color.accentGlow,
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: G.color.gold, display: "inline-block" }} />
          v2.0 — Now with Framer Motion
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{
            fontFamily: G.font.display, fontWeight: 800, fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
            lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: "1.5rem",
          }}
        >
          Build{" "}
          <span style={{
            background: `linear-gradient(135deg, ${G.color.accentGlow}, ${G.color.gold})`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Stunning
          </span>
          {" "}
          <br />
          Interfaces Fast
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          style={{ color: G.color.textMuted, fontSize: "1.15rem", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 2.5rem" }}
        >
          A production-grade UI system with animated components, responsive layouts, and a design system built for modern web apps.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            onClick={onOpenModal}
            whileHover={{ scale: 1.05, boxShadow: `0 0 30px ${G.color.accent}80` }}
            whileTap={{ scale: 0.97 }}
            style={{
              background: `linear-gradient(135deg, ${G.color.accent}, ${G.color.accentGlow})`,
              color: "#fff", borderRadius: 12, padding: "14px 32px",
              fontSize: "1rem", fontWeight: 600, fontFamily: G.font.body,
            }}
          >
            ✦ See Demo Modal
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              background: G.color.surfaceHigh, border: `1px solid ${G.color.border}`,
              color: G.color.text, borderRadius: 12, padding: "14px 32px",
              fontSize: "1rem", fontWeight: 500, fontFamily: G.font.body,
            }}
          >
            Explore Features ↓
          </motion.button>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: "flex", gap: "1.5rem", justifyContent: "center", marginTop: "3.5rem", flexWrap: "wrap" }}
        >
          {[["12k+", "Developers"], ["99%", "Satisfaction"], ["4.9★", "Rating"]].map(([n, l]) => (
            <div key={l} style={{
              background: G.color.surfaceHigh, border: `1px solid ${G.color.border}`,
              borderRadius: 12, padding: "12px 22px", textAlign: "center",
            }}>
              <div style={{ fontFamily: G.font.display, fontWeight: 700, fontSize: "1.3rem", color: G.color.accentGlow }}>{n}</div>
              <div style={{ fontSize: "0.75rem", color: G.color.textMuted, marginTop: 2 }}>{l}</div>
            </div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", color: G.color.textMuted, fontSize: "1.3rem" }}
      >
        ↓
      </motion.div>
    </section>
  );
};

// ─── FEATURES GRID ────────────────────────────────────────────────────────────
const features = [
  { icon: "⚡", title: "Lightning Fast", desc: "Optimized for performance with code splitting, lazy loading, and zero render-blocking assets out of the box." },
  { icon: "🎨", title: "Design System", desc: "Consistent tokens for color, spacing, and typography — every component shares a single source of truth." },
  { icon: "📱", title: "Fully Responsive", desc: "Fluid grids and breakpoint-aware components that look perfect from 320px to 4K displays." },
  { icon: "✨", title: "Framer Motion", desc: "Buttery-smooth animations with spring physics, gesture support, and layout transitions built in." },
  { icon: "🔒", title: "Accessibility First", desc: "WCAG 2.1 AA compliant. Keyboard navigation, ARIA roles, and focus management handled automatically." },
  { icon: "🧩", title: "Modular Components", desc: "Every component is self-contained and composable. Mix and match to build any layout imaginable." },
];

const FeaturesGrid = () => (
  <section id="features" style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
    <FadeUp>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div style={{ fontFamily: G.font.mono, fontSize: "0.8rem", color: G.color.accentGlow, letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
          FEATURES
        </div>
        <h2 style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
          Everything You Need
        </h2>
      </div>
    </FadeUp>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
      {features.map((f, i) => (
        <FadeUp key={f.title} delay={i * 0.08}>
          <motion.div
            whileHover={{ y: -6, borderColor: `${G.color.accentGlow}60` }}
            style={{
              background: G.color.surface, border: `1px solid ${G.color.border}`,
              borderRadius: 16, padding: "2rem",
              transition: "border-color 0.3s",
              position: "relative", overflow: "hidden",
            }}
          >
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 2,
              background: `linear-gradient(90deg, transparent, ${G.color.accent}80, transparent)`,
            }} />
            <div style={{
              fontSize: "2rem", marginBottom: "1rem",
              width: 52, height: 52, borderRadius: 12,
              background: G.color.accentSoft, display: "flex", alignItems: "center", justifyContent: "center",
            }}>{f.icon}</div>
            <h3 style={{ fontFamily: G.font.display, fontWeight: 700, fontSize: "1.15rem", marginBottom: "0.6rem" }}>{f.title}</h3>
            <p style={{ color: G.color.textMuted, fontSize: "0.9rem", lineHeight: 1.65 }}>{f.desc}</p>
          </motion.div>
        </FadeUp>
      ))}
    </div>
  </section>
);

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
const testimonials = [
  { name: "Ayesha Raza", role: "Lead Engineer, Fintech Co", text: "NEXUS transformed our workflow. Components are drop-in perfect and the animations are genuinely impressive.", avatar: "AR" },
  { name: "Marcus Chen", role: "Product Designer, SaaS Inc", text: "Finally a UI kit that doesn't look like every other project. The design system is thoughtful and the code is clean.", avatar: "MC" },
  { name: "Priya Kapoor", role: "Frontend Architect, Startup", text: "From landing page to dashboard in a week. The responsive grid alone saved us 40 hours of breakpoint debugging.", avatar: "PK" },
];

const Testimonials = () => (
  <section id="testimonials" style={{ padding: "6rem 2rem", background: `linear-gradient(180deg, transparent, ${G.color.surface}40, transparent)` }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <FadeUp>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <div style={{ fontFamily: G.font.mono, fontSize: "0.8rem", color: G.color.accentGlow, letterSpacing: "0.15em", marginBottom: "0.75rem" }}>
            TESTIMONIALS
          </div>
          <h2 style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>
            Loved by Builders
          </h2>
        </div>
      </FadeUp>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
        {testimonials.map((t, i) => (
          <FadeUp key={t.name} delay={i * 0.1}>
            <motion.div
              whileHover={{ y: -4 }}
              style={{
                background: G.color.surface, border: `1px solid ${G.color.border}`,
                borderRadius: 16, padding: "2rem",
              }}
            >
              <div style={{ color: G.color.gold, fontSize: "1.5rem", marginBottom: "1rem" }}>★★★★★</div>
              <p style={{ color: G.color.text, fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>"{t.text}"</p>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <div style={{
                  width: 42, height: 42, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${G.color.accent}, ${G.color.accentGlow})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: G.font.display, fontWeight: 700, fontSize: "0.85rem",
                }}>{t.avatar}</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{t.name}</div>
                  <div style={{ color: G.color.textMuted, fontSize: "0.78rem" }}>{t.role}</div>
                </div>
              </div>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </div>
  </section>
);

// ─── COMPONENTS SHOWCASE (Accordion + Modal + Sidebar triggers) ───────────────
const AccordionItem = ({ title, content, index }) => {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{
        border: `1px solid ${open ? G.color.accentGlow + "60" : G.color.border}`,
        borderRadius: 12, overflow: "hidden", marginBottom: "0.75rem",
        transition: "border-color 0.3s",
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: "100%", padding: "1.1rem 1.4rem",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: open ? G.color.accentSoft : G.color.surface,
          color: G.color.text, fontFamily: G.font.body,
          fontSize: "0.95rem", fontWeight: 500,
          transition: "background 0.3s",
        }}
      >
        {title}
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          style={{ fontSize: "1.2rem", color: G.color.accentGlow }}
        >+</motion.span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ padding: "1rem 1.4rem 1.4rem", color: G.color.textMuted, fontSize: "0.88rem", lineHeight: 1.7, background: G.color.surface }}>
              {content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const accordionItems = [
  { title: "How does the animation system work?", content: "Built on Framer Motion, the system uses spring physics and layout animations for natural-feeling transitions. Every component has sensible defaults that can be overridden via props." },
  { title: "Is it accessible out of the box?", content: "Yes — all interactive elements follow ARIA best practices, support keyboard navigation, and maintain visible focus states. We target WCAG 2.1 AA compliance." },
  { title: "Can I customize the design tokens?", content: "Absolutely. The entire system is driven by CSS custom properties. Override the root variables to instantly retheme every component consistently." },
  { title: "What about dark/light mode support?", content: "Dark mode is the default, but all colors live in CSS variables so toggling themes is a single classList change on the root element." },
];

const ComponentsSection = ({ onOpenModal, onOpenSidebar }) => (
  <section id="components" style={{ padding: "6rem 2rem", maxWidth: 1100, margin: "0 auto" }}>
    <FadeUp>
      <div style={{ textAlign: "center", marginBottom: "4rem" }}>
        <div style={{ fontFamily: G.font.mono, fontSize: "0.8rem", color: G.color.accentGlow, letterSpacing: "0.15em", marginBottom: "0.75rem" }}>COMPONENTS</div>
        <h2 style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.03em" }}>Animated UI Kit</h2>
        <p style={{ color: G.color.textMuted, marginTop: "0.75rem", fontSize: "1rem" }}>Click the buttons below to see Modal, Sidebar, and Accordion in action</p>
      </div>
    </FadeUp>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
      {/* Trigger buttons */}
      <FadeUp>
        <div style={{ background: G.color.surface, border: `1px solid ${G.color.border}`, borderRadius: 16, padding: "2rem" }}>
          <h3 style={{ fontFamily: G.font.display, fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>⬡ Interactive Triggers</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {[
              { label: "Open Modal Dialog", icon: "◈", action: onOpenModal, accent: true },
              { label: "Open Side Drawer", icon: "▶", action: onOpenSidebar, accent: false },
            ].map(({ label, icon, action, accent }) => (
              <motion.button
                key={label}
                onClick={action}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.75rem",
                  background: accent ? `linear-gradient(135deg, ${G.color.accent}33, ${G.color.accentGlow}22)` : G.color.surfaceHigh,
                  border: `1px solid ${accent ? G.color.border : G.color.border}`,
                  borderRadius: 10, padding: "12px 16px",
                  color: accent ? G.color.accentGlow : G.color.text,
                  fontSize: "0.9rem", fontWeight: 500, textAlign: "left",
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>{icon}</span>
                {label}
                <span style={{ marginLeft: "auto", opacity: 0.5 }}>→</span>
              </motion.button>
            ))}
          </div>
        </div>
      </FadeUp>

      {/* Accordion */}
      <FadeUp delay={0.1}>
        <div style={{ background: G.color.surface, border: `1px solid ${G.color.border}`, borderRadius: 16, padding: "2rem" }}>
          <h3 style={{ fontFamily: G.font.display, fontWeight: 700, marginBottom: "1.5rem", fontSize: "1.1rem" }}>⊞ Accordion FAQ</h3>
          {accordionItems.map((item, i) => (
            <AccordionItem key={i} {...item} index={i} />
          ))}
        </div>
      </FadeUp>
    </div>
  </section>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 200,
          background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem",
        }}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: G.color.surface, border: `1px solid ${G.color.border}`,
            borderRadius: 20, padding: "2.5rem", maxWidth: 480, width: "100%",
            position: "relative",
          }}
        >
          <div style={{
            position: "absolute", top: 0, left: "20%", right: "20%", height: 2,
            background: `linear-gradient(90deg, transparent, ${G.color.accentGlow}, transparent)`,
          }} />

          <div style={{ fontSize: "2.5rem", marginBottom: "1rem", textAlign: "center" }}>✦</div>
          <h2 style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "1.6rem", textAlign: "center", letterSpacing: "-0.03em", marginBottom: "0.75rem" }}>
            Welcome to NEXUS
          </h2>
          <p style={{ color: G.color.textMuted, textAlign: "center", lineHeight: 1.7, marginBottom: "2rem", fontSize: "0.9rem" }}>
            This is a fully animated modal built with Framer Motion. Spring physics, backdrop blur, and escape-to-close included. Drop it anywhere.
          </p>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${G.color.accent}60` }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                flex: 1, background: `linear-gradient(135deg, ${G.color.accent}, ${G.color.accentGlow})`,
                color: "#fff", borderRadius: 10, padding: "11px",
                fontSize: "0.9rem", fontWeight: 600, fontFamily: G.font.body,
              }}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              style={{
                flex: 1, background: G.color.surfaceHigh, border: `1px solid ${G.color.border}`,
                color: G.color.textMuted, borderRadius: 10, padding: "11px",
                fontSize: "0.9rem", fontFamily: G.font.body,
              }}
            >
              Maybe Later
            </motion.button>
          </div>

          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, color: G.color.textMuted, fontSize: "1.2rem", padding: 4 }}>✕</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const sideItems = [
  { icon: "⌂", label: "Home" },
  { icon: "◈", label: "Components" },
  { icon: "✦", label: "Features" },
  { icon: "⬡", label: "Docs" },
  { icon: "⊞", label: "Settings" },
];

const Sidebar = ({ open, onClose }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{ position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        />
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          style={{
            position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 160,
            width: 300, background: G.color.surface,
            borderLeft: `1px solid ${G.color.border}`,
            padding: "2rem 1.5rem", display: "flex", flexDirection: "column",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2.5rem" }}>
            <div style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "1.2rem" }}>
              <span style={{ color: G.color.accentGlow }}>◆</span> NEXUS
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              style={{ color: G.color.textMuted, fontSize: "1.2rem" }}
            >✕</motion.button>
          </div>

          <nav style={{ flex: 1 }}>
            {sideItems.map((item, i) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
                whileHover={{ x: 6, color: G.color.accentGlow }}
                onClick={onClose}
                style={{
                  display: "flex", alignItems: "center", gap: "0.9rem",
                  width: "100%", padding: "12px 14px", borderRadius: 10,
                  color: G.color.textMuted, fontSize: "0.95rem", fontWeight: 500,
                  fontFamily: G.font.body, marginBottom: "0.25rem",
                  transition: "color 0.2s, background 0.2s",
                }}
              >
                <span style={{ fontSize: "1.1rem" }}>{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </nav>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            whileHover={{ scale: 1.04, boxShadow: `0 0 20px ${G.color.accent}60` }}
            style={{
              background: `linear-gradient(135deg, ${G.color.accent}, ${G.color.accentGlow})`,
              color: "#fff", borderRadius: 12, padding: "13px",
              fontSize: "0.9rem", fontWeight: 600, fontFamily: G.font.body,
            }}
          >
            Get Started →
          </motion.button>
        </motion.aside>
      </>
    )}
  </AnimatePresence>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const Footer = () => (
  <footer id="contact" style={{
    borderTop: `1px solid ${G.color.border}`,
    padding: "4rem 2rem 2.5rem",
    background: G.color.surface,
  }}>
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "3rem", marginBottom: "3rem" }}>
        <div>
          <div style={{ fontFamily: G.font.display, fontWeight: 800, fontSize: "1.4rem", marginBottom: "1rem" }}>
            <span style={{ color: G.color.accentGlow }}>◆</span> NEXUS
          </div>
          <p style={{ color: G.color.textMuted, fontSize: "0.875rem", lineHeight: 1.7, maxWidth: 260 }}>
            A production-ready UI system for teams who care about craft.
          </p>
        </div>
        {[
          { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
          { heading: "Developers", links: ["Docs", "API Reference", "GitHub", "Discord"] },
          { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
        ].map((col) => (
          <div key={col.heading}>
            <div style={{ fontFamily: G.font.display, fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem" }}>{col.heading}</div>
            {col.links.map((l) => (
              <div key={l} style={{ color: G.color.textMuted, fontSize: "0.85rem", marginBottom: "0.6rem" }}>
                <motion.a href="#" whileHover={{ color: G.color.text }} style={{ transition: "color 0.2s" }}>{l}</motion.a>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div style={{
        borderTop: `1px solid ${G.color.border}`, paddingTop: "1.5rem",
        display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem",
      }}>
        <div style={{ color: G.color.textMuted, fontSize: "0.8rem" }}>
          © 2025 NEXUS · Built with React + Framer Motion
        </div>
        <div style={{ display: "flex", gap: "1.5rem" }}>
          {["Privacy", "Terms", "Cookies"].map((l) => (
            <a key={l} href="#" style={{ color: G.color.textMuted, fontSize: "0.8rem" }}>{l}</a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") { setModalOpen(false); setSidebarOpen(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <GlobalStyles />
      <Navbar onOpenSidebar={() => setSidebarOpen(true)} />
      <main>
        <Hero onOpenModal={() => setModalOpen(true)} />
        <FeaturesGrid />
        <Testimonials />
        <ComponentsSection
          onOpenModal={() => setModalOpen(true)}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
      </main>
      <Footer />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Brain,
  ChartNoAxesCombined,
  ChevronDown,
  GraduationCap,
  Lightbulb,
  Menu,
  MessageSquare,
  Sparkles,
  Target,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Design tokens — dark mode
    Void       #0A0E17   page background
    Panel      #12172A   elevated cards / panels
    Panel-2    #161C33   slightly brighter panel (features on stats etc.)
    Line       rgba(255,255,255,0.08)   hairline borders
    Indigo     #6366F1   primary brand / CTA
    Indigo-L   #818CF8   hover / highlight
    Amber      #FBBF24   "insight" accent, used sparingly
    Mist       #F1F3F8   primary text
    Slate      #9AA3B2   secondary / body copy
    Fonts      Fraunces (display serif) · Inter (body) · IBM Plex Mono (data/labels)
    Add these via next/font or a <link> to Google Fonts in your root layout. */
/* ------------------------------------------------------------------ */

/* Stagger helpers reused across sections */
const staggerContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * CursorSpotlight — a soft indigo glow that follows the pointer across
 * the whole page, springing gently rather than tracking 1:1. This is
 * the thing that makes a dark page feel "lit from where you're looking"
 * instead of just dark. Desktop only — skipped on touch to avoid a
 * stuck glow in one corner.
 */
function CursorSpotlight() {
  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 60, damping: 22, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 60, damping: 22, mass: 0.4 });

  useEffect(() => {
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  const background = useTransform([sx, sy], ([lx, ly]) =>
    `radial-gradient(560px circle at ${lx}px ${ly}px, rgba(99,102,241,0.10), transparent 70%)`
  );

  return (
    <motion.div
      style={{ background }}
      className="pointer-events-none fixed inset-0 z-30 hidden md:block"
      aria-hidden="true"
    />
  );
}

/**
 * ScrollProgressBar — a thin gradient line pinned to the top of the
 * viewport that fills as the visitor moves through the page.
 */
function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  return (
    <motion.div
      style={{ scaleX: scrollYProgress }}
      className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[60] bg-gradient-to-r from-indigo-400 via-violet-400 to-amber-300"
    />
  );
}

/**
 * Drift — a soft blurred orb that wanders slowly within its section.
 * Used sparingly (one per section, at most) as ambient life behind
 * content rather than as a focal effect.
 */
function Drift({ className = "", color = "#6366F1", size = 480, path }) {
  const defaultPath = { x: [0, 40, -30, 0], y: [0, -35, 20, 0] };
  const motionPath = path || defaultPath;
  return (
    <motion.div
      aria-hidden="true"
      animate={motionPath}
      transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      style={{
        width: size,
        height: size,
        background: color,
      }}
      className={`pointer-events-none absolute rounded-full opacity-[0.10] blur-3xl ${className}`}
    />
  );
}

/**
 * SectionDivider — a hairline that a light "scan" sweeps across on
 * scroll into view, once. A small nod to the "circuitry" of an
 * always-computing platform, kept quiet and used only twice.
 */
function SectionDivider() {
  return (
    <div className="relative h-px w-full bg-white/[0.06] overflow-hidden">
      <motion.div
        initial={{ x: "-100%" }}
        whileInView={{ x: "100%" }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-indigo-400/70 to-transparent"
      />
    </div>
  );
}

/**
 * ShineButton — wraps a button element with a diagonal light sweep on
 * hover, layered under MagneticButton's cursor-follow behavior.
 */
function MagneticButton({ children, className = "", strength = 0.35, ...props }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 300, damping: 20, mass: 0.5 });

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * strength);
    y.set((e.clientY - rect.top - rect.height / 2) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.96 }}
      className={`relative overflow-hidden ${className}`}
      {...props}
    >
      <motion.span
        aria-hidden="true"
        initial={{ x: "-120%" }}
        whileHover={{ x: "120%" }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent skew-x-12"
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/**
 * NeuralField — the page's signature element.
 * A quiet, continuously-forming constellation of nodes and connective
 * lines behind the hero copy: a literal picture of "a personalized
 * path being drawn between what a student knows." Nodes drift slowly,
 * links fade in and out as they pass near one another, and the whole
 * field eases gently toward the cursor. Pauses to a static frame if
 * the visitor has reduced motion enabled.
 */
function NeuralField({ className = "" }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width, height, dpr;
    let nodes = [];
    let raf;

    const NODE_COUNT = 54;
    const LINK_DIST = 140;
    const CURSOR_PULL = 0.00055;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seed = () => {
      nodes = Array.from({ length: NODE_COUNT }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.7 + 1,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const step = (t) => {
      ctx.clearRect(0, 0, width, height);

      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;

        if (mouseRef.current.x != null) {
          n.vx += (mouseRef.current.x - n.x) * CURSOR_PULL;
          n.vy += (mouseRef.current.y - n.y) * CURSOR_PULL;
        }
        n.vx *= 0.995;
        n.vy *= 0.995;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;
        n.x = Math.max(0, Math.min(width, n.x));
        n.y = Math.max(0, Math.min(height, n.y));
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(129, 140, 248, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const n of nodes) {
        const pulse = 0.55 + Math.sin(t * 0.0012 + n.phase) * 0.45;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 172, 250, ${0.4 + pulse * 0.5})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    resize();
    seed();

    if (prefersReducedMotion) {
      step(0); // draw a single static frame, no loop
    } else {
      raf = requestAnimationFrame(step);
    }

    const onResize = () => {
      resize();
      seed();
    };
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => (mouseRef.current = { x: null, y: null });

    window.addEventListener("resize", onResize);
    canvas.parentElement.addEventListener("mousemove", onMove);
    canvas.parentElement.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.parentElement?.removeEventListener("mousemove", onMove);
      canvas.parentElement?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}

/** A small reusable expanding-ring "live" dot. */
function LiveDot({ color = "bg-emerald-400" }) {
  return (
    <span className="relative flex w-1.5 h-1.5">
      <motion.span
        animate={{ scale: [1, 2.6], opacity: [0.6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className={`absolute inset-0 rounded-full ${color}`}
      />
      <span className={`relative w-1.5 h-1.5 rounded-full ${color}`} />
    </span>
  );
}

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroFade = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroShift = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const { scrollY } = useScroll();
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ["0 1px 0 rgba(0,0,0,0)", "0 1px 0 rgba(0,0,0,0.4)"]
  );
  const headerBg = useTransform(
    scrollY,
    [0, 80],
    ["rgba(10,14,23,0.3)", "rgba(10,14,23,0.85)"]
  );

  const nav = [
    { label: "Platform", href: "#features" },
    { label: "Outcomes", href: "#outcomes" },
    { label: "For institutions", href: "#cta" },
  ];

  const features = [
    {
      icon: Brain,
      eyebrow: "Adaptive paths",
      title: "Personalized learning paths",
      description:
        "Eduhub reads a student's performance signal by signal and rebuilds their path in real time — no fixed curriculum, no guessing what to review next.",
    },
    {
      icon: MessageSquare,
      eyebrow: "Always on",
      title: "AI learning assistant",
      description:
        "A tutor that's available at 2am the night before an exam: instant explanations, worked examples, and feedback tuned to how each student learns best.",
    },
    {
      icon: Target,
      eyebrow: "Guided discovery",
      title: "Smart recommendations",
      description:
        "Lessons, drills, and readings surface exactly when a student is ready for them — sequenced by mastery, not by chapter number.",
    },
    {
      icon: ChartNoAxesCombined,
      eyebrow: "Visibility",
      title: "Learning analytics",
      description:
        "Educators see where a class is thriving and where it's stuck, weeks before a test would have told them — with evidence, not averages.",
    },
    {
      icon: BookOpen,
      eyebrow: "Less grading",
      title: "Smart assessments",
      description:
        "Quizzes generate themselves from the material actually taught, and open-ended answers get evaluated with rubric-level consistency.",
    },
    {
      icon: GraduationCap,
      eyebrow: "Long-term growth",
      title: "Academic growth tracking",
      description:
        "Progress compounds visibly over a term, not just a unit — so students and educators can see the shape of improvement, not just a grade.",
    },
  ];

  const stats = [
    { number: "95%", label: "Path-recommendation accuracy", mono: "01" },
    { number: "24/7", label: "AI tutor availability", mono: "02" },
    { number: "10K+", label: "Learning resources indexed", mono: "03" },
    { number: "50+", label: "Partner institutions", mono: "04" },
  ];

  return (
    <main className="relative bg-[#0A0E17] text-[#F1F3F8]">
      <ScrollProgressBar />
      <CursorSpotlight />

      {/* ---------------------------------------------------------- */}
      {/* Nav                                                        */}
      {/* ---------------------------------------------------------- */}
      <motion.header
        style={{ boxShadow: headerShadow, backgroundColor: headerBg }}
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md transition-colors border-b border-white/[0.06]"
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <motion.div
              whileHover={{ rotate: 8, scale: 1.08 }}
              transition={{ type: "spring", stiffness: 300, damping: 12 }}
              className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-semibold text-sm shadow-[0_0_18px_rgba(99,102,241,0.5)]"
            >
              E
            </motion.div>
            <span className="font-semibold tracking-tight">Eduhub</span>
          </div>

          <nav className="hidden md:flex items-center gap-9">
            {nav.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="group relative text-sm text-[#9AA3B2] hover:text-white transition-colors py-1"
              >
                {item.label}
                <span className="absolute left-0 -bottom-0.5 h-px w-full bg-indigo-400 scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-medium px-4 py-2 text-[#F1F3F8] hover:text-indigo-300 transition-colors">
              Sign up
            </button>
            <MagneticButton className="text-sm font-medium px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-400 transition-colors">
              Start learning
            </MagneticButton>
          </div>

          <button
            className="md:hidden"
            onClick={() => setNavOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {navOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        <AnimatePresence>
          {navOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="md:hidden overflow-hidden border-t border-white/[0.06] bg-[#0A0E17]"
            >
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="show"
                className="px-6 py-4 flex flex-col gap-4"
              >
                {nav.map((item) => (
                  <motion.a
                    key={item.label}
                    variants={fadeUp}
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    className="text-sm text-[#9AA3B2]"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.button
                  variants={fadeUp}
                  className="mt-2 text-sm font-medium px-4 py-2.5 rounded-lg bg-indigo-500 text-white text-center"
                >
                  Start learning
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* ---------------------------------------------------------- */}
      {/* Hero                                                       */}
      {/* ---------------------------------------------------------- */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        {/* live background field */}
        <div className="absolute inset-0">
          <NeuralField className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0E17]/20 to-[#0A0E17]" />
        </div>

        <motion.div
          style={{ opacity: heroFade, y: heroShift }}
          className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center w-full"
        >
          <motion.div variants={staggerContainer} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm mb-7"
            >
              <LiveDot color="bg-indigo-400" />
              <span className="text-xs font-mono tracking-wide text-[#9AA3B2]">
                LEARNING PATHS FORMING IN REAL TIME
              </span>
            </motion.div>

            <h1 className="text-5xl lg:text-[3.75rem] font-medium leading-[1.05] tracking-tight font-serif overflow-hidden">
              {["Learn", "smarter,"].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-3">
                  <motion.span
                    variants={{
                      hidden: { y: "110%" },
                      show: {
                        y: 0,
                        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.06 },
                      },
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
              <br />
              {["guided", "by"].map((word, i) => (
                <span key={i} className="inline-block overflow-hidden mr-3">
                  <motion.span
                    variants={{
                      hidden: { y: "110%" },
                      show: {
                        y: 0,
                        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.18 + i * 0.06 },
                      },
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
              <span className="inline-block overflow-hidden">
                <motion.span
                  variants={{
                    hidden: { y: "110%" },
                    show: {
                      y: 0,
                      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.32 },
                    },
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "200% 50%"],
                  }}
                  transition={{
                    backgroundPosition: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 1,
                    },
                  }}
                  style={{ backgroundSize: "200% auto" }}
                  className="inline-block italic bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-violet-300 to-indigo-300"
                >
                  what you actually need.
                </motion.span>
              </span>
            </h1>

            <motion.p
              variants={fadeUp}
              className="mt-7 text-lg text-[#9AA3B2] leading-relaxed max-w-lg"
            >
              Eduhub is a personalized learning platform that rebuilds each
              student's path as they learn — matching lessons, feedback, and
              pace to their real progress, not a fixed syllabus.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-4">
              <MagneticButton className="group px-7 py-3.5 rounded-xl bg-indigo-500 text-white font-medium hover:bg-indigo-400 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.25)]">
                Start learning
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="inline-flex"
                >
                  <ArrowRight size={18} />
                </motion.span>
              </MagneticButton>
              <MagneticButton
                strength={0.25}
                className="px-7 py-3.5 rounded-xl border border-white/15 font-medium hover:border-white/40 transition-colors"
              >
                Explore the platform
              </MagneticButton>
            </motion.div>
          </motion.div>

          {/* Dashboard preview, mouse-parallax on hover */}
          <ParallaxCard />
        </motion.div>

        <motion.a
          href="#features"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#7C8598] hover:text-indigo-300 transition-colors"
        >
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} />
          </motion.span>
        </motion.a>
      </section>

      <SectionDivider />

      {/* ---------------------------------------------------------- */}
      {/* Features                                                   */}
      {/* ---------------------------------------------------------- */}
      <section id="features" className="relative py-28 bg-[#0B1020] overflow-hidden">
        <Drift className="top-0 -left-40" color="#6366F1" size={520} />
        <Drift
          className="bottom-0 -right-40"
          color="#FBBF24"
          size={420}
          path={{ x: [0, -30, 25, 0], y: [0, 25, -20, 0] }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="max-w-2xl mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="text-xs font-mono tracking-widest text-indigo-300"
            >
              CAPABILITIES
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="mt-4 text-4xl font-medium tracking-tight font-serif"
            >
              Everything a personalized classroom needs
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-4 text-[#9AA3B2] leading-relaxed">
              Six systems working from the same signal — a student's actual
              progress — so nothing a teacher builds or a student learns gets
              lost between tools.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden p-7 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-indigo-400/40 hover:bg-white/[0.04] hover:shadow-[0_0_40px_rgba(99,102,241,0.08)] transition-all"
                >
                  <motion.span
                    aria-hidden="true"
                    initial={{ x: "-130%" }}
                    whileHover={{ x: "130%" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/[0.06] to-transparent skew-x-12"
                  />
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{
                      duration: 3.4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: (index % 3) * 0.4,
                    }}
                    whileHover={{ rotate: 8, scale: 1.08 }}
                    className="w-11 h-11 rounded-xl bg-indigo-500/15 flex items-center justify-center"
                  >
                    <Icon className="text-indigo-300" size={22} />
                  </motion.div>
                  <span className="block mt-5 text-xs font-mono tracking-wide text-[#7C8598]">
                    {item.eyebrow.toUpperCase()}
                  </span>
                  <h3 className="mt-2 text-xl font-medium tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[#9AA3B2] leading-relaxed text-[15px]">
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Stats                                                      */}
      {/* ---------------------------------------------------------- */}
      <section id="outcomes" className="relative bg-[#0A0E17] text-white py-24 overflow-hidden">
        <Drift className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" color="#818CF8" size={600} />
        <div className="relative max-w-7xl mx-auto px-6">
          <span className="text-xs font-mono tracking-widest text-indigo-300">
            RESULTS
          </span>
          <div className="mt-10 grid md:grid-cols-4 gap-10">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="border-t border-white/10 pt-6"
              >
                <span className="text-xs font-mono text-white/30">
                  {stat.mono}
                </span>
                <motion.h3
                  initial={{ opacity: 0, scale: 0.6 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  animate={{
                    textShadow: [
                      "0 0 0px rgba(129,140,248,0)",
                      "0 0 18px rgba(129,140,248,0.35)",
                      "0 0 0px rgba(129,140,248,0)",
                    ],
                  }}
                  transition={{
                    scale: {
                      type: "spring",
                      stiffness: 260,
                      damping: 14,
                      delay: index * 0.08 + 0.15,
                    },
                    opacity: { delay: index * 0.08 + 0.15 },
                    textShadow: {
                      duration: 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.3,
                    },
                  }}
                  className="mt-3 text-4xl font-medium font-serif"
                >
                  {stat.number}
                </motion.h3>
                <p className="mt-2 text-sm text-white/50">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ---------------------------------------------------------- */}
      {/* CTA                                                        */}
      {/* ---------------------------------------------------------- */}
      <section id="cta" className="relative py-28 bg-[#0B1020] overflow-hidden">
        <Drift
          className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          color="#6366F1"
          size={520}
          path={{ x: [0, 40, -20, 0], y: [0, -30, 10, 0] }}
        />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="relative max-w-4xl mx-auto px-6 text-center"
        >
          <motion.div
            variants={fadeUp}
            animate={{
              y: [0, -6, 0],
              filter: [
                "drop-shadow(0 0 0px rgba(251,191,36,0))",
                "drop-shadow(0 0 14px rgba(251,191,36,0.55))",
                "drop-shadow(0 0 0px rgba(251,191,36,0))",
              ],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="inline-flex"
          >
            <Lightbulb className="mx-auto text-amber-300" size={36} strokeWidth={1.5} />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            className="mt-6 text-4xl font-medium tracking-tight font-serif"
          >
            Build the future of learning with Eduhub
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="mt-5 text-[#9AA3B2] leading-relaxed max-w-xl mx-auto"
          >
            Bring adaptive, AI-guided learning to your students or your
            institution — set up in an afternoon, not a semester.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap justify-center gap-4">
            <MagneticButton className="px-8 py-3.5 bg-indigo-500 text-white rounded-xl font-medium hover:bg-indigo-400 transition-colors shadow-[0_0_30px_rgba(99,102,241,0.25)]">
              Get started with Eduhub
            </MagneticButton>
            <MagneticButton
              strength={0.25}
              className="px-8 py-3.5 border border-white/15 rounded-xl font-medium hover:border-white/40 transition-colors"
            >
              Talk to sales
            </MagneticButton>
          </motion.div>
        </motion.div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/* Footer                                                     */}
      {/* ---------------------------------------------------------- */}
      <footer className="border-t border-white/[0.08] bg-[#0A0E17] py-14">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between gap-8"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-semibold text-xs">
              E
            </div>
            <span className="font-medium text-sm text-[#9AA3B2]">
              © {new Date().getFullYear()} Eduhub
            </span>
          </div>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex gap-8 text-sm text-[#9AA3B2]"
          >
            {[
              { label: "Platform", href: "#features" },
              { label: "Outcomes", href: "#outcomes" },
              { label: "Institutions", href: "#cta" },
            ].map((link) => (
              <motion.a
                key={link.label}
                variants={fadeUp}
                href={link.href}
                whileHover={{ y: -2, color: "#C7D2FE" }}
                className="transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </footer>
    </main>
  );
}

/**
 * ParallaxCard — the hero's dashboard preview, tilting gently toward
 * the cursor. Kept as its own component so the mouse listener is
 * scoped to the card, not the whole hero.
 */
function ParallaxCard() {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: px * 6, y: py * -6 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(900px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
      }}
      className="relative transition-transform duration-200 ease-out"
    >
      <div className="bg-[#12172A] shadow-2xl shadow-black/40 rounded-3xl p-8 border border-white/[0.08]">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-lg">Student dashboard</h3>
          <div className="flex items-center gap-1.5">
            <LiveDot />
            <span className="text-xs font-mono text-[#7C8598]">LIVE</span>
          </div>
        </div>

        <div className="mt-7 space-y-4">
          <div className="bg-indigo-500/10 p-5 rounded-xl border border-indigo-400/10">
            <p className="text-xs font-mono tracking-wide text-indigo-300">
              AI RECOMMENDED
            </p>
            <p className="mt-1.5 font-medium">Advanced Machine Learning</p>
          </div>

          <div className="bg-white/[0.03] p-5 rounded-xl border border-white/[0.06]">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">Learning progress</p>
              <span className="text-sm font-mono text-[#9AA3B2]">80%</span>
            </div>
            <div className="w-full bg-white/10 h-2 rounded-full mt-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "80%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="bg-indigo-400 h-2 rounded-full"
              />
            </div>
          </div>

          <div className="bg-amber-400/10 p-5 rounded-xl border border-amber-300/15">
            <div className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 15, -10, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles size={14} className="text-amber-300" />
              </motion.span>
              <p className="text-xs font-mono tracking-wide text-amber-200">
                AI FEEDBACK
              </p>
            </div>
            <p className="mt-1.5 text-[#9AA3B2] text-sm leading-relaxed">
              Strong improvement in problem-solving this week — ready to
              move on to applied projects.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
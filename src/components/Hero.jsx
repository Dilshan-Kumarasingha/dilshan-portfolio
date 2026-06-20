import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRight, Sparkles, Mail, Terminal } from 'lucide-react'
import AIAssistant from './AIAssistant'
import profilePhoto from '../assets/Profile 2.jpeg'
import '../styles/Hero.css'

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const STACK_LOG = [
  'java', 'spring-boot', 'csharp', '.net-core', 'postgresql',
  'selenium', 'nunit', 'react', 'docker', 'aws'
]

function TestRunnerBadge({ prefersReducedMotion }) {
  const dotCount = 5
  const dots = Array.from({ length: dotCount })

  return (
    <div className="trb" aria-hidden="true">
      {dots.map((_, i) => (
        <motion.span
          key={i}
          className="trb-dot"
          initial={{ backgroundColor: '#FF5D5D' }}
          animate={
            prefersReducedMotion
              ? { backgroundColor: '#3DDC84' }
              : {
                  backgroundColor: ['#FF5D5D', '#FF5D5D', '#E8B339', '#3DDC84', '#3DDC84'],
                }
          }
          transition={{
            duration: 1.6,
            delay: 0.4 + i * 0.18,
            times: [0, 0.35, 0.6, 0.8, 1],
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  )
}


function TypedHeadline({ prefersReducedMotion }) {
  const fullText = 'Builds the system. Breaks it on purpose. Ships it proven.'
  const [shown, setShown] = useState(prefersReducedMotion ? fullText.length : 0)

  useEffect(() => {
    if (prefersReducedMotion) return
    let i = 0
    const id = setInterval(() => {
      i += 1
      setShown(i)
      if (i >= fullText.length) clearInterval(id)
    }, 22)
    return () => clearInterval(id)
  }, [prefersReducedMotion])

  const visible = fullText.slice(0, shown)
  const parts = visible.split('. ')

  return (
    <h1 className="hero-headline">
      {parts.map((part, idx) => (
        <span key={idx} className={idx === 1 ? 'headline-accent' : ''}>
          {part}
          {idx < parts.length - 1 ? '. ' : ''}
        </span>
      ))}
      <motion.span
        className="type-cursor"
        animate={{ opacity: [1, 1, 0, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </h1>
  )
}

// Infinite-scrolling marquee of the real stack — the "build log" ticker.
function StackTicker() {
  const loopItems = [...STACK_LOG, ...STACK_LOG]
  return (
    <div className="stack-ticker" aria-hidden="true">
      <div className="stack-ticker-track">
        {loopItems.map((item, idx) => (
          <span className="stack-ticker-item" key={idx}>
            <span className="stack-ticker-bracket">{'>'}</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

// Drifting dot field — a handful of small particles slowly floating
// upward through the backdrop, like log lines scrolling off-screen.
// Purely decorative, sits behind everything else.
function ParticleField({ prefersReducedMotion }) {
  if (prefersReducedMotion) return null

  const particles = [
    { left: '8%', size: 3, duration: 14, delay: 0 },
    { left: '22%', size: 2, duration: 18, delay: 2 },
    { left: '38%', size: 2, duration: 16, delay: 5 },
    { left: '54%', size: 3, duration: 20, delay: 1 },
    { left: '68%', size: 2, duration: 15, delay: 7 },
    { left: '81%', size: 2, duration: 19, delay: 3 },
    { left: '92%', size: 3, duration: 17, delay: 6 },
  ]

  return (
    <div className="hero-particle-field" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="hero-particle"
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
          }}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '-10%', opacity: [0, 0.7, 0.7, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// Magnetic button — the primary CTA gently pulls toward the cursor
// within a small radius, then springs back on mouse leave.
function MagneticButton({ children, prefersReducedMotion, ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18 })
  const springY = useSpring(y, { stiffness: 200, damping: 18 })

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * 0.25)
    y.set(relY * 0.25)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function Hero() {
  const [isAiOpen, setIsAiOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef(null)
  const [hasFinePointer, setHasFinePointer] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(pointer: fine)').matches
  })

  useEffect(() => {
    if (!window.matchMedia) return
    const query = window.matchMedia('(pointer: fine)')
    const handleChange = (e) => setHasFinePointer(e.matches)
    query.addEventListener('change', handleChange)
    return () => query.removeEventListener('change', handleChange)
  }, [])

  // Cursor-reactive glow — desktop-only ambient effect
  const mvX = useMotionValue(50)
  const mvY = useMotionValue(20)
  const glowX = useSpring(mvX, { stiffness: 50, damping: 20 })
  const glowY = useSpring(mvY, { stiffness: 50, damping: 20 })

  // Photo tilt — small 3D rotation that follows the cursor across the
  // whole hero, independent springs so it settles with a slight delay
  // relative to the glow for a layered, parallax feel.
  const tiltX = useTransform(mvY, [0, 100], [8, -8])
  const tiltY = useTransform(mvX, [0, 100], [-8, 8])
  const springTiltX = useSpring(tiltX, { stiffness: 80, damping: 15 })
  const springTiltY = useSpring(tiltY, { stiffness: 80, damping: 15 })

  useEffect(() => {
    if (prefersReducedMotion) return
    const node = heroRef.current
    if (!node) return
    const handleMove = (e) => {
      const rect = node.getBoundingClientRect()
      mvX.set(((e.clientX - rect.left) / rect.width) * 100)
      mvY.set(((e.clientY - rect.top) / rect.height) * 100)
    }
    node.addEventListener('mousemove', handleMove)
    return () => node.removeEventListener('mousemove', handleMove)
  }, [prefersReducedMotion, mvX, mvY])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.6, staggerChildren: 0.09, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="hero" ref={heroRef}>
      <div className="hero-backdrop">
        <div className="hero-grid" />
        <motion.div
          className="hero-cursor-glow"
          style={
            prefersReducedMotion
              ? { left: '50%', top: '15%' }
              : { left: glowX, top: glowY }
          }
        />
        <div className="hero-vignette" />
        <div className="hero-noise" />
        <ParticleField prefersReducedMotion={prefersReducedMotion} />
      </div>

      <motion.div
        className="hero-frame"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="hero-columns">
          <div className="hero-text-col">
            <motion.div className="hero-status-row" variants={itemVariants}>
              <div className="hero-status-pill">
                <Terminal size={13} className="status-pill-icon" />
                <span className="status-pill-text">
                  run --target=hiring · colombo, lk
                </span>
              </div>
              <TestRunnerBadge prefersReducedMotion={prefersReducedMotion} />
            </motion.div>

            <motion.div variants={itemVariants}>
              <TypedHeadline prefersReducedMotion={prefersReducedMotion} />
            </motion.div>

            <motion.p className="hero-editorial-body" variants={itemVariants}>
              Full-stack engineer with banking-grade discipline. I architect
              high-throughput backends in Java, Spring Boot, and .NET Core,
              then hold them accountable with the same QA automation rigor a
              bank's release process demands.
            </motion.p>

            <motion.div className="hero-action-cluster" variants={itemVariants}>
              <MagneticButton
                href="#projects"
                className="action-btn-primary"
                prefersReducedMotion={prefersReducedMotion}
                whileHover={prefersReducedMotion ? {} : { scale: 1.04 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.97 }}
              >
                <span>Explore Systems</span>
                <ArrowUpRight size={16} className="action-btn-arrow" />
              </MagneticButton>

              <motion.button
                className="action-btn-secondary"
                onClick={() => setIsAiOpen(true)}
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
                whileTap={prefersReducedMotion ? {} : { scale: 0.98 }}
              >
                <Sparkles size={15} className="sparkles-icon" />
                <span>Ask the Assistant</span>
              </motion.button>
            </motion.div>

            <motion.div className="hero-utility-nav" variants={itemVariants}>
              <a
                href="https://github.com/Dilshan-Kumarasingha"
                target="_blank"
                rel="noreferrer"
                className="nav-item"
              >
                <GithubIcon />
                <span>GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/dilshan-kumarasingha"
                target="_blank"
                rel="noreferrer"
                className="nav-item"
              >
                <LinkedinIcon />
                <span>LinkedIn</span>
              </a>
              <a href="mailto:dilshan.jkumarasingha@gmail.com" className="nav-item">
                <Mail size={16} />
                <span>Email</span>
              </a>
            </motion.div>
          </div>

          <motion.div className="hero-photo-col" variants={itemVariants}>
            <motion.div
              className="photo-terminal-frame"
              style={
                prefersReducedMotion || !hasFinePointer
                  ? undefined
                  : {
                      rotateX: springTiltX,
                      rotateY: springTiltY,
                      transformPerspective: 800,
                    }
              }
              animate={
                prefersReducedMotion
                  ? undefined
                  : { y: [0, -10, 0] }
              }
              transition={
                prefersReducedMotion
                  ? undefined
                  : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
              }
            >
              <div className="photo-terminal-titlebar">
                <span className="photo-terminal-dot dot-red" />
                <span className="photo-terminal-dot dot-amber" />
                <span className="photo-terminal-dot dot-green" />
                <span className="photo-terminal-filename">
                  dilshan.jpeg
                </span>
              </div>
              <div className="photo-terminal-body">
                <img
                  src={profilePhoto}
                  alt="Dilshan Kumarasingha"
                  className="hero-photo-img"
                />
                {!prefersReducedMotion && (
                  <motion.div
                    className="photo-scan-line"
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: 1,
                    }}
                  />
                )}
                <span className="photo-corner photo-corner-tl" />
                <span className="photo-corner photo-corner-tr" />
                <span className="photo-corner photo-corner-bl" />
                <span className="photo-corner photo-corner-br" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="hero-scroll-cue"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <span>scroll</span>
        <motion.span
          className="hero-scroll-line"
          animate={prefersReducedMotion ? {} : { scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      <StackTicker />

      <AnimatePresence>
        {isAiOpen && <AIAssistant onClose={() => setIsAiOpen(false)} />}
      </AnimatePresence>
    </section>
  )
}

export default Hero
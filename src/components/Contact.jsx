import { useRef } from 'react'
import { motion, useReducedMotion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { Mail } from 'lucide-react'
import '../styles/Contact.css'

// Inline SVG keeps this independent of whatever lucide-react version is installed.
const LinkedinIcon = ({ size = 18 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const GithubIcon = ({ size = 16 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

// The deploy log script. Each line carries its own delay (seconds from
// sequence start) and a "kind" that controls styling: plain run lines,
// pass checks, and the final ready state.
const DEPLOY_LOG = [
  { text: 'Running final checks…', kind: 'run', delay: 0 },
  { text: 'All tests passed', kind: 'pass', delay: 0.55 },
  { text: 'Build verified', kind: 'pass', delay: 0.95 },
  { text: 'Deploying contact channel…', kind: 'run', delay: 1.4 },
  { text: 'Ready to receive', kind: 'ready', delay: 2.0 },
]

const TOTAL_SEQUENCE_S = 2.0

function LogLine({ line, started }) {
  const icon = line.kind === 'pass' || line.kind === 'ready' ? '✓' : '›'
  return (
    <motion.div
      className={`log-line log-line-${line.kind}`}
      initial={{ opacity: 0, x: -6 }}
      animate={started ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.35, delay: line.delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="log-line-icon">{icon}</span>
      <span className="log-line-text">{line.text}</span>
    </motion.div>
  )
}

// Terminal panel: plays the deploy log once when scrolled into view,
// then settles into a steady "ready" state with a live pulse rather
// than a blinking placeholder cursor.
function DeployTerminal({ prefersReducedMotion }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const started = prefersReducedMotion || isInView
  const settledDelay = prefersReducedMotion ? 0 : TOTAL_SEQUENCE_S

  return (
    <div className="deploy-terminal" ref={ref}>
      <div className="deploy-terminal-titlebar">
        <span className="deploy-dot dot-red" />
        <span className="deploy-dot dot-amber" />
        <span className="deploy-dot dot-green" />
        <span className="deploy-terminal-filename">deploy.log</span>
      </div>
      <div className="deploy-terminal-body">
        {DEPLOY_LOG.map((line) => (
          <LogLine key={line.text} line={line} started={started} />
        ))}

        <motion.div
          className="deploy-status-row"
          initial={{ opacity: 0 }}
          animate={started ? { opacity: 1 } : {}}
          transition={{ delay: settledDelay + 0.3, duration: 0.5 }}
        >
          <span className="deploy-status-pulse" aria-hidden="true">
            <motion.span
              className="deploy-status-pulse-core"
              animate={prefersReducedMotion ? {} : { opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
          <span className="deploy-status-text">open to opportunities</span>
        </motion.div>
      </div>
    </div>
  )
}

// Magnetic wrapper for the primary CTA — gently pulls toward the
// cursor within a small radius, springs back on mouse leave. Echoes
// the same device used on the Hero's primary button, tying the page
// together at open and close.
function MagneticLink({ children, prefersReducedMotion, className, ...props }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 200, damping: 18 })
  const springY = useSpring(y, { stiffness: 200, damping: 18 })

  const handleMouseMove = (e) => {
    if (prefersReducedMotion || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.25)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.25)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.a
      ref={ref}
      className={className}
      style={prefersReducedMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </motion.a>
  )
}

function Contact() {
  const prefersReducedMotion = useReducedMotion()

  // Contact actions reveal slightly after the deploy log starts
  // resolving, so the card reads as output from the sequence rather
  // than an independent block animating in parallel.
  const revealDelay = prefersReducedMotion ? 0 : TOTAL_SEQUENCE_S * 0.55

  const cardVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: revealDelay, ease: [0.16, 1, 0.3, 1] },
    },
  }

  const actionVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 12 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: revealDelay + 0.15 + i * 0.08,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  }

  return (
    <section className="contact" id="contact">
      <div className="contact-inner">
        <span className="section-eyebrow">
          <span className="eyebrow-bracket">{'//'}</span> Contact
        </span>

        <div className="contact-split">
          <DeployTerminal prefersReducedMotion={prefersReducedMotion} />

          <motion.div
            className="contact-card"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={cardVariants}
          >
            <h2 className="contact-title">Let's build something that holds.</h2>
            <p className="contact-sub">
              Open to full-stack and QA engineering roles at enterprise
              software companies. Based in Colombo — available immediately.
            </p>

            <div className="contact-actions">
              <motion.div
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={actionVariants}
              >
                <MagneticLink
                  href="mailto:dilshan.jkumarasingha@gmail.com"
                  className="btn-primary contact-btn"
                  prefersReducedMotion={prefersReducedMotion}
                >
                  <Mail size={18} />
                  dilshan.jkumarasingha@gmail.com
                </MagneticLink>
              </motion.div>

              <motion.div
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={actionVariants}
              >
                <a
                  href="https://linkedin.com/in/dilshan-kumarasingha"
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost contact-btn"
                >
                  <LinkedinIcon size={18} />
                  <span>LinkedIn Profile</span>
                </a>
              </motion.div>
            </div>

            <motion.div
              className="contact-links"
              custom={2}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              variants={actionVariants}
            >
              <a
                href="https://github.com/Dilshan-Kumarasingha"
                target="_blank"
                rel="noreferrer"
                className="contact-link"
              >
                <GithubIcon size={15} />
                <span>GitHub</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        <div className="footer-note">
          <span>Dilshan Kumarasingha</span>
          <span>Built with React and Framer Motion</span>
        </div>
      </div>
    </section>
  )
}

export default Contact
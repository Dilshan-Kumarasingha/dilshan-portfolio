import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion, useInView, animate } from 'framer-motion'
import '../styles/About.css'

const stats = [
  { value: 2, suffix: '+', label: 'Years in banking & enterprise software' },
  { value: 3, suffix: '', label: 'QA layers covered — UI, API, Database' },
  { value: 10, suffix: '+', label: 'Business rules tested at service layer' },
  { value: 40, suffix: '+', label: 'Workstations deployed at Lyceum IMS' },
]

const timeline = [
  {
    ref: '2026 → present',
    role: 'IT Support & Lab Demonstrator',
    company: 'Lyceum International Schools',
  },
  {
    ref: '2023 → 2024',
    role: 'Software Developer Intern',
    company: 'Bank of Ceylon',
  },
]

const GLYPHS = '!<>-_\\/[]{}—=+*^?#01'
const HEADLINE_PLAIN = 'Built for environments where '
const HEADLINE_ACCENT = 'bugs cost real money.'

// Decrypt-style text reveal — characters scramble through random glyphs
// before settling left-to-right on the real text, like a value being
// decoded. Runs once when scrolled into view; renders plainly for
// reduced-motion users.
function DecryptHeadline({ prefersReducedMotion }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const fullText = HEADLINE_PLAIN + HEADLINE_ACCENT
  const [display, setDisplay] = useState(
    prefersReducedMotion ? fullText : ''
  )
  const hasRunRef = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion || !isInView || hasRunRef.current) return
    hasRunRef.current = true

    let frame = 0
    const totalFrames = 22
    const revealStep = fullText.length / totalFrames

    const interval = setInterval(() => {
      frame += 1
      const revealedCount = Math.min(
        fullText.length,
        Math.floor(frame * revealStep)
      )

      const next = fullText
        .split('')
        .map((char, idx) => {
          if (idx < revealedCount) return char
          if (char === ' ') return ' '
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')

      setDisplay(next)

      if (revealedCount >= fullText.length) {
        clearInterval(interval)
        setDisplay(fullText)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [isInView, prefersReducedMotion, fullText])

  const accentStart = HEADLINE_PLAIN.length
  const plainPart = display.slice(0, accentStart)
  const accentPart = display.slice(accentStart)

  return (
    <h2 className="section-title" ref={ref}>
      {plainPart}
      <span className="headline-accent">{accentPart}</span>
    </h2>
  )
}

// Count-up number — animates from 0 to the target value once visible.
function CountUpStat({ value, suffix, prefersReducedMotion }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const [display, setDisplay] = useState(prefersReducedMotion ? value : 0)

  useEffect(() => {
    if (prefersReducedMotion || !isInView) return
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(Math.round(latest)),
    })
    return () => controls.stop()
  }, [isInView, prefersReducedMotion, value])

  return (
    <span className="stat-value" ref={ref}>
      {display}
      {suffix}
    </span>
  )
}

function About() {
  const prefersReducedMotion = useReducedMotion()

  const elementVariants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
    },
  }

  return (
    <section className="about" id="about">
      <div className="about-inner">
        <div className="about-grid">
          <motion.div
            className="about-left"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={elementVariants}
          >
            <span className="section-eyebrow">
              <span className="eyebrow-bracket">{'//'}</span> About
              <span className="eyebrow-cursor" aria-hidden="true" />
            </span>

            <DecryptHeadline prefersReducedMotion={prefersReducedMotion} />

            <div className="about-text-stack">
              <p className="about-text">
                I started my career inside Bank of Ceylon — one of Sri
                Lanka's largest state banks — contributing to core banking
                features across the full SDLC in a security-compliant
                environment handling millions of daily transactions.
              </p>
              <p className="about-text">
                That experience shaped how I build: every feature needs to
                work, every edge case needs a test, and every deployment
                needs to be predictable. I bring that same discipline to
                every project I ship.
              </p>
              <p className="about-text">
                Currently targeting enterprise software roles at companies
                like Sampath IT Solutions, WSO2, IFS, and Virtusa — where
                software quality is not optional.
              </p>
            </div>
          </motion.div>

          <div className="about-right">
            <div className="stats-monolithic-grid">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="stat-metric-block"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={elementVariants}
                  transition={{ delay: i * 0.06 }}
                >
                  <CountUpStat
                    value={stat.value}
                    suffix={stat.suffix}
                    prefersReducedMotion={prefersReducedMotion}
                  />
                  <span className="stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="experience-ledger"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={elementVariants}
            >
              <span className="ledger-header">
                <span className="ledger-header-icon">{'$'}</span> git log
                --career
              </span>

              <div className="ledger-track">
                <motion.span
                  className="ledger-track-line"
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.9,
                    delay: 0.2,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  aria-hidden="true"
                />
                {timeline.map((entry, i) => (
                  <motion.div
                    className="ledger-row"
                    key={entry.ref}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.4,
                      delay: prefersReducedMotion ? 0 : 0.3 + i * 0.25,
                    }}
                  >
                    <span className="ledger-node" aria-hidden="true" />
                    <span className="ledger-year">{entry.ref}</span>
                    <div className="ledger-details">
                      <span className="ledger-role">{entry.role}</span>
                      <span className="ledger-company">{entry.company}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
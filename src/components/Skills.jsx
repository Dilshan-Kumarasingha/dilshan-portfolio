import { useState, useMemo } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import '../styles/Skills.css'

// Source data kept as raw 0-100 working estimates — same honest
// self-assessment as before — but the UI never shows the number.
// Instead each skill is bucketed into one of three defensible tiers.
// Thresholds: Core = what I'd lead with, Working = solid and
// shippable, Familiar = real exposure, not deep expertise.
const RAW_SKILLS = {
  Backend: [
    { name: 'Java', level: 75 },
    { name: 'Spring Boot', level: 60 },
    { name: 'C#', level: 68 },
    { name: 'ASP.NET Core', level: 65 },
    { name: 'Python', level: 68 },
    { name: 'Django REST', level: 55 },
  ],
  Frontend: [
    { name: 'React 18', level: 75 },
    { name: 'TypeScript', level: 70 },
    { name: 'JavaScript', level: 75 },
    { name: 'Tailwind CSS', level: 60 },
    { name: 'Framer Motion', level: 62 },
  ],
  Databases: [
    { name: 'PostgreSQL', level: 75 },
    { name: 'SQL Server', level: 62 },
    { name: 'MySQL', level: 68 },
  ],
  'QA & Testing': [
    { name: 'Selenium WebDriver', level: 62 },
    { name: 'TestNG', level: 65 },
    { name: 'NUnit', level: 60 },
    { name: 'RestAssured', level: 62 },
    { name: 'Allure Reports', level: 60 },
  ],
  'DevOps & Cloud': [
    { name: 'Docker', level: 60 },
    { name: 'GitHub Actions', level: 75 },
    { name: 'AWS', level: 68 },
    { name: 'Kubernetes', level: 55 },
    { name: 'Istio', level: 45 },
  ],
  Tools: [
    { name: 'Git', level: 80 },
    { name: 'Postman', level: 75 },
    { name: 'IntelliJ IDEA', level: 78 },
    { name: 'VS Code', level: 82 },
    { name: 'Visual Studio', level: 65 },
  ],
}

const TIERS = {
  core: { label: 'Core', rank: 3, threshold: 70 },
  working: { label: 'Working', rank: 2, threshold: 55 },
  familiar: { label: 'Familiar', rank: 1, threshold: 0 },
}

function tierFor(level) {
  if (level >= TIERS.core.threshold) return 'core'
  if (level >= TIERS.working.threshold) return 'working'
  return 'familiar'
}

// Flatten into a single list of { name, category, tier } and group
// by category for rendering, with skills sorted by tier rank inside
// each category so the strongest skills surface first.
const SKILLS = Object.entries(RAW_SKILLS).flatMap(([category, list]) =>
  list.map((s) => ({ ...s, category, tier: tierFor(s.level) }))
)

const CATEGORIES = ['All', ...Object.keys(RAW_SKILLS)]

function groupAndSort(skills) {
  const byCategory = {}
  skills.forEach((s) => {
    if (!byCategory[s.category]) byCategory[s.category] = []
    byCategory[s.category].push(s)
  })
  Object.values(byCategory).forEach((list) =>
    list.sort((a, b) => TIERS[b.tier].rank - TIERS[a.tier].rank)
  )
  return byCategory
}

// Three-dot tier indicator. Filled dot count = tier rank. Replaces
// the percentage bar — communicates relative strength without
// claiming a precision that was never real to begin with.
function TierDots({ tier }) {
  const rank = TIERS[tier].rank
  return (
    <span className={`tier-dots tier-dots-${tier}`} aria-hidden="true">
      {[1, 2, 3].map((i) => (
        <span key={i} className={`tier-dot ${i <= rank ? 'tier-dot-filled' : ''}`} />
      ))}
    </span>
  )
}

function SkillRow({ skill, index, prefersReducedMotion }) {
  return (
    <motion.div
      className="skill-row"
      layout
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: prefersReducedMotion ? 0 : -6 }}
      transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : index * 0.025, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="skill-row-name">{skill.name}</span>
      <span className="skill-row-meta">
        <span className={`skill-row-tier-label tier-text-${skill.tier}`}>
          {TIERS[skill.tier].label}
        </span>
        <TierDots tier={skill.tier} />
      </span>
    </motion.div>
  )
}

function CategoryBlock({ category, skills, prefersReducedMotion }) {
  return (
    <div className="category-block">
      <div className="category-block-header">
        <h3 className="category-block-title">{category}</h3>
        <span className="category-block-count">[{skills.length}]</span>
      </div>
      <div className="category-block-rows">
        <AnimatePresence mode="popLayout">
          {skills.map((skill, idx) => (
            <SkillRow
              key={skill.name}
              skill={skill}
              index={idx}
              prefersReducedMotion={prefersReducedMotion}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function Skills() {
  const prefersReducedMotion = useReducedMotion()
  const [activeCategory, setActiveCategory] = useState('All')

  const visibleSkills = useMemo(
    () =>
      activeCategory === 'All'
        ? SKILLS
        : SKILLS.filter((s) => s.category === activeCategory),
    [activeCategory]
  )

  const grouped = useMemo(() => groupAndSort(visibleSkills), [visibleSkills])
  const categoryOrder =
    activeCategory === 'All' ? Object.keys(RAW_SKILLS) : [activeCategory]

  return (
    <section className="skills" id="skills">
      <div className="skills-inner">
        <motion.div
          className="section-header"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="section-eyebrow">
            <span className="eyebrow-bracket">{'//'}</span> Capabilities
          </span>
          <h2 className="section-title">
            What I <span className="title-accent">work with</span>
          </h2>
          <p className="section-sub">
            Proven across banking systems, real-time platforms, and full QA
            automation pipelines. Tiers reflect honest working proficiency —
            Core is what I'd lead with, Familiar is real exposure without
            deep mastery.
          </p>
        </motion.div>

        <motion.div
          className="tier-legend"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {Object.entries(TIERS)
            .sort((a, b) => b[1].rank - a[1].rank)
            .map(([key, tier]) => (
              <span className="tier-legend-item" key={key}>
                <TierDots tier={key} />
                <span className={`tier-legend-label tier-text-${key}`}>{tier.label}</span>
              </span>
            ))}
        </motion.div>

        <motion.div
          className="category-filter-row"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          role="tablist"
          aria-label="Filter skills by category"
        >
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={activeCategory === cat}
              className={`category-filter-btn ${activeCategory === cat ? 'category-filter-btn-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        <motion.div
          className="skills-spec-sheet"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {categoryOrder.map((category) =>
            grouped[category] ? (
              <CategoryBlock
                key={category}
                category={category}
                skills={grouped[category]}
                prefersReducedMotion={prefersReducedMotion}
              />
            ) : null
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default Skills
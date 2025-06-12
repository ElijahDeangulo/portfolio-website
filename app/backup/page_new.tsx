'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, PanInfo } from 'framer-motion'

// ... existing imports and components remain the same ...
// I'll add the basic structure for now, then copy the components

interface Project {
  title: string;
  emoji: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  features: string[];
  impact: string;
  github?: string;
  demo?: string;
  website?: string;
}

type ProjectId = 'ar-automation' | 'pricing-intelligence' | 'revenue-intelligence' | 'special-miracle';

const projectDetails: Record<ProjectId, Project> = {
  'ar-automation': {
    title: 'AR Automation Platform',
    emoji: '🤖',
    description: 'End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing. Built for enterprise scale with PySpark and Foundry.',
    fullDescription: 'A comprehensive AI-powered platform that revolutionizes accounts receivable processes through intelligent automation. The system leverages multi-agent LLM orchestration to handle complex business logic, RAG (Retrieval-Augmented Generation) techniques for contextual decision-making, and real-time payment processing for immediate financial impact.',
    technologies: ['PySpark', 'LLM', 'RAG', 'Foundry', 'TypeScript', 'Python', 'Apache Kafka', 'PostgreSQL'],
    features: [
      'Multi-agent LLM orchestration for complex workflows',
      'RAG-based contextual decision making',
      'Real-time payment processing and reconciliation',
      'Enterprise-scale data processing with PySpark',
      'Automated invoice matching and dispute resolution',
      'ML-driven risk assessment and fraud detection'
    ],
    impact: 'Reduced manual processing time by 85% and improved cash flow by $2.3M annually',
    github: 'https://github.com/ElijahDeangulo/ar-automation',
    demo: 'https://demo.ar-automation.com'
  },
  'pricing-intelligence': {
    title: 'Pricing Intelligence Platform',
    emoji: '📈',
    description: 'Bayesian optimization models with demand curve simulation and real-time anomaly detection. Drove $10M+ in projected revenue impact through intelligent pricing strategies.',
    fullDescription: 'An advanced ML-driven pricing platform that uses Bayesian optimization to determine optimal pricing strategies. The system simulates demand curves, detects market anomalies in real-time, and provides actionable insights for revenue optimization.',
    technologies: ['Bayesian Optimization', 'Python', 'Real-time Analytics', 'ML Models', 'TensorFlow', 'Redis', 'Apache Airflow'],
    features: [
      'Bayesian optimization for price discovery',
      'Real-time demand curve simulation',
      'Market anomaly detection and alerts',
      'A/B testing framework for pricing strategies',
      'Revenue impact forecasting',
      'Competitive pricing analysis'
    ],
    impact: 'Generated $10M+ in projected revenue impact with 23% improvement in pricing accuracy',
    github: 'https://github.com/ElijahDeangulo/pricing-intelligence',
    demo: 'https://demo.pricing-platform.com'
  },
  'revenue-intelligence': {
    title: 'Revenue Intelligence Suite',
    emoji: '💼',
    description: 'ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement. Enhanced system reliability by 34%.',
    fullDescription: 'A comprehensive revenue intelligence platform that combines ML-driven sales forecasting with CRM optimization. The system analyzes customer behavior patterns, predicts sales outcomes, and provides actionable insights for sales teams.',
    technologies: ['ML Forecasting', 'CRM', 'Python', 'API Integration', 'Salesforce', 'React', 'Node.js'],
    features: [
      'Predictive sales forecasting with 92% accuracy',
      'Customer behavior analysis and segmentation',
      'Pipeline health scoring and recommendations',
      'Automated lead qualification and routing',
      'Real-time sales performance dashboards',
      'Integration with major CRM platforms'
    ],
    impact: 'Improved forecast accuracy by 34% and increased sales team productivity by 28%',
    github: 'https://github.com/ElijahDeangulo/revenue-intelligence',
    demo: 'https://demo.revenue-suite.com'
  },
  'special-miracle': {
    title: 'A Special Miracle',
    emoji: '🏆',
    description: 'Founded a non-profit organization focused on community impact and social good initiatives. Supporting families with children with Down Syndrome.',
    fullDescription: 'A Special Miracle is a non-profit organization dedicated to supporting families with children with Down Syndrome. The platform provides resources, community support, and educational content to help families navigate their journey.',
    technologies: ['Leadership', 'Non-Profit', 'Community Impact', 'React', 'Node.js', 'WordPress'],
    features: [
      'Community support forums and resources',
      'Educational content and guides',
      'Event planning and coordination',
      'Volunteer management system',
      'Donation processing and tracking',
      'Family networking and support groups'
    ],
    impact: 'Supported 150+ families and organized 25+ community events',
    website: 'https://aspecialmiracle.org'
  }
}

const ModernThemeToggle = ({ isDark, toggleDarkMode, isClient, isSpotifyExpanded }: { 
  isDark: boolean
  toggleDarkMode: () => void
  isClient: boolean 
  isSpotifyExpanded: boolean
}) => {
  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isSpotifyExpanded ? 'translate-x-[-320px]' : ''}`}>
      <button
        onClick={toggleDarkMode}
        className="group relative overflow-hidden rounded-full bg-background/90 backdrop-blur-md border border-border/50 p-3 shadow-lg shadow-black/10 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-black/20"
        aria-label="Toggle dark mode"
      >
        <div className="relative z-10">
          {isDark ? (
            <svg className="h-5 w-5 text-yellow-500 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z"/>
            </svg>
          ) : (
            <svg className="h-5 w-5 text-slate-600 transition-transform duration-300 group-hover:rotate-12" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z"/>
            </svg>
          )}
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-full" />
      </button>
    </div>
  )
}

export default function Home() {
  // State management
  const [showAboutModal, setShowAboutModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<ProjectId | null>(null)
  const [activeTab, setActiveTab] = useState('work')
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | null>('palantir')
  const [isSpotifyExpanded, setIsSpotifyExpanded] = useState(false)
  
  // Smooth scroll functions
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Project click handler
  const handleProjectClick = (projectId: ProjectId) => {
    setSelectedProject(projectId)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation Header */}
      <header className="fixed top-0 z-40 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex max-w-3xl flex-col px-8">
          <nav className="flex items-center justify-between py-6">
            <ul className="flex items-center space-x-8">
              <li><button onClick={scrollToTop} className="text-sm transition-colors hover:text-foreground/80 text-muted-foreground hover:text-foreground">Home</button></li>
              <li><button onClick={() => scrollToSection('projects')} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">Projects</button></li>
              <li><button onClick={() => setShowAboutModal(true)} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">About</button></li>
              <li><button onClick={() => scrollToSection('contact')} className="text-sm transition-colors hover:text-foreground text-muted-foreground hover:text-foreground">Contact</button></li>
            </ul>
            <div className="flex items-center space-x-3">
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6">
        {/* Main Content - Continuous Scroll Layout */}
        <div>
          {/* Hero Section */}
          <section className="relative py-4 overflow-hidden" style={{ paddingTop: '100px' }}>
            <div className="relative z-10 max-w-7xl mx-auto px-4">
              <div className="grid gap-3 lg:grid-cols-12 lg:gap-4 items-start">
                <div className="lg:col-span-7 space-y-3">
                  {/* Hero Navigation */}
                  <div className="flex justify-center mb-4">
                    <nav className="relative group">
                      <div className="relative bg-background/10 backdrop-blur-md rounded-full border border-border/20 px-4 py-2 shadow-lg shadow-black/10">
                        <ul className="flex items-center space-x-4">
                          <li>
                            <button onClick={scrollToTop} className="relative px-2.5 py-1 text-sm font-medium text-muted-foreground hover:text-cyan-300 transition-all duration-200 hover:scale-105 group/item">
                              Home
                              <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 w-0 group-hover/item:w-full -translate-x-1/2 transition-all duration-200 shadow-sm shadow-cyan-400/50"></div>
                            </button>
                          </li>
                          <li>
                            <button onClick={() => scrollToSection('projects')} className="relative px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 group/item text-muted-foreground hover:text-cyan-300">
                              Projects
                              <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-200 -translate-x-1/2 shadow-sm shadow-cyan-400/50 w-0 group-hover/item:w-full"></div>
                            </button>
                          </li>
                          <li>
                            <button onClick={() => setShowAboutModal(true)} className="relative px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 group/item text-muted-foreground hover:text-cyan-300">
                              About
                              <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-200 -translate-x-1/2 shadow-sm shadow-cyan-400/50 w-0 group-hover/item:w-full"></div>
                            </button>
                          </li>
                          <li>
                            <button onClick={() => scrollToSection('contact')} className="relative px-2.5 py-1 text-sm font-medium transition-all duration-200 hover:scale-105 group/item text-muted-foreground hover:text-cyan-300">
                              Contact
                              <div className="absolute bottom-0 left-1/2 h-px bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all duration-200 -translate-x-1/2 shadow-sm shadow-cyan-400/50 w-0 group-hover/item:w-full"></div>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </nav>
                  </div>
                  
                  {/* Intro Card */}
                  <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border border-border/50 p-3 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-primary/10">
                    <div className="relative z-10">
                      <div className="mb-3 flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-xs text-muted-foreground">Actively looking for internships for Fall 2025</span>
                      </div>
                      <h1 className="mb-2 text-xl font-bold tracking-tight lg:text-3xl bg-gradient-to-r from-slate-500 via-cyan-300 via-cyan-500 via-blue-400 to-slate-600 bg-clip-text text-transparent">
                        Hi, I'm Elijah Deangulo
                      </h1>
                      <div className="mb-2 text-sm text-muted-foreground">
                        AI/ML Engineer building intelligent systems
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section id="projects" className="py-8 mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">My Projects</h2>
              <p className="text-muted-foreground">
                A collection of projects I've worked on, from AI-powered solutions to enterprise platforms.
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Object.entries(projectDetails).map(([key, project]) => (
                <div 
                  key={key}
                  onClick={() => handleProjectClick(key as ProjectId)}
                  className="rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:bg-accent/50 transform hover:scale-105 cursor-pointer"
                >
                  <div className="mb-4 text-4xl">{project.emoji}</div>
                  <h3 className="mb-3 text-xl font-semibold text-foreground">{project.title}</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((tech) => (
                      <span key={tech} className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">{tech}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="py-8 mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-4">Get in Touch</h2>
              <p className="text-muted-foreground">
                Interested in collaborating or have a question? I'd love to hear from you.
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="space-y-4">
                  <a href="mailto:ejdeangulo@gmail.com" className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-red-500/20 transition-colors">
                    <span className="text-red-600">📧</span>
                    <span>ejdeangulo@gmail.com</span>
                  </a>
                  <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-blue-500/20 transition-colors">
                    <span className="text-blue-600">💼</span>
                    <span>LinkedIn Profile</span>
                  </a>
                  <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-gray-500/20 transition-colors">
                    <span className="text-gray-700">🐙</span>
                    <span>GitHub Profile</span>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Message</h3>
                <p className="text-sm text-muted-foreground">
                  Feel free to reach out through any of the platforms above. I usually respond within 24 hours!
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* About Modal */}
      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAboutModal(false)} />
          <div className="relative bg-background rounded-xl border border-border shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-foreground">About Me</h2>
              <button onClick={() => setShowAboutModal(false)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Personal Story */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">My Journey</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    I'm a passionate AI/ML engineer and graduate student at the University of Florida, where I'm pursuing my Master's in Business Analytics while maintaining a 4.0 GPA. My journey in technology began with a fascination for how data can tell stories and drive meaningful change.
                  </p>
                  <p>
                    Currently, I work as a Decision Sciences Engineering Intern at Palantir Technologies, where I build enterprise-scale AI solutions that transform how Fortune 500 companies leverage their data.
                  </p>
                </div>
              </div>

              {/* Personal Interests */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">Beyond Code</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🏈 Sports & Fitness</h4>
                    <p className="text-sm text-muted-foreground">
                      Avid sports enthusiast and fitness lover. I believe in maintaining a healthy work-life balance.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🎵 Music Production</h4>
                    <p className="text-sm text-muted-foreground">
                      Creative outlet through music production and sound design.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">🌟 Community Impact</h4>
                    <p className="text-sm text-muted-foreground">
                      Founder of "A Special Miracle," supporting families with children with Down Syndrome.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">📚 Continuous Learning</h4>
                    <p className="text-sm text-muted-foreground">
                      Always exploring new technologies and frameworks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && projectDetails[selectedProject as ProjectId] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedProject(null)} />
          <div className="relative bg-background rounded-xl border border-border shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{projectDetails[selectedProject as ProjectId].emoji}</span>
                <h2 className="text-2xl font-bold text-foreground">{projectDetails[selectedProject as ProjectId].title}</h2>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-muted-foreground hover:text-foreground">
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Overview</h3>
                <p className="text-muted-foreground">{projectDetails[selectedProject as ProjectId].fullDescription}</p>
              </div>

              {projectDetails[selectedProject as ProjectId].features && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <ul className="space-y-2">
                    {projectDetails[selectedProject as ProjectId].features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-3">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {projectDetails[selectedProject as ProjectId].technologies.map((tech) => (
                    <span key={tech} className="rounded-md bg-secondary px-3 py-1 text-sm text-secondary-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {projectDetails[selectedProject as ProjectId].impact && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Impact</h3>
                  <p className="text-sm text-muted-foreground bg-primary/10 p-3 rounded-lg">
                    {projectDetails[selectedProject as ProjectId].impact}
                  </p>
                </div>
              )}

              <div className="flex gap-4 pt-4">
                {projectDetails[selectedProject as ProjectId].github && (
                  <a href={projectDetails[selectedProject as ProjectId].github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
                    🐙 View Code
                  </a>
                )}
                {projectDetails[selectedProject as ProjectId].demo && (
                  <a href={projectDetails[selectedProject as ProjectId].demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    🚀 Live Demo
                  </a>
                )}
                {projectDetails[selectedProject as ProjectId].website && (
                  <a href={projectDetails[selectedProject as ProjectId].website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                    🌐 Visit Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Theme Toggle */}
      <ModernThemeToggle isDark={false} toggleDarkMode={() => {}} isClient={true} isSpotifyExpanded={isSpotifyExpanded} />
    </div>
  )
} 
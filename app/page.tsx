'use client'

import React, { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [activeTab, setActiveTab] = useState('work')
  const [activeTimelineItem, setActiveTimelineItem] = useState<string | null>(null)
  const timelineRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Intersection Observer for timeline highlighting
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemId = entry.target.getAttribute('data-timeline-id')
            setActiveTimelineItem(itemId)
          }
        })
      },
      { 
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.5
      }
    )

    // Observe all timeline items
    Object.values(timelineRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [activeTab])

  const setTimelineRef = (id: string) => (ref: HTMLDivElement | null) => {
    timelineRefs.current[id] = ref
  }

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-background/75 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl flex-col px-8">
          <nav className="flex items-center justify-between py-6">
            <ul className="flex items-center space-x-8">
              <li><a href="#" className="text-sm text-foreground transition-colors hover:text-foreground/80">home</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">projects</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">blog</a></li>
              <li><a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">contact</a></li>
        </ul>
            <div className="flex items-center space-x-3">
              <button className="rounded-md border border-border bg-background p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                💼
              </button>
              <button className="rounded-md border border-border bg-background p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                ☀️
              </button>
            </div>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-8">
      {/* Hero Section */}
        <section className="flex flex-col gap-8 py-8 lg:flex-row lg:items-center">
          <div className="flex-1">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              hi elijah here. 👋
            </h1>
            <p className="mb-4 text-xl text-muted-foreground">
              Graduate student and data scientist from Florida 🇺🇸
            </p>
            <div className="mb-6 space-y-4 text-base text-muted-foreground">
              <p>
            MS Business Analytics @ UF. Building AI-powered solutions and scalable data platforms.
          </p>
              <p>
            Passionate about fintech, ML engineering, and transforming data into actionable insights.<br/>
                Currently interning at <strong className="text-foreground">Palantir</strong> as a Deployment Strategist ↗
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <button className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                📄 Resume
              </button>
              <div className="flex items-center space-x-3">
                <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                  <img src="/images/logos/LinkedIn_logo.jpg" alt="LinkedIn" className="h-4 w-4" />
                </a>
                <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="mailto:ejdeangulo@gmail.com" className="inline-flex items-center justify-center rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground">
                  📧
                </a>
              </div>
            </div>
          </div>
          <div className="lg:w-80">
          <img 
              src="/images/profile.jpg" 
            alt="Elijah DeAngulo" 
              className="w-full rounded-2xl object-cover"
              style={{ aspectRatio: '320/400' }}
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=320&h=400&fit=crop&crop=face"
              }}
          />
        </div>
      </section>

      {/* Work/Education Tabs */}
        <section className="py-12">
          <div className="mb-8 rounded-lg border border-border bg-card">
            <div className="flex">
            <button 
                className={`flex-1 rounded-l-lg px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'work' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setActiveTab('work')}
            >
              Work
            </button>
            <button 
                className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'education' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
              onClick={() => setActiveTab('education')}
            >
              Education
            </button>
              <button 
                className={`flex-1 rounded-r-lg px-6 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'philanthropy' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-background text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('philanthropy')}
              >
                Philanthropy
              </button>
            </div>
          </div>

          {/* Work Experience */}
          {activeTab === 'work' && (
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="relative">
                {/* Timeline line - base line always visible */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"></div>
                
                {/* Dynamic highlight segments - accurate content height alignment */}
                <div className="absolute left-6 top-6 w-0.5 flex flex-col">
                  {/* Palantir segment - very long content with detailed technical bullet points */}
                  <div className={`h-64 w-full transition-all duration-300 ${activeTimelineItem === 'palantir' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-8"></div> {/* space-y-8 gap */}
                  
                  {/* Inselligence segment - substantial content with longer title and 3 bullet points */}
                  <div className={`h-56 w-full transition-all duration-300 ${activeTimelineItem === 'inselligence' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-8"></div> {/* space-y-8 gap */}
                  
                  {/* Elion segment - solid content with 3 bullet points */}
                  <div className={`h-56 w-full transition-all duration-300 ${activeTimelineItem === 'elion' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-8"></div> {/* space-y-8 gap */}
                  
                  {/* Elite Endoscopy segment - good content with 3 bullet points */}
                  <div className={`h-52 w-full transition-all duration-300 ${activeTimelineItem === 'elite-endoscopy' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                </div>
                
                <div className="space-y-8">
                  {/* Palantir */}
                  <div 
                    ref={setTimelineRef('palantir')}
                    data-timeline-id="palantir"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'palantir' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'palantir' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <img src="/images/logos/palantir.jpg" alt="Palantir" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">Jan 2025 - Present</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Palantir</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Deployment Strategist Intern</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• Engineered an end-to-end AR automation platform using PySpark and webhook-based ingestion to consolidate fragmented data; embedded multi-agent LLM orchestration with prompt chaining and RAG techniques</li>
                        <li>• Built an agent-driven pricing platform with asynchronous I/O pipelines and Bayesian optimization models, driving $10M+ in projected revenue impact</li>
                        <li>• Led client-facing scoping sessions and authored 25K+ lines of PySpark, Foundry, and TypeScript code to deploy automated workflows</li>
                    </ul>
                  </div>
                </div>

                  {/* Inselligence */}
                  <div 
                    ref={setTimelineRef('inselligence')}
                    data-timeline-id="inselligence"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'inselligence' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'inselligence' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-gray-900'
                    }`}>
                      <img src="/images/logos/inselligence.jpg" alt="Inselligence" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">May 2024 - Aug 2024</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Inselligence (Revenue Intelligence)</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Product Manager and Data Analyst Intern</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• Reverse-engineered core algorithms to identify revenue forecasting gaps and surfaced LLM-driven opportunities for sales consultation</li>
                        <li>• Partnered with the CRO to develop ML-informed financial and competitor models for pricing strategy and ARR growth optimization</li>
                        <li>• Improved CRM ingestion pipelines and API efficiency by implementing validation protocols, increasing system reliability by 34%</li>
                    </ul>
                  </div>
                </div>

                  {/* Elion Partners */}
                  <div 
                    ref={setTimelineRef('elion')}
                    data-timeline-id="elion"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'elion' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'elion' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <a href="https://elionpartners.com/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        <img src="/images/logos/elion.jpg" alt="Elion Partners" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">Jun 2023 - Aug 2023</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Elion Partners</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Data Science and Acquisitions Intern</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• Developed ML models in Python and SQL to enhance investment strategies; integrated financial market signals to optimize risk-adjusted returns</li>
                        <li>• Built scalable ETL pipelines using Apache Spark and AWS to feed acquisition models; leveraged scikit-learn for model testing</li>
                        <li>• Delivered client-ready Tableau dashboards visualizing capital market exposure for senior stakeholders</li>
                    </ul>
                  </div>
                </div>

                  {/* Elite Endoscopy Services */}
                  <div 
                    ref={setTimelineRef('elite-endoscopy')}
                    data-timeline-id="elite-endoscopy"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'elite-endoscopy' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'elite-endoscopy' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <a href="https://www.eliteendoscopyservices.com/index.htm" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full h-full">
                        <img src="/images/logos/elite-endoscopy.jpg" alt="Elite Endoscopy Services" className="h-8 w-8 object-contain hover:scale-110 transition-transform" />
                      </a>
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">Nov 2020 - Mar 2021</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Elite Endoscopy Services</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Revenue Operations Consultant Intern</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• Launched an e-commerce platform with integrated third-party BI tools, increasing customer retention and sales by 22%</li>
                        <li>• Deployed CRM analytics with BI dashboards to optimize funnel conversion and reduce churn</li>
                        <li>• Designed data-driven marketing campaigns using SEO, A/B testing, and K-Means clustering to segment hospitals</li>
                    </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Education Section */}
          {activeTab === 'education' && (
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="relative">
                {/* Timeline line - base line always visible */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"></div>
                
                {/* Dynamic highlight segments - full content height alignment */}
                <div className="absolute left-6 top-6 w-0.5 flex flex-col">
                  {/* UF Masters segment - compact content */}
                  <div className={`h-32 w-full transition-all duration-300 ${activeTimelineItem === 'uf-masters' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-8"></div> {/* space-y-8 gap */}
                  
                  {/* UF Bachelors segment - more detailed content */}
                  <div className={`h-40 w-full transition-all duration-300 ${activeTimelineItem === 'uf-bachelors' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                </div>
                
                <div className="space-y-8">
                  {/* Master's Degree */}
                  <div 
                    ref={setTimelineRef('uf-masters')}
                    data-timeline-id="uf-masters"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'uf-masters' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'uf-masters' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <img src="/images/logos/uf.jpg" alt="University of Florida" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">Expected Graduation: Dec 2025</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">University of Florida, Hough College of Business</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Master of Science in Business Analytics</div>
                      <div className="mb-3 text-sm font-medium text-foreground">GPA: 4.0 (Dean's List)</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• <strong>Relevant Coursework:</strong> AI/ML Applications for Fintech, Artificial Intelligence Methods, Web Crawling/Text Analysis</li>
                        <li>• Corporate Finance, Data Mining, Data Visualization, Natural Language Processing, Data Structures</li>
                    </ul>
                  </div>
                </div>

                  {/* Bachelor's Degree */}
                  <div 
                    ref={setTimelineRef('uf-bachelors')}
                    data-timeline-id="uf-bachelors"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'uf-bachelors' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'uf-bachelors' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <img src="/images/logos/uf-warrington.jpg" alt="UF Warrington College" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">Graduated: May 2024</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">University of Florida, Warrington College of Business</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Bachelor of Science in Business Administration - Information Systems Operations Management</div>
                      <div className="mb-3 text-sm font-medium text-foreground">
                        GPA: 3.81 / ISM: 3.97<br/>
                        <span className="text-muted-foreground">Minor: Economics, Artificial Intelligence Fundamentals and Applications – Certificate</span>
                      </div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• <strong>Relevant Coursework:</strong> Business Analytics & AI, Business Systems Design/Application, Business Finance</li>
                        <li>• Managerial Operations Analysis, Advanced Business Systems, Ethics in Data and Tech</li>
                        <li>• <strong>Clubs:</strong> Product Space – (PM Fellowship for product strategy & innovation)</li>
                    </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Philanthropy Section */}
          {activeTab === 'philanthropy' && (
            <div className="rounded-lg border border-border bg-card p-8">
              <div className="relative">
                {/* Timeline line - base line always visible */}
                <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-border"></div>
                
                {/* Dynamic highlight segments - full content height alignment */}
                <div className="absolute left-6 top-6 w-0.5 flex flex-col">
                  {/* A Special Miracle segment - extensive content with 4 bullet points + website link */}
                  <div className={`h-48 w-full transition-all duration-300 ${activeTimelineItem === 'asm' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
                  <div className="h-8"></div> {/* space-y-8 gap */}
                  
                  {/* Food Bank segment - shorter content with 2 bullet points */}
                  <div className={`h-28 w-full transition-all duration-300 ${activeTimelineItem === 'food-bank' ? 'bg-cyan-400 shadow-lg shadow-cyan-400/20' : 'bg-transparent'}`}></div>
        </div>
                
                <div className="space-y-8">
                  {/* A Special Miracle */}
                  <div 
                    ref={setTimelineRef('asm')}
                    data-timeline-id="asm"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'asm' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'asm' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <img src="/images/logos/asm.jpg" alt="A Special Miracle" className="h-8 w-8 object-contain" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">May 2017 - Present · 8 yrs 2 mos</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">A Special Miracle</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Co-Founder · Full-time</div>
                      <div className="mb-3 text-xs text-muted-foreground">Coral Springs, Florida, United States · Hybrid</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• Co-founded a Special Miracle, a non-profit designed to uplift families who have children with Down Syndrome</li>
                        <li>• Provided families welcoming a baby with Down syndrome with curated tote bags containing a selection of specialized baby essentials and resources, fostering celebration and support for their unique journey</li>
                        <li>• Collaborated with the Broward Gold Coast Down Syndrome Organization to advance awareness through educational parenting sessions for newborns, contributing to enhanced child development</li>
                        <li>• Sponsored carefully chosen candidates in special needs pageants, strategically raising funds through advertising at prominent events</li>
                      </ul>
                      <div className="mt-3">
                        <a href="https://www.aspecialmiracle.org/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors">
                          🌐 Non-profit webpage
                        </a>
            </div>
          </div>
            </div>

                  {/* Bread of the Mighty Food Bank */}
                  <div 
                    ref={setTimelineRef('food-bank')}
                    data-timeline-id="food-bank"
                    className={`relative flex items-start gap-6 transition-all duration-300 ${
                      activeTimelineItem && activeTimelineItem !== 'food-bank' 
                        ? 'opacity-40 scale-95 blur-[1px]' 
                        : 'opacity-100 scale-100 blur-0'
                    }`}
                  >
                    <div className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-lg border-4 border-background overflow-hidden transition-all duration-300 ${
                      activeTimelineItem === 'food-bank' 
                        ? 'bg-cyan-400 shadow-lg shadow-cyan-400/30 scale-110' 
                        : 'bg-white'
                    }`}>
                      <img src="/images/logos/food-bank.jpg" alt="Bread of the Mighty Food Bank" className="h-8 w-8 object-contain" />
          </div>
                    <div className="flex-1 pt-1">
                      <div className="mb-1 text-sm text-muted-foreground">Dec 2022 - Mar 2023 · 4 mos</div>
                      <h3 className="mb-1 text-lg font-semibold text-foreground">Bread of the Mighty Food Bank</h3>
                      <div className="mb-3 text-sm text-muted-foreground">Food Drive Operations Manager</div>
                      <div className="mb-3 text-xs text-muted-foreground">Poverty Alleviation</div>
                      <ul className="space-y-2 text-sm text-foreground">
                        <li>• Oversaw the planning and execution of food drives, including logistics and resource allocation. My efforts ensured successful food collection and distribution to those in need</li>
                        <li>• Actively participated in volunteer activities, fostering a collaborative and inclusive environment. This hands-on approach allowed me to build strong relationships with volunteers and ensure the smooth execution of daily operations</li>
                      </ul>
            </div>
          </div>
            </div>
          </div>
        </div>
          )}
      </section>

      {/* Featured Projects */}
        <section className="py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">featured projects</h2>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              view more →
            </a>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 text-4xl">🤖</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">AR Automation Platform</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                End-to-end accounts receivable automation using multi-agent LLM orchestration, RAG techniques, and real-time payment processing
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">PySpark</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">LLM</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">RAG</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Foundry</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">TypeScript</span>
              </div>
        </div>
        
            <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 text-4xl">📈</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Pricing Intelligence Platform</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Bayesian optimization models with demand curve simulation and real-time anomaly detection driving $10M+ revenue impact
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Bayesian Optimization</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Python</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Real-time Analytics</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">ML Models</span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 text-4xl">🏆</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">A Special Miracle</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Founded a non-profit organization focused on community impact and social good initiatives
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Leadership</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Non-Profit</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Community Impact</span>
              </div>
              <div className="flex items-center gap-2">
                <a href="https://aspecialmiracle.org" className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground">
                  🌐 Website
                </a>
            </div>
          </div>

            <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="mb-4 text-4xl">💼</div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Revenue Intelligence Suite</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                ML-driven sales forecasting and CRM optimization platform improving pipeline hygiene and customer engagement
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">ML Forecasting</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">CRM</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">Python</span>
                <span className="rounded-md bg-secondary px-2 py-1 text-xs text-secondary-foreground">API Integration</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-12">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">recent posts</h2>
            <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              view more →
            </a>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">Building AI-Powered Revenue Intelligence at Scale</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Deep dive into the ML architecture and prompt engineering techniques used to transform fragmented sales data into actionable insights.
                  </p>
              </div>
                <div className="text-sm text-muted-foreground">March 15, 2025</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card p-6 transition-colors hover:bg-accent/50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-foreground">From Academia to Industry: My Journey at Palantir</h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    Reflections on transitioning from university research to deploying enterprise-scale AI solutions that drive real business impact.
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">February 28, 2025</div>
            </div>
          </div>
        </div>
      </section>

        {/* Footer */}
        <footer className="border-t border-border py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a href="https://linkedin.com/in/ejdeangulo" className="text-muted-foreground transition-colors hover:text-foreground">
                💼
              </a>
              <a href="https://github.com/ejdeangulo" className="text-muted-foreground transition-colors hover:text-foreground">
                🐙
              </a>
              <a href="mailto:ejdeangulo@gmail.com" className="text-muted-foreground transition-colors hover:text-foreground">
                📧
              </a>
        </div>
            <div className="text-sm text-muted-foreground">
              © 2025 ejdeangulo.com | <a href="#" className="hover:text-foreground">privacy?</a>
          </div>
          </div>
        </footer>
        </div>
    </div>
  )
}

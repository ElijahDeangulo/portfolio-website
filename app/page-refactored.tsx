'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Import custom hooks
import { useDarkMode, useParallax } from './hooks'

// Import components
import { ModernThemeToggle, TypingAnimation, CustomCursor } from './components'

// Import data and types
import { projectDetails, skillsData } from './data'
import { ContactForm } from './types'

export default function Home() {
  // Hooks
  const { isDark, toggleDarkMode, isClient } = useDarkMode()
  const { 
    scrollY, 
    mousePosition, 
    getSectionTransform, 
    getElementTransform, 
    getHeroElementTransform 
  } = useParallax()

  // State
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [isContactModalOpen, setIsContactModalOpen] = useState(false)
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: '',
    email: '',
    message: ''
  })

  // Typing animation texts
  const typingTexts = [
    'AI Engineer',
    'Full Stack Developer', 
    'Data Scientist',
    'ML Engineer',
    'Product Manager'
  ]

  // Handlers
  const handleProjectClick = (projectId: string) => {
    setSelectedProject(projectId)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Contact form submitted:', contactForm)
    setIsContactModalOpen(false)
    setContactForm({ name: '', email: '', message: '' })
  }

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Custom Cursor */}
      <CustomCursor />

      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ModernThemeToggle 
          isDark={isDark}
          toggleDarkMode={toggleDarkMode}
          isClient={isClient}
          isSpotifyExpanded={false}
        />
      </div>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center z-10">
          <motion.h1 
            className="text-6xl md:text-8xl font-bold mb-6"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Elijah De Angulo
          </motion.h1>
          
          <motion.div 
            className="text-2xl md:text-3xl text-muted-foreground mb-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <TypingAnimation 
              texts={typingTexts}
              speed={100}
              deleteSpeed={50}
              pauseTime={2000}
            />
          </motion.div>

          <motion.div 
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Get In Touch
            </button>
            <button 
              onClick={() => window.open('/resume.pdf', '_blank')}
              className="px-8 py-3 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              View Resume
            </button>
          </motion.div>
        </div>

        {/* Background elements with parallax */}
        <div 
          className="absolute inset-0 opacity-10"
          style={getHeroElementTransform('up', 0.5)}
        >
          {/* Add background elements here */}
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(projectDetails).map(([key, project]) => (
              <motion.div
                key={key}
                className="group cursor-pointer"
                onClick={() => handleProjectClick(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="bg-card rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <img 
                      src={project.logo} 
                      alt={project.title}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span 
                        key={tech}
                        className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-sm">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {isContactModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-lg p-8 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={contactForm.message}
                    onChange={handleContactChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Project Detail Modal */}
      <AnimatePresence>
        {selectedProject && projectDetails[selectedProject as keyof typeof projectDetails] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-background rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              {(() => {
                const project = projectDetails[selectedProject as keyof typeof projectDetails];
                return (
                  <>
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={project.logo} 
                          alt={project.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <h2 className="text-2xl font-bold">{project.title}</h2>
                      </div>
                      <button 
                        onClick={() => setSelectedProject(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Overview</h3>
                        <p className="text-muted-foreground">{project.fullDescription}</p>
                      </div>

                      {project.features && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                          <ul className="space-y-2">
                            {project.features.map((feature, index) => (
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
                          {project.technologies.map((tech) => (
                            <span key={tech} className="px-3 py-1 bg-secondary text-secondary-foreground rounded-md text-sm">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {project.impact && (
                        <div>
                          <h3 className="text-lg font-semibold mb-3">Impact</h3>
                          <p className="text-sm text-muted-foreground bg-primary/10 p-3 rounded-lg">
                            {project.impact}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-4 pt-4">
                        {project.github && (
                          <a 
                            href={project.github} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                          >
                            🐙 View Code
                          </a>
                        )}
                        {project.website && (
                          <a 
                            href={project.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                          >
                            🌐 Visit Website
                          </a>
                        )}
                      </div>
                    </div>
                  </>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 
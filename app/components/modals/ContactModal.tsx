'use client'

import React, { useState } from 'react'
import { resetCursorState } from '@/app/components/CustomCursor'

interface ContactModalProps {
  showContactModal: boolean
  setShowContactModal: (show: boolean) => void
}

export const ContactModal: React.FC<ContactModalProps> = ({ 
  showContactModal, 
  setShowContactModal 
}) => {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactForm(prev => ({ ...prev, [name]: value }))
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setShowContactModal(false)
        setSubmitSuccess(false)
        setContactForm({ name: '', email: '', message: '' })
      }, 2000)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!showContactModal) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300" 
        onClick={() => {
          setShowContactModal(false)
          resetCursorState()
        }} 
      />
      <div className="relative bg-background rounded-xl border border-border shadow-2xl max-w-4xl w-full max-h-[85vh] animate-in zoom-in-95 slide-in-from-bottom-8 duration-300 flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-border/30">
          <h2 className="text-2xl font-bold text-foreground">Get in Touch 📧</h2>
          <button 
            onClick={() => {
              setShowContactModal(false)
              resetCursorState()
            }} 
            className="text-muted-foreground hover:text-foreground transition-colors text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
          <div className="p-6 grid gap-8 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <p className="mb-6 text-muted-foreground">
                Interested in collaborating or have a question? I'd love to hear from you.
              </p>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="group">
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={contactForm.name}
                        onChange={handleContactChange}
                        required
                        className="peer w-full rounded-lg border border-border bg-background px-4 pt-6 pb-2 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder=" "
                      />
                      <label className="absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                        Your Name
                      </label>
                    </div>
                  </div>
                  
                  <div className="group">
                    <div className="relative">
                      <input
                        type="email"
                        name="email"
                        value={contactForm.email}
                        onChange={handleContactChange}
                        required
                        className="peer w-full rounded-lg border border-border bg-background px-4 pt-6 pb-2 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder=" "
                      />
                      <label className="absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                        Email Address
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="group">
                  <div className="relative">
                    <textarea
                      name="message"
                      value={contactForm.message}
                      onChange={handleContactChange}
                      required
                      rows={6}
                      className="peer w-full rounded-lg border border-border bg-background px-4 pt-6 pb-2 text-foreground transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder=" "
                    />
                    <label className="absolute left-4 top-2 text-xs text-muted-foreground transition-all duration-200 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary">
                      Your Message
                    </label>
                  </div>
                </div>
                
                {submitError && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm animate-in slide-in-from-top-2 duration-300">
                    {submitError}
                  </div>
                )}
                
                {submitSuccess && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-700 text-sm animate-in slide-in-from-top-2 duration-300">
                    ✅ Message sent successfully! I'll get back to you soon.
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting || submitSuccess}
                  className={`w-full inline-flex items-center justify-center rounded-lg px-8 py-3 text-sm font-medium transition-all duration-300 ${
                    submitSuccess
                      ? 'bg-green-500 text-white cursor-not-allowed'
                      : isSubmitting
                        ? 'bg-primary/70 text-primary-foreground cursor-not-allowed'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105'
                  }`}
                >
                  {submitSuccess ? (
                    <>✅ Sent!</>
                  ) : isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>📧 Send Message</>
                  )}
                </button>
              </form>
            </div>

            {/* Quick Connect */}
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">📬</div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">Quick Connect</h3>
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Usually responds within 24 hours
                </div>
              </div>
              
              <div className="grid gap-4">
                <a href="https://www.linkedin.com/in/elijah-deangulo-a26306175" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center justify-center w-6 h-6">
                    <svg className="h-5 w-5 text-blue-600 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground group-hover:text-blue-500 transition-colors">LinkedIn</div>
                    <div className="text-sm text-muted-foreground">Professional networking</div>
                  </div>
                </a>
                
                <a href="https://github.com/ElijahDeangulo" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-gray-500/20 hover:border-gray-500/50 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center justify-center w-6 h-6">
                    <svg className="h-5 w-5 text-gray-700 group-hover:text-gray-600 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground group-hover:text-gray-600 transition-colors">GitHub</div>
                    <div className="text-sm text-muted-foreground">Check out my code</div>
                  </div>
                </a>
                
                <a href="mailto:ejdeangulo@gmail.com" className="flex items-center gap-3 p-4 rounded-lg bg-background/50 border border-border/50 hover:bg-red-500/20 hover:border-red-500/50 transition-all duration-300 hover:scale-105 group">
                  <div className="flex items-center justify-center w-6 h-6">
                    <svg className="h-5 w-5 text-red-600 group-hover:text-red-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-.904.732-1.636 1.636-1.636h.075L12 13.267 22.289 3.821h.075A1.636 1.636 0 0 1 24 5.457z"/>
                    </svg>
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-foreground group-hover:text-red-500 transition-colors">Email</div>
                    <div className="text-sm text-muted-foreground">ejdeangulo@gmail.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
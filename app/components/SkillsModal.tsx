'use client'

import React, { useEffect } from 'react'

interface SkillsModalProps {
  isOpen: boolean
  onClose: () => void
  selectedSkillCategory: string
  setSelectedSkillCategory: (category: string) => void
}

export const SkillsModal = ({ 
  isOpen, 
  onClose, 
  selectedSkillCategory, 
  setSelectedSkillCategory 
}: SkillsModalProps) => {
  // Skills data
  const skillsData = {
    'Machine Learning': [
      { name: 'Python', categories: ['ml', 'backend'], icon: '🐍' },
      { name: 'PyTorch', categories: ['ml'], icon: '🔥' },
      { name: 'TensorFlow', categories: ['ml'], icon: '🧠' },
      { name: 'Scikit-learn', categories: ['ml'], icon: '📊' },
      { name: 'Pandas', categories: ['ml', 'data'], icon: '🐼' },
      { name: 'NumPy', categories: ['ml', 'data'], icon: '🔢' },
      { name: 'Jupyter', categories: ['ml', 'data'], icon: '📓' }
    ],
    'Frontend Development': [
      { name: 'React', categories: ['frontend'], icon: '⚛️' },
      { name: 'Next.js', categories: ['frontend'], icon: '▲' },
      { name: 'TypeScript', categories: ['frontend', 'backend'], icon: '🟦' },
      { name: 'JavaScript', categories: ['frontend', 'backend'], icon: '🟨' },
      { name: 'Tailwind CSS', categories: ['frontend'], icon: '💨' },
      { name: 'HTML/CSS', categories: ['frontend'], icon: '🎨' }
    ],
    'Backend Development': [
      { name: 'Node.js', categories: ['backend'], icon: '🟢' },
      { name: 'Python', categories: ['backend', 'ml'], icon: '🐍' },
      { name: 'Express.js', categories: ['backend'], icon: '🚀' },
      { name: 'REST APIs', categories: ['backend'], icon: '🔗' },
      { name: 'GraphQL', categories: ['backend'], icon: '📊' }
    ],
    'Data Engineering': [
      { name: 'Apache Spark', categories: ['data'], icon: '⚡' },
      { name: 'PySpark', categories: ['data', 'ml'], icon: '🔥' },
      { name: 'SQL', categories: ['data'], icon: '🗃️' },
      { name: 'PostgreSQL', categories: ['data'], icon: '🐘' },
      { name: 'MongoDB', categories: ['data'], icon: '🍃' },
      { name: 'Redis', categories: ['data'], icon: '🔴' }
    ],
    'Cloud & DevOps': [
      { name: 'AWS', categories: ['cloud'], icon: '☁️' },
      { name: 'Docker', categories: ['cloud'], icon: '🐳' },
      { name: 'Kubernetes', categories: ['cloud'], icon: '⚙️' },
      { name: 'Git', categories: ['tools'], icon: '🌿' },
      { name: 'CI/CD', categories: ['cloud'], icon: '🔄' }
    ]
  }

  const skillCategories = [
    { id: 'all', name: 'All Skills', icon: '🎯' },
    { id: 'ml', name: 'Machine Learning', icon: '🤖' },
    { id: 'frontend', name: 'Frontend', icon: '💻' },
    { id: 'backend', name: 'Backend', icon: '⚙️' },
    { id: 'data', name: 'Data', icon: '📊' },
    { id: 'cloud', name: 'Cloud', icon: '☁️' },
    { id: 'tools', name: 'Tools', icon: '🛠️' }
  ]

  // Prevent background scrolling
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow
      const scrollY = window.scrollY
      
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
      document.body.style.top = `-${scrollY}px`
      
      return () => {
        document.body.style.overflow = originalOverflow
        document.body.style.position = ''
        document.body.style.width = ''
        document.body.style.top = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const filteredSkills = selectedSkillCategory === 'all' 
    ? Object.entries(skillsData).flatMap(([category, skills]) => 
        skills.map(skill => ({ ...skill, category }))
      )
    : Object.entries(skillsData).flatMap(([category, skills]) => 
        skills.filter(skill => skill.categories.includes(selectedSkillCategory))
          .map(skill => ({ ...skill, category }))
      )

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-background/95 backdrop-blur-xl border border-border/30 rounded-3xl max-w-4xl w-full max-h-[85vh] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500 flex flex-col">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-primary/5 via-primary/8 to-primary/5 border-b border-border/30">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
                  Technical Expertise
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed max-w-none mt-1">
                  Technologies, frameworks, and specialized skills from professional and academic experience
                </p>
              </div>
              <button 
                onClick={onClose}
                className="group p-2 rounded-xl bg-background/60 border border-border/40 text-muted-foreground hover:text-foreground hover:bg-background/80 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="h-5 w-5 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {skillCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedSkillCategory(category.id)}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ease-out ${
                    selectedSkillCategory === category.id
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105 border border-primary/30 transform'
                      : 'bg-background/60 hover:bg-background/80 border border-border/30 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:scale-[1.02] hover:shadow-sm transform'
                  }`}
                >
                  <div className={`transition-colors ${selectedSkillCategory === category.id ? 'text-primary-foreground' : 'text-primary group-hover:text-primary'}`}>
                    {category.icon}
                  </div>
                  <span className="font-medium">{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border/50 scrollbar-track-transparent">
          <div className="p-6 space-y-8">
            {filteredSkills.length > 0 ? (
              Object.entries(
                filteredSkills.reduce((acc, skill) => {
                  const category = skill.category || 'Other';
                  if (!acc[category]) acc[category] = [];
                  acc[category].push(skill);
                  return acc;
                }, {} as Record<string, typeof filteredSkills>)
              ).map(([categoryName, skills]) => (
                <div key={categoryName} className="group/section">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {categoryName}
                      </h3>
                      <div className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                        {skills.length} skill{skills.length > 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-border via-border/60 to-transparent"></div>
                  </div>
                  
                  <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {skills.map((skill, index) => (
                      <div 
                        key={skill.name}
                        className="group/item relative flex items-center gap-2 p-3 rounded-lg bg-card/40 border border-border/40 hover:border-primary/30 hover:bg-card/60 transition-all duration-200 hover:shadow-md hover:shadow-primary/10 hover:scale-[1.02] cursor-pointer"
                        style={{
                          animationDelay: `${index * 30}ms`,
                        }}
                      >
                        {/* Skill Icon */}
                        <div className="flex-shrink-0 text-lg">
                          {skill.icon}
                        </div>
                        
                        {/* Skill Name */}
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-medium text-foreground group-hover/item:text-primary transition-colors duration-200 line-clamp-1">
                            {skill.name}
                          </span>
                        </div>

                        {/* Hover effect */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mb-6">
                  <span className="text-2xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">No skills found</h3>
                <p className="text-muted-foreground/70">Try selecting a different category to explore more skills</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
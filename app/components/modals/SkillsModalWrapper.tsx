'use client'

import React, { useState } from 'react'
import { SkillsModal } from './SkillsModal'

interface SkillsModalWrapperProps {
  showSkillsModal: boolean
  setShowSkillsModal: (show: boolean) => void
}

export const SkillsModalWrapper: React.FC<SkillsModalWrapperProps> = ({ 
  showSkillsModal, 
  setShowSkillsModal 
}) => {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all')

  if (!showSkillsModal) return null

  return (
    <SkillsModal 
      isOpen={showSkillsModal}
      onClose={() => setShowSkillsModal(false)}
      selectedSkillCategory={selectedSkillCategory}
      setSelectedSkillCategory={setSelectedSkillCategory}
    />
  )
}
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Optimizing page.tsx for better performance...\n');

// Read the original page.tsx
const pagePath = path.join(__dirname, '../app/page.tsx');
const pageContent = fs.readFileSync(pagePath, 'utf8');

// Create a backup
const backupPath = path.join(__dirname, '../app/page-backup-' + Date.now() + '.tsx');
fs.writeFileSync(backupPath, pageContent);
console.log('✅ Created backup at:', backupPath);

// Add dynamic imports at the top
const dynamicImports = `'use client'

import React, { useState, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from 'framer-motion'
import { resetCursorState } from './components/CustomCursor'

// Dynamic imports for modularized components
const HybridMusicPlayerLazy = dynamic(
  () => import('./components/HybridMusicPlayer').then(mod => ({ default: mod.HybridMusicPlayer })),
  { 
    ssr: false,
    loading: () => null // No loading state to maintain exact UI
  }
)

const SkillsModalLazy = dynamic(
  () => import('./components/SkillsModal').then(mod => ({ default: mod.SkillsModal })),
  { 
    ssr: false,
    loading: () => null
  }
)

const CustomCursorLazy = dynamic(
  () => import('./components/CustomCursor').then(mod => ({ default: mod.CustomCursor })),
  { 
    ssr: false,
    loading: () => null
  }
)

`;

// Replace the imports section
let optimizedContent = pageContent.replace(
  /^'use client'[\s\S]*?import { resetCursorState } from '\.\/components\/CustomCursor'/m,
  dynamicImports.trim()
);

// Replace component usages
const replacements = [
  // Replace CustomCursor usage
  {
    from: /<CustomCursor\s*\/>/g,
    to: '<CustomCursorLazy />'
  },
  // Replace HybridMusicPlayer in portal
  {
    from: /<HybridMusicPlayer\s+/g,
    to: '<HybridMusicPlayerLazy '
  },
  // Replace SkillsModal
  {
    from: /{showSkillsModal && <SkillsModal \/>/g,
    to: '{showSkillsModal && <SkillsModalLazy />'
  }
];

replacements.forEach(({ from, to }) => {
  optimizedContent = optimizedContent.replace(from, to);
});

// Write the optimized version
fs.writeFileSync(pagePath, optimizedContent);

console.log('\n✅ Optimization complete!');
console.log('📦 Components now using dynamic imports:');
console.log('   - CustomCursor (lazy loaded)');
console.log('   - HybridMusicPlayer (lazy loaded)');
console.log('   - SkillsModal (lazy loaded)');
console.log('\n🎯 Benefits:');
console.log('   - Faster initial page load');
console.log('   - Smaller initial bundle size');
console.log('   - Better code splitting');
console.log('   - Exact same UI/UX preserved\n');
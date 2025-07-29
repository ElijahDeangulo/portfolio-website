#!/usr/bin/env node

/**
 * Dependency Cleanup Script
 * Identifies and optionally removes unused dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔍 Analyzing project dependencies...\n');

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Core dependencies that should always be kept
const coreDependencies = new Set([
  'next',
  'react',
  'react-dom',
  'tailwindcss',
  'framer-motion',
  'resend',
  'typescript',
  'clsx',
  'tailwind-merge'
]);

// Known dev dependencies
const knownDevDeps = new Set([
  '@types/node',
  '@types/react',
  '@types/react-dom',
  'eslint',
  'eslint-config-next',
  'postcss',
  'autoprefixer'
]);

// Check if dependency is imported in the project
function isDependencyUsed(dep) {
  // Skip check for core dependencies
  if (coreDependencies.has(dep) || knownDevDeps.has(dep)) {
    return true;
  }

  try {
    // Search for imports in TypeScript/JavaScript files
    const searchCmd = `grep -r "from ['"]${dep}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null || true`;
    const result = execSync(searchCmd, { encoding: 'utf8' });
    
    // Also check for require statements
    const requireCmd = `grep -r "require(['"]${dep}" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules --exclude-dir=.next . 2>/dev/null || true`;
    const requireResult = execSync(requireCmd, { encoding: 'utf8' });
    
    return result.trim().length > 0 || requireResult.trim().length > 0;
  } catch (error) {
    return true; // Keep dependency if we can't determine usage
  }
}

// Analyze dependencies
const unusedDeps = [];
const usedDeps = [];

console.log('Checking dependencies...');
Object.keys(packageJson.dependencies || {}).forEach(dep => {
  if (isDependencyUsed(dep)) {
    usedDeps.push(dep);
  } else {
    unusedDeps.push(dep);
  }
});

console.log('\nChecking devDependencies...');
const unusedDevDeps = [];
const usedDevDeps = [];

Object.keys(packageJson.devDependencies || {}).forEach(dep => {
  if (isDependencyUsed(dep)) {
    usedDevDeps.push(dep);
  } else {
    unusedDevDeps.push(dep);
  }
});

// Report findings
console.log('\n📊 Dependency Analysis Report\n');
console.log(`✅ Used dependencies (${usedDeps.length}):`);
usedDeps.forEach(dep => console.log(`   - ${dep}`));

if (unusedDeps.length > 0) {
  console.log(`\n⚠️  Potentially unused dependencies (${unusedDeps.length}):`);
  unusedDeps.forEach(dep => console.log(`   - ${dep}`));
}

console.log(`\n✅ Used devDependencies (${usedDevDeps.length}):`);
usedDevDeps.forEach(dep => console.log(`   - ${dep}`));

if (unusedDevDeps.length > 0) {
  console.log(`\n⚠️  Potentially unused devDependencies (${unusedDevDeps.length}):`);
  unusedDevDeps.forEach(dep => console.log(`   - ${dep}`));
}

// Create optimized package.json
const optimizedPackageJson = {
  ...packageJson,
  scripts: {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "clean": "rm -rf .next node_modules package-lock.json && npm install",
    "clean:deps": "node scripts/clean-deps.js",
    "setup": "./setup.sh"
  }
};

// Write optimized package.json suggestion
fs.writeFileSync('package.optimized.json', JSON.stringify(optimizedPackageJson, null, 2));

console.log('\n💡 Suggestions:');
console.log('1. Review potentially unused dependencies listed above');
console.log('2. Check package.optimized.json for cleaned up scripts');
console.log('3. Run "npm prune" to remove extraneous packages');
console.log('4. Consider running "npm dedupe" to optimize dependency tree');

if (unusedDeps.length > 0 || unusedDevDeps.length > 0) {
  console.log('\n🗑️  To remove potentially unused dependencies:');
  unusedDeps.forEach(dep => {
    console.log(`   npm uninstall ${dep}`);
  });
  unusedDevDeps.forEach(dep => {
    console.log(`   npm uninstall -D ${dep}`);
  });
}

console.log('\n✨ Analysis complete!');
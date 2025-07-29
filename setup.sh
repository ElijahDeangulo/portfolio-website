#!/bin/bash

# Portfolio Website Setup Script
# This script cleans up the project directory and prepares it for development/deployment

echo "🚀 Setting up Portfolio Website..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create necessary directories
echo "📁 Creating directory structure..."
mkdir -p docs/archive

# Move documentation files to archive (except essential ones)
echo "📚 Organizing documentation..."
files_to_archive=(
    "COMPLETE_REFACTOR_ANALYSIS.md"
    "REFACTOR_COMPLETE_SUMMARY.md"
    "REFACTOR_GUIDE.md"
    "PERFORMANCE_OPTIMIZATION_GUIDE.md"
    "COMPILATION_OPTIMIZATION_SUMMARY.md"
    "EMAIL_SETUP.md"
)

for file in "${files_to_archive[@]}"; do
    if [ -f "$file" ]; then
        mv "$file" docs/archive/ 2>/dev/null && echo "  ✓ Archived $file"
    fi
done

# Clean up backup files
echo ""
echo "🧹 Cleaning up backup files..."
find . -name "*backup*" -type f -not -path "./node_modules/*" -not -path "./docs/*" -delete 2>/dev/null
find . -name "*refactor*" -type f -not -path "./node_modules/*" -not -path "./docs/*" -delete 2>/dev/null
find . -name "*optimized*" -type f -not -path "./node_modules/*" -not -path "./docs/*" -not -name "HeroSectionOptimized.tsx" -delete 2>/dev/null
find . -name "page-*.tsx" -type f -delete 2>/dev/null

# Clean up log files
echo "📝 Removing log files..."
find . -name "*.log" -type f -not -path "./node_modules/*" -delete 2>/dev/null

# Remove TypeScript build info
echo "🔧 Cleaning TypeScript artifacts..."
rm -f tsconfig.tsbuildinfo

# Clean Next.js build artifacts
echo "🏗️  Cleaning build artifacts..."
rm -rf .next out build dist

# Check for required environment variables
echo ""
echo "🔐 Checking environment setup..."
if [ ! -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  Warning: .env.local not found${NC}"
    echo "   Creating .env.local template..."
    cat > .env.local.example << EOL
# Resend API Key for contact form
RESEND_API_KEY=your_resend_api_key_here

# Optional: Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
EOL
    echo "   ✓ Created .env.local.example - copy this to .env.local and add your keys"
fi

# Install dependencies if needed
echo ""
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Create a project info file
echo ""
echo "📄 Creating project info..."
cat > PROJECT_INFO.md << EOL
# Portfolio Website - Project Information

## Quick Start
\`\`\`bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
\`\`\`

## Project Structure
\`\`\`
app/
├── components/     # Reusable UI components
├── sections/       # Page sections
├── hooks/         # Custom React hooks
├── utils/         # Utility functions
├── types/         # TypeScript definitions
├── data/          # Static data
└── page.tsx       # Main page component
\`\`\`

## Key Features
- ✨ Custom cursor with interactive states
- 🎨 Dark/Light theme toggle
- 📱 Fully responsive design
- 🎵 Integrated music player
- 📧 Contact form with Resend API
- 🚀 Optimized performance with code splitting

## Environment Variables
- \`RESEND_API_KEY\`: Required for contact form functionality

## Deployment
This project is optimized for deployment on Vercel.

## Maintenance
- Run \`./setup.sh\` to clean up the project directory
- Check \`CLAUDE.md\` for AI assistant guidelines
EOL

echo "✓ Created PROJECT_INFO.md"

# Final summary
echo ""
echo "✅ ${GREEN}Setup complete!${NC}"
echo ""
echo "📊 Summary:"
echo "  - Documentation organized in docs/archive/"
echo "  - Backup files removed"
echo "  - Build artifacts cleaned"
echo "  - Project info created"
echo ""
echo "🚀 Next steps:"
if [ ! -f ".env.local" ]; then
    echo "  1. Copy .env.local.example to .env.local and add your API keys"
    echo "  2. Run 'npm run dev' to start developing"
else
    echo "  1. Run 'npm run dev' to start developing"
fi
echo ""
echo "Happy coding! 🎉"
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev        # Start development server at http://localhost:3000

# Build & Production
npm run build      # Build for production
npm run start      # Start production server

# Linting
npm run lint       # Run Next.js linting
```

## Architecture Overview

This is a Next.js 15 portfolio website with the following structure:

### Core Technologies
- **Framework**: Next.js 15.3.3 with React 19
- **Styling**: Tailwind CSS with custom theme variables
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Email**: Resend API for contact form

### Project Structure
- `app/` - Next.js App Router structure
  - `page.tsx` - Main single-page portfolio (active version)
  - `api/contact/` - Contact form endpoint using Resend
  - `components/` - Reusable UI components (CustomCursor, SkillsModal, etc.)
  - `sections/` - Page sections (HeroSection)
  - `data/` - Project data and content
  - `types/` - TypeScript type definitions
  - `hooks/` - Custom React hooks
  - `backup/` - Previous page versions

### Key Features
1. **Custom Cursor**: Interactive cursor that changes based on hover states
2. **Dark/Light Mode**: Theme toggle with CSS variables
3. **Smooth Scrolling**: Section-based navigation with parallax effects
4. **Featured Projects**: Carousel with project details and modals
5. **Contact Form**: Integrated with Resend API for email notifications
6. **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### State Management
- Local state with React hooks
- Dark mode persistence via localStorage
- Global cursor state management in CustomCursor component

### Performance Optimizations
- GPU acceleration with `willChange` and `backfaceVisibility`
- Passive event listeners
- Debounced scroll handlers
- Lazy loading for images

## Important Notes

1. **API Key**: The Resend API key in `app/api/contact/route.ts` should be moved to environment variables
2. **Multiple Page Versions**: Several page.tsx variants exist (page-refactored.tsx, etc.) - `page.tsx` is the active version
3. **Custom Cursor**: Uses a global reset mechanism to prevent stuck hover states
4. **Theme Variables**: Defined in `globals.css` using CSS custom properties for dark/light modes
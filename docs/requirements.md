# Portfolio Website Requirements

## System Requirements
- Node.js >= 18.17.0
- npm >= 9.0.0 or yarn >= 1.22.0
- Git

## Core Dependencies

### Framework & Runtime
- **Next.js** (15.3.3) - React framework with SSR/SSG
- **React** (19.0.0) - UI library
- **React DOM** (19.0.0) - React renderer for web

### Styling & UI
- **Tailwind CSS** (3.4.1) - Utility-first CSS framework
- **Framer Motion** (11.18.0) - Animation library
- **clsx** (2.1.1) - Utility for constructing className strings
- **tailwind-merge** (2.7.0) - Merge Tailwind CSS classes without conflicts

### API & Backend
- **Resend** (4.0.1) - Email API for contact form
- **react-resend** (0.2.0) - React integration for Resend

### Development Dependencies
- **TypeScript** (5.x) - Type safety
- **@types/react** - React type definitions
- **@types/node** - Node.js type definitions
- **ESLint** - Code linting
- **eslint-config-next** - Next.js ESLint configuration

## Environment Variables

Create a `.env.local` file by copying `.env.local.example`:

```bash
cp .env.local.example .env.local
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `RESEND_API_KEY` | API key from Resend for email functionality | `re_xxxxxxxxxxxxx` |
| `CONTACT_EMAIL` | Email address to receive contact form submissions | `your-email@example.com` |

### Optional Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics tracking ID | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_SITE_URL` | Full URL of your deployed site | `https://yourdomain.com` |
| `DEBUG` | Enable debug logging (development only) | `true` or `false` |

### Getting API Keys

1. **Resend API Key**
   - Sign up at https://resend.com
   - Navigate to API Keys section
   - Create a new API key
   - Copy and paste into `.env.local`

2. **Important Security Notes**
   - Never commit `.env.local` to version control
   - Always use environment variables for sensitive data
   - Rotate API keys regularly
   - Use different keys for development and production

## Installation

```bash
# Install all dependencies
npm install

# Or with yarn
yarn install

# Or with pnpm
pnpm install
```

## Scripts

```bash
# Development
npm run dev          # Start dev server on http://localhost:3000

# Production
npm run build        # Create optimized production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Cleanup
./setup.sh          # Clean project directory and organize files
```

## Optional Dependencies (can be added)

### Performance Monitoring
```bash
npm install @vercel/analytics  # Vercel Analytics
npm install @sentry/nextjs     # Error tracking
```

### Development Tools
```bash
npm install -D prettier        # Code formatting
npm install -D husky          # Git hooks
npm install -D lint-staged    # Run linters on staged files
```

### Testing (if needed)
```bash
npm install -D jest @testing-library/react  # Unit testing
npm install -D cypress                      # E2E testing
```

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment Requirements
- **Vercel** (recommended) - Zero config deployment
- **Node.js** hosting with PM2
- **Docker** support available

## API Keys Required
1. **Resend API Key**
   - Sign up at https://resend.com
   - Create API key
   - Add to `.env.local`

## Performance Targets
- Lighthouse Score: 90+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 200KB initial JS
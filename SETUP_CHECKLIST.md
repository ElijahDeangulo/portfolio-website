# Portfolio Website Setup Checklist

Use this checklist when setting up the project on a new machine or after cloning.

## Initial Setup

- [ ] **Clone the repository**
  ```bash
  git clone <repository-url>
  cd portfolio-website
  ```

- [ ] **Run the setup script**
  ```bash
  chmod +x setup.sh
  ./setup.sh
  ```

- [ ] **Configure environment variables**
  ```bash
  cp .env.local.example .env.local
  # Edit .env.local and add:
  # - RESEND_API_KEY (get from https://resend.com)
  # - CONTACT_EMAIL (your email address)
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  # or
  yarn install
  ```

## Configuration

- [ ] **Resend API Key**
  - Sign up at [Resend](https://resend.com)
  - Create an API key
  - Add to `.env.local`: `RESEND_API_KEY=re_xxxxx`
  - Add your email to `.env.local`: `CONTACT_EMAIL=your-email@example.com`

- [ ] **Update personal information**
  - [ ] Update profile image in `/public/images/profile.jpg`
  - [ ] Update resume in `/public/resume.pdf`
  - [ ] Contact email is now set via `CONTACT_EMAIL` environment variable
  - [ ] Update social links in components

## Development

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Verify all features**
  - [ ] Custom cursor works
  - [ ] Theme toggle functions
  - [ ] Contact form sends emails
  - [ ] All modals open/close properly
  - [ ] Animations run smoothly
  - [ ] Mobile responsive design

## Code Quality

- [ ] **Run linting**
  ```bash
  npm run lint
  ```

- [ ] **Check TypeScript**
  ```bash
  npx tsc --noEmit
  ```

- [ ] **Clean unused dependencies**
  ```bash
  node scripts/clean-deps.js
  ```

## Pre-Deployment

- [ ] **Test production build**
  ```bash
  npm run build
  npm run start
  ```

- [ ] **Check bundle size**
  ```bash
  # After build, check .next/analyze/ if you add @next/bundle-analyzer
  ```

- [ ] **Performance audit**
  - [ ] Run Lighthouse audit
  - [ ] Check Core Web Vitals
  - [ ] Test on mobile devices

## Deployment (Vercel)

- [ ] **Connect to Vercel**
  ```bash
  vercel
  ```

- [ ] **Set environment variables in Vercel**
  - Add `RESEND_API_KEY` (required)
  - Add `CONTACT_EMAIL` (required)
  - Add `NEXT_PUBLIC_GA_ID` (optional)
  - Add `NEXT_PUBLIC_SITE_URL` (optional)

- [ ] **Configure domain** (if custom domain)

## Maintenance

- [ ] **Regular cleanup**
  ```bash
  ./setup.sh  # Cleans up backup files and organizes docs
  ```

- [ ] **Update dependencies**
  ```bash
  npm update
  npm audit fix
  ```

- [ ] **Backup important files**
  - `.env.local`
  - Any custom modifications

## Troubleshooting

### Build fails
```bash
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### TypeScript errors
```bash
rm tsconfig.tsbuildinfo
npm run build
```

### Dependency issues
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Project Structure Overview

```
portfolio-website/
├── app/                    # Next.js 13+ app directory
│   ├── components/         # Reusable components
│   ├── sections/          # Page sections
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   ├── api/               # API routes
│   └── page.tsx           # Main page
├── public/                # Static assets
├── scripts/               # Build/maintenance scripts
├── docs/                  # Documentation
└── setup.sh              # Setup script
```

## Notes

- The project uses Next.js 15 with App Router
- Styling is done with Tailwind CSS
- Animations use Framer Motion
- Contact form uses Resend API
- Optimized for deployment on Vercel
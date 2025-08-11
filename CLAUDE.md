# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

This is a Next.js application using pnpm as the package manager. Common commands:

- `pnpm dev` - Start development server
- `pnpm build` - Build production version
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Architecture

This is an n8n template directory website built with Next.js 15 and React 19. Key architectural components:

### Frontend Stack
- **Framework**: Next.js 15 with App Router and React Server Components
- **Styling**: Tailwind CSS with custom n8n-themed color palette
- **UI Components**: shadcn/ui components with Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono

### Project Structure
- `app/` - Next.js App Router pages and layouts
  - `page.tsx` - Main template directory listing page
  - `template/[id]/page.tsx` - Individual template detail pages
  - `privacy/` and `terms/` - Static legal pages
- `components/ui/` - shadcn/ui components (buttons, cards, forms, etc.)
- `lib/utils.ts` - Utility functions (Tailwind class merging)
- `hooks/` - Custom React hooks

### Design System
The application uses a dark theme with n8n branding:
- Primary brand color: `#E87C57` (n8n orange)
- Dark background: `#0F0B1A` 
- Card backgrounds: `#1A1225`
- Borders: `#2D1A3F`
- Hover states: `#4D3A5F`

### Key Features
- Template directory with search and filtering
- Individual template detail pages with comprehensive information
- Responsive design optimized for dark theme
- Email subscription form for weekly reports
- Integration badges and metadata display

### Configuration Notes
- TypeScript and ESLint errors are ignored during builds (`next.config.mjs`)
- Images are unoptimized for static export compatibility
- Uses absolute imports with `@/` prefix for components and utilities
- No README file exists - project setup should be inferred from package.json

### Data Structure
Templates contain: title, description, node count, author, update date, category, integrations, use cases, setup steps, target roles, industries, and tags. Currently uses mock data in components.
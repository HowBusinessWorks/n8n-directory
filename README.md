# n8n Template Directory

A modern web application showcasing n8n workflow templates with search, filtering, and detailed template information. Built with Next.js 15, React 19, and Tailwind CSS.

## 🚀 Features

- **Template Directory**: Browse through a comprehensive collection of n8n workflow templates
- **Advanced Search & Filtering**: Find templates by category, role, industry, complexity, and keywords
- **Template Details**: Comprehensive template information including setup instructions, integrations, and use cases
- **Newsletter Subscription**: Weekly reports for staying updated with new templates
- **Responsive Design**: Optimized for all device sizes with dark theme
- **Modern UI**: Built with shadcn/ui components and n8n brand styling

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **UI Library**: React 19 with Server Components
- **Styling**: Tailwind CSS with custom n8n theme
- **Components**: shadcn/ui with Radix UI primitives
- **Icons**: Lucide React
- **Fonts**: Geist Sans and Geist Mono
- **Form Handling**: React Hook Form with Zod validation

### Backend & Data
- **Database**: Supabase (PostgreSQL)
- **API Routes**: Next.js API routes for template submission and newsletter
- **Type Safety**: Full TypeScript implementation

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint (disabled during builds for rapid development)
- **Type Checking**: TypeScript (errors ignored during builds)

## 📁 Project Structure

```
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── newsletter/subscribe/ # Newsletter subscription endpoint
│   │   └── templates/submit/     # Template submission endpoint
│   ├── template/[id]/           # Dynamic template detail pages
│   ├── privacy/                 # Privacy policy page
│   ├── terms/                   # Terms of service page
│   ├── layout.tsx              # Root layout with theme provider
│   ├── page.tsx                # Main template directory page
│   └── globals.css             # Global styles and CSS variables
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── theme-provider.tsx      # Dark theme provider
├── lib/
│   ├── supabase.ts            # Supabase client configuration
│   ├── templates.ts           # Template data fetching and filtering
│   ├── template-upload.ts     # Template submission logic
│   └── utils.ts               # Utility functions (cn, etc.)
├── hooks/                     # Custom React hooks
├── public/                    # Static assets
└── styles/                    # Additional stylesheets
```

## 🎨 Design System

The application follows n8n's dark theme design language:

- **Primary Brand**: `#E87C57` (n8n orange)
- **Background**: `#0F0B1A` (dark purple)
- **Cards**: `#1A1225` (dark card background)
- **Borders**: `#2D1A3F`
- **Hover States**: `#4D3A5F`

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm package manager
- Supabase project (for database functionality)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd n8n_directory
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

```bash
# Development
pnpm dev          # Start development server with hot reloading

# Production
pnpm build        # Build optimized production bundle
pnpm start        # Start production server

# Code Quality
pnpm lint         # Run ESLint for code linting
```

## 🏗 Key Features Implementation

### Template Directory
- Dynamic template loading from Supabase
- Real-time search with debounced input
- Multi-faceted filtering (category, role, industry, complexity)
- Pagination for large datasets
- Sorting options (recent, popular, alphabetical, node count)

### Template Detail Pages
- Dynamic routing with Next.js App Router
- Comprehensive template information display
- Integration badges and metadata
- Setup instructions and use cases
- Related templates suggestions

### Newsletter Integration
- Email subscription form with validation
- API endpoint for subscription handling
- Success/error state management

## 🔧 Configuration

### Next.js Configuration (`next.config.mjs`)
- ESLint and TypeScript errors ignored during builds for rapid development
- Image optimization disabled for static export compatibility
- Optimized for Vercel deployment

### Tailwind Configuration
- Custom n8n color palette
- Extended theme with brand-specific colors
- Responsive breakpoints and spacing
- Animation utilities for smooth interactions


### Code Style Guidelines

- Use TypeScript for all new code
- Follow the existing component structure and naming conventions
- Use Tailwind CSS classes for styling (avoid custom CSS)
- Implement proper error handling and loading states
- Write descriptive commit messages

## 📝 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For questions or support, please refer to the project documentation or contact the development team.

---

*Last updated: August 2025*
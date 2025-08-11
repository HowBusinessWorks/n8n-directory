# n8n Template Directory - Project Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Data Models](#data-models)
6. [Component Architecture](#component-architecture)
7. [Styling & Design System](#styling--design-system)
8. [Development Setup](#development-setup)
9. [API Requirements (Backend TODO)](#api-requirements-backend-todo)
10. [Database Schema (Backend TODO)](#database-schema-backend-todo)
11. [Deployment](#deployment)

## Project Overview

**n8n Template Directory** is a Next.js web application that serves as a comprehensive directory for n8n workflow templates. The platform allows users to browse, search, and discover n8n automation templates across various categories, industries, and use cases.

### Key Features

- **Template Discovery**: Browse and search through n8n workflow templates
- **Advanced Filtering**: Filter by categories, roles, industries, complexity levels
- **Template Details**: Comprehensive template information including setup steps, use cases, and JSON workflows
- **Email Subscription**: Weekly template updates via email
- **Template Contribution**: Community-driven template submissions
- **Responsive Design**: Mobile-first design with dark theme

### Current State

- ✅ **Frontend**: Complete Next.js application with mock data
- ❌ **Backend**: Not implemented (uses hardcoded data)
- ❌ **Database**: Not implemented
- ❌ **API**: Not implemented

## Architecture

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (Next.js)     │◄──►│   (TODO)        │◄──►│   (TODO)        │
│                 │    │                 │    │                 │
│ - Template List │    │ - CRUD APIs     │    │ - Templates     │
│ - Template View │    │ - Search        │    │ - Users         │
│ - Search/Filter │    │ - Filter        │    │ - Subscriptions │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Current Frontend Architecture

- **Framework**: Next.js 15 with App Router
- **Rendering**: Client-side rendering ("use client")
- **Routing**: File-based routing with dynamic routes
- **State Management**: React hooks (useState)
- **Data**: Hardcoded mock data

## Technology Stack

### Frontend (Implemented)

| Category | Technology | Version | Purpose |
|----------|------------|---------|---------|
| Framework | Next.js | 15.2.4 | React framework with App Router |
| Runtime | React | 19 | UI library |
| Language | TypeScript | 5 | Type safety |
| Styling | Tailwind CSS | 3.4.17 | Utility-first CSS |
| UI Components | shadcn/ui | Various | Pre-built accessible components |
| UI Primitives | Radix UI | Various | Headless UI components |
| Icons | Lucide React | 0.454.0 | Icon library |
| Fonts | Geist | 1.3.1 | Sans and mono fonts |
| Package Manager | pnpm | - | Fast package manager |

### Backend (TODO)

| Category | Recommended Technology | Purpose |
|----------|----------------------|---------|
| Runtime | Node.js / Python | Backend server |
| Framework | Express.js / FastAPI | Web framework |
| Database | PostgreSQL | Primary database |
| ORM | Prisma / SQLAlchemy | Database ORM |
| Authentication | JWT | User authentication |
| Email | SendGrid / Mailgun | Email notifications |
| File Storage | AWS S3 / Cloudinary | Template assets |

## Project Structure

```
n8n-template-directory/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout component
│   ├── loading.tsx              # Loading UI component
│   ├── page.tsx                 # Homepage (template directory)
│   ├── privacy/
│   │   └── page.tsx            # Privacy policy page
│   ├── template/
│   │   └── [id]/
│   │       └── page.tsx        # Dynamic template detail page
│   └── terms/
│       └── page.tsx            # Terms of service page
├── components/
│   ├── theme-provider.tsx       # Theme context provider
│   └── ui/                     # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── badge.tsx
│       └── ... (40+ components)
├── hooks/
│   ├── use-mobile.tsx          # Mobile detection hook
│   └── use-toast.ts            # Toast notification hook
├── lib/
│   └── utils.ts                # Utility functions (cn helper)
├── public/                     # Static assets
│   ├── placeholder-logo.png
│   ├── placeholder-user.jpg
│   └── ...
├── styles/
│   └── globals.css             # Additional global styles
├── CLAUDE.md                   # AI assistant guidelines
├── components.json             # shadcn/ui configuration
├── next.config.mjs            # Next.js configuration
├── package.json               # Dependencies and scripts
├── tailwind.config.ts         # Tailwind CSS configuration
└── tsconfig.json              # TypeScript configuration
```

## Data Models

### Template Data Structure

```typescript
interface Template {
  id: number | string;
  title: string;
  description: string;
  nodes: number;
  complexity: 'Beginner' | 'Intermediate' | 'Advanced';
  industries: string[];
  integrations: Array<{
    name: string;
    logo?: string;
    description?: string;
  }>;
  useCases?: string[];
  howWorks?: string;
  setupSteps?: string[];
  categories?: string[];
  roles?: string[];
  tags?: string[];
  workflow_json?: any; // n8n workflow JSON
  source?: string;
  created_at?: Date;
  updated_at?: Date;
  author?: string;
}
```

### Current Mock Data

The application currently uses two main data structures:

1. **Homepage Templates** (`app/page.tsx:10-88`): Array of 6 simplified templates
2. **Template Details** (`app/template/[id]/page.tsx:30-118`): Detailed template object with only ID "1" populated

## Component Architecture

### Page Components

| Component | File | Description |
|-----------|------|-------------|
| `TemplateDirectory` | `app/page.tsx` | Homepage with template grid and filters |
| `TemplatePage` | `app/template/[id]/page.tsx` | Individual template detail view |
| `RootLayout` | `app/layout.tsx` | Root layout with fonts and metadata |

### Key UI Components Used

| Component | Purpose | Props |
|-----------|---------|-------|
| `Card` | Template containers | `className`, `children` |
| `Button` | Interactive elements | `variant`, `size`, `onClick` |
| `Badge` | Tags and labels | `variant`, `className` |
| `Dialog` | JSON workflow modal | `open`, `onOpenChange` |
| `Input` | Search and email forms | `type`, `placeholder`, `className` |

### State Management

```typescript
// Homepage State
const [isFilterOpen, setIsFilterOpen] = useState(false)
const [isContributionOpen, setIsContributionOpen] = useState(false)

// Template Page State
const [isJsonModalOpen, setIsJsonModalOpen] = useState(false)
const [isCopied, setIsCopied] = useState(false)
const [isContributionOpen, setIsContributionOpen] = useState(false)
```

## Styling & Design System

### Color Palette

```typescript
// Custom n8n Brand Colors (tailwind.config.ts)
const colors = {
  n8n: {
    dark: "#0F0B1A",        // Main background
    card: "#1A1225",        // Card backgrounds  
    border: "#2D1A3F",      // Border color
    hover: "#4D3A5F",       // Hover states
    "purple-hover": "#3D2A4F", // Purple hover variant
    orange: "#E87C57",      // Primary brand color
    "orange-hover": "#FF8D66", // Orange hover state
  }
}
```

### Design System Rules

1. **Dark Theme**: Consistent dark color scheme throughout
2. **Brand Color**: `#E87C57` (n8n orange) for primary actions and highlights
3. **Typography**: Geist Sans for body text, Geist Mono for code
4. **Spacing**: Tailwind's spacing scale (4px base unit)
5. **Border Radius**: Consistent rounded corners (`rounded-lg`, `rounded-2xl`)
6. **Hover Effects**: Smooth transitions on interactive elements

### Component Styling Patterns

```scss
// Card Hover Effect Pattern
.card:hover {
  border-color: rgba(232, 124, 87, 0.6); // n8n orange with opacity
  box-shadow: 0 25px 50px -12px rgba(232, 124, 87, 0.2);
}

// Button Primary Pattern
.btn-primary {
  background: #E87C57;
  &:hover {
    background: #FF8D66;
  }
}
```

## Development Setup

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd n8n-template-directory

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint
```

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `pnpm dev` | Start dev server on localhost:3000 |
| Build | `pnpm build` | Build production bundle |
| Start | `pnpm start` | Start production server |
| Lint | `pnpm lint` | Run ESLint |

### Configuration Files

- **Next.js**: `next.config.mjs` - Ignores TypeScript/ESLint errors, unoptimized images
- **TypeScript**: `tsconfig.json` - ES6 target, strict mode, path aliases
- **Tailwind**: `tailwind.config.ts` - Custom n8n colors, animations
- **Components**: `components.json` - shadcn/ui configuration

## API Requirements (Backend TODO)

The following APIs need to be implemented to replace mock data:

### Template APIs

```typescript
// GET /api/templates - List templates with filtering
GET /api/templates?search=string&category=string&industry=string&role=string&sort=string&limit=number&offset=number

// GET /api/templates/:id - Get template by ID
GET /api/templates/:id

// POST /api/templates - Create new template (admin/contributor)
POST /api/templates

// PUT /api/templates/:id - Update template
PUT /api/templates/:id

// DELETE /api/templates/:id - Delete template
DELETE /api/templates/:id
```

### Subscription APIs

```typescript
// POST /api/subscribe - Subscribe to weekly emails
POST /api/subscribe { email: string }

// POST /api/unsubscribe - Unsubscribe from emails  
POST /api/unsubscribe { email: string, token: string }
```

### Metadata APIs

```typescript
// GET /api/categories - Get all categories
GET /api/categories

// GET /api/industries - Get all industries
GET /api/industries  

// GET /api/roles - Get all roles
GET /api/roles

// GET /api/integrations - Get all integrations
GET /api/integrations
```

### Contribution APIs

```typescript
// POST /api/templates/submit - Submit new template
POST /api/templates/submit

// GET /api/templates/pending - Get pending submissions (admin)
GET /api/templates/pending

// POST /api/templates/approve/:id - Approve submission (admin)
POST /api/templates/approve/:id
```

## Database Schema (Backend TODO)

### Core Tables

```sql
-- Templates table
CREATE TABLE templates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  workflow_json JSONB NOT NULL,
  nodes_count INTEGER NOT NULL,
  complexity VARCHAR(50) NOT NULL,
  source VARCHAR(100),
  author_id INTEGER REFERENCES users(id),
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Industries table  
CREATE TABLE industries (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Roles table
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL
);

-- Integrations table
CREATE TABLE integrations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  logo_url VARCHAR(255),
  description TEXT
);

-- Users table (for contributors)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Email subscriptions
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  active BOOLEAN DEFAULT true,
  unsubscribe_token VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Junction Tables

```sql
-- Template categories (many-to-many)
CREATE TABLE template_categories (
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, category_id)
);

-- Template industries (many-to-many)
CREATE TABLE template_industries (
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  industry_id INTEGER REFERENCES industries(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, industry_id)
);

-- Template roles (many-to-many)
CREATE TABLE template_roles (
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, role_id)
);

-- Template integrations (many-to-many)
CREATE TABLE template_integrations (
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  integration_id INTEGER REFERENCES integrations(id) ON DELETE CASCADE,
  PRIMARY KEY (template_id, integration_id)
);

-- Template tags (many-to-many)
CREATE TABLE template_tags (
  template_id INTEGER REFERENCES templates(id) ON DELETE CASCADE,
  tag VARCHAR(100) NOT NULL,
  PRIMARY KEY (template_id, tag)
);
```

## Deployment

### Frontend Deployment Options

1. **Vercel** (Recommended for Next.js)
2. **Netlify**
3. **AWS Amplify** 
4. **Static hosting** (since images are unoptimized)

### Backend Deployment Options

1. **Railway** - Simple PostgreSQL + Node.js
2. **Heroku** - Traditional PaaS
3. **AWS** - EC2 + RDS
4. **DigitalOcean** - Droplets + Managed Database

### Environment Variables Needed

```env
# Frontend
NEXT_PUBLIC_API_URL=https://api.n8nvault.com

# Backend
DATABASE_URL=postgresql://user:pass@host:5432/db
JWT_SECRET=your-secret-key
EMAIL_API_KEY=your-email-service-key
ADMIN_EMAIL=admin@n8nvault.com
```

## Next Steps

1. **Backend Implementation**: Build REST API with chosen stack
2. **Database Setup**: Implement PostgreSQL schema and migrations
3. **Authentication**: Add user management and contributor system
4. **Email Service**: Integrate email subscription functionality  
5. **Admin Panel**: Build template management interface
6. **Search Enhancement**: Implement full-text search
7. **File Uploads**: Add template asset management
8. **Analytics**: Track template usage and downloads

---

*This documentation is a living document and should be updated as the project evolves.*
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Template type definition matching our database schema
export interface Template {
  id: string
  title: string
  description: string
  workflow_json: any
  node_count: number
  nodes_used: string[]
  source: string | null
  source_url: string | null
  source_path: string | null
  categories: string[]
  use_case: string | null
  complexity_level: string
  automation_pattern: string | null
  has_triggers: boolean
  has_ai_nodes: boolean
  workflow_hash: string | null
  ai_title: string | null
  ai_description: string | null
  ai_use_cases: string[]
  ai_how_works: string[]
  ai_setup_steps: string[]
  ai_apps_used: string[]
  ai_categories: string | null
  ai_roles: string[]
  ai_industries: string[]
  ai_tags: string[]
  popularity_score: number
  created_at: string | null
  updated_at: string | null
  extracted_at: string | null
  // New fields from reprocessing
  slug: string | null
  structure_hash: string | null
  connection_pattern: string | null
  processed_at: string | null
  is_duplicate: boolean | null
  duplicate_of: string | null
}

// Frontend-friendly template type (simplified for UI)
export interface TemplateDisplay {
  id: string
  title: string
  description: string
  slug: string
  nodes: number
  complexity: 'Beginner' | 'Intermediate' | 'Advanced'
  industries: string[]
  integrations: Array<{
    name: string
    logo?: string
    description?: string
  }>
  useCases?: string[]
  howWorks?: string
  setupSteps?: string[]
  categories?: string[]
  roles?: string[]
  tags?: string[]
  workflow_json?: any
  source?: string
}

// Helper function to transform database template to display format
export function transformTemplateForDisplay(template: Template): TemplateDisplay {
  // Create slug from database slug or fallback to title
  const slug = template.slug || createSlugFallback(template.ai_title || template.title)
  
  return {
    id: template.id,
    title: template.ai_title || template.title,
    description: template.description, // Enhanced description is now in the main description field
    slug: slug,
    nodes: template.node_count,
    complexity: mapComplexityLevel(template.complexity_level),
    industries: template.ai_industries || [],
    integrations: (template.ai_apps_used || []).map(app => ({ name: app })),
    useCases: template.ai_use_cases,
    howWorks: template.ai_how_works?.join('\n\n') || undefined,
    setupSteps: template.ai_setup_steps,
    categories: template.ai_categories ? [template.ai_categories] : [],
    roles: template.ai_roles,
    tags: template.ai_tags,
    workflow_json: template.workflow_json,
    source: template.source || undefined,
  }
}

// Lightweight transform function for partial Template data (for pagination queries)
export function transformPartialTemplateForDisplay(template: any): TemplateDisplay {
  // Create slug from database slug or fallback to title
  const slug = template.slug || createSlugFallback(template.ai_title || template.title)
  
  return {
    id: template.id,
    title: template.ai_title || template.title,
    description: template.description, // Enhanced description is now in the main description field
    slug: slug,
    nodes: template.node_count,
    complexity: mapComplexityLevel(template.complexity_level),
    industries: template.ai_industries || [],
    integrations: (template.ai_apps_used || []).map((app: string) => ({ name: app })),
    useCases: template.ai_use_cases || [],
    howWorks: template.ai_how_works?.join('\n\n') || undefined,
    setupSteps: template.ai_setup_steps || [],
    categories: template.ai_categories ? [template.ai_categories] : [],
    roles: template.ai_roles || [],
    tags: template.ai_tags || [],
    workflow_json: template.workflow_json || undefined,
    source: template.source || undefined,
  }
}

// Fallback slug creation for templates without slugs
function createSlugFallback(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 80)
    .replace(/-$/, '')
}

// Map database complexity levels to frontend display
function mapComplexityLevel(level: string): 'Beginner' | 'Intermediate' | 'Advanced' {
  switch (level?.toLowerCase()) {
    case 'simple':
      return 'Beginner'
    case 'medium':
      return 'Intermediate'
    case 'complex':
      return 'Advanced'
    default:
      return 'Beginner'
  }
}
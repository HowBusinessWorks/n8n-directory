import { supabase, Template, TemplateDisplay, transformTemplateForDisplay } from './supabase'

// Filter and search options
export interface TemplateFilters {
  search?: string
  category?: string
  industry?: string
  role?: string
  complexity?: string
  useCase?: string
  sortBy?: 'recent' | 'popular' | 'alphabetical' | 'node_count'
  limit?: number
  offset?: number
}

// Get templates with filtering and pagination
export async function getTemplates(filters: TemplateFilters = {}): Promise<{
  templates: TemplateDisplay[]
  total: number
  error: string | null
}> {
  try {
    let query = supabase
      .from('templates')
      .select('*', { count: 'exact' })
      .or('status.eq.published,status.is.null') // Only show published templates (null for legacy data)

    // Apply search filter
    if (filters.search) {
      query = query.or(`title.ilike.%${filters.search}%,ai_title.ilike.%${filters.search}%,description.ilike.%${filters.search}%,ai_description.ilike.%${filters.search}%`)
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      query = query.contains('categories', [filters.category])
    }

    // Apply industry filter
    if (filters.industry && filters.industry !== 'All') {
      query = query.contains('ai_industries', [filters.industry])
    }

    // Apply role filter
    if (filters.role && filters.role !== 'All') {
      query = query.contains('ai_roles', [filters.role])
    }

    // Apply complexity filter
    if (filters.complexity && filters.complexity !== 'All') {
      const complexityMap: { [key: string]: string } = {
        'Beginner': 'simple',
        'Intermediate': 'medium',
        'Advanced': 'complex'
      }
      const dbComplexity = complexityMap[filters.complexity] || filters.complexity.toLowerCase()
      query = query.eq('complexity_level', dbComplexity)
    }

    // Apply use case filter
    if (filters.useCase && filters.useCase !== 'All') {
      query = query.eq('use_case', filters.useCase)
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'popular':
        query = query.order('popularity_score', { ascending: false })
        break
      case 'alphabetical':
        query = query.order('title', { ascending: true })
        break
      case 'node_count':
        query = query.order('node_count', { ascending: false })
        break
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Apply pagination
    if (filters.limit) {
      query = query.limit(filters.limit)
    }
    if (filters.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching templates:', error)
      return { templates: [], total: 0, error: error.message }
    }

    const templates = data?.map(transformTemplateForDisplay) || []

    return {
      templates,
      total: count || 0,
      error: null
    }

  } catch (err) {
    console.error('Unexpected error fetching templates:', err)
    return {
      templates: [],
      total: 0,
      error: 'An unexpected error occurred'
    }
  }
}

// Get single template by ID
export async function getTemplateById(id: string): Promise<{
  template: TemplateDisplay | null
  error: string | null
}> {
  try {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .or('status.eq.published,status.is.null') // Only allow viewing published templates
      .single()

    if (error) {
      console.error('Error fetching template:', error)
      return { template: null, error: error.message }
    }

    if (!data) {
      return { template: null, error: 'Template not found' }
    }

    const template = transformTemplateForDisplay(data)

    return {
      template,
      error: null
    }

  } catch (err) {
    console.error('Unexpected error fetching template:', err)
    return {
      template: null,
      error: 'An unexpected error occurred'
    }
  }
}

// Get distinct filter options
export async function getFilterOptions(): Promise<{
  categories: string[]
  industries: string[]
  roles: string[]
  useCases: string[]
  complexityLevels: string[]
  error: string | null
}> {
  try {
    // Get all templates to extract unique filter values
    const { data, error } = await supabase
      .from('templates')
      .select('categories, ai_industries, ai_roles, use_case, complexity_level')

    if (error) {
      console.error('Error fetching filter options:', error)
      return {
        categories: [],
        industries: [],
        roles: [],
        useCases: [],
        complexityLevels: [],
        error: error.message
      }
    }

    // Extract unique values
    const categories = new Set<string>()
    const industries = new Set<string>()
    const roles = new Set<string>()
    const useCases = new Set<string>()
    const complexityLevels = new Set<string>()

    data?.forEach(template => {
      // Categories
      template.categories?.forEach((cat: string) => categories.add(cat))
      
      // Industries
      template.ai_industries?.forEach((ind: string) => industries.add(ind))
      
      // Roles
      template.ai_roles?.forEach((role: string) => roles.add(role))
      
      // Use cases
      if (template.use_case) useCases.add(template.use_case)
      
      // Complexity levels (mapped to frontend names)
      if (template.complexity_level) {
        const mapped = mapComplexityToDisplay(template.complexity_level)
        complexityLevels.add(mapped)
      }
    })

    return {
      categories: Array.from(categories).sort(),
      industries: Array.from(industries).sort(),
      roles: Array.from(roles).sort(),
      useCases: Array.from(useCases).sort(),
      complexityLevels: Array.from(complexityLevels).sort(),
      error: null
    }

  } catch (err) {
    console.error('Unexpected error fetching filter options:', err)
    return {
      categories: [],
      industries: [],
      roles: [],
      useCases: [],
      complexityLevels: [],
      error: 'An unexpected error occurred'
    }
  }
}

// Helper function to map complexity levels for display
function mapComplexityToDisplay(level: string): string {
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

// Get template statistics
export async function getTemplateStats(): Promise<{
  total: number
  byComplexity: { [key: string]: number }
  byUseCase: { [key: string]: number }
  error: string | null
}> {
  try {
    const { data, error, count } = await supabase
      .from('templates')
      .select('complexity_level, use_case', { count: 'exact' })

    if (error) {
      return { total: 0, byComplexity: {}, byUseCase: {}, error: error.message }
    }

    const byComplexity: { [key: string]: number } = {}
    const byUseCase: { [key: string]: number } = {}

    data?.forEach(template => {
      // Count by complexity
      if (template.complexity_level) {
        const mapped = mapComplexityToDisplay(template.complexity_level)
        byComplexity[mapped] = (byComplexity[mapped] || 0) + 1
      }

      // Count by use case
      if (template.use_case) {
        byUseCase[template.use_case] = (byUseCase[template.use_case] || 0) + 1
      }
    })

    return {
      total: count || 0,
      byComplexity,
      byUseCase,
      error: null
    }

  } catch (err) {
    console.error('Unexpected error fetching template stats:', err)
    return {
      total: 0,
      byComplexity: {},
      byUseCase: {},
      error: 'An unexpected error occurred'
    }
  }
}
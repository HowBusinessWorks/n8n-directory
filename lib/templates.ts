import { supabase, TemplateDisplay, transformTemplateForDisplay, transformPartialTemplateForDisplay } from './supabase'
import { createSlug } from './utils'

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
      .select('id, title, ai_title, description, ai_description, node_count, created_at, updated_at, ai_categories, ai_industries, ai_roles, ai_use_cases, ai_how_works, ai_setup_steps, ai_apps_used, ai_tags, complexity_level, use_case, status, popularity_score, source', { count: 'exact' })
      .or('status.eq.published,status.is.null') // Only show published templates (null for legacy data)

    // Apply search filter with multi-keyword support and prioritization
    let searchKeywords: string[] = []
    if (filters.search) {
      const searchInput = filters.search.toLowerCase().trim()
      searchKeywords = searchInput.split(/\s+/).filter(keyword => keyword.length > 0)
      
      if (searchKeywords.length === 1) {
        // Single keyword - use original logic
        const searchTerm = searchKeywords[0]
        query = query.or(`title.ilike.%${searchTerm}%,ai_title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,ai_description.ilike.%${searchTerm}%,ai_apps_used.cs.{${searchTerm}},ai_use_cases.cs.{${searchTerm}},ai_tags.cs.{${searchTerm}}`)
      } else {
        // Multiple keywords - each keyword must be found somewhere (AND logic)
        searchKeywords.forEach(keyword => {
          query = query.or(`title.ilike.%${keyword}%,ai_title.ilike.%${keyword}%,description.ilike.%${keyword}%,ai_description.ilike.%${keyword}%,ai_apps_used.cs.{${keyword}},ai_use_cases.cs.{${keyword}},ai_tags.cs.{${keyword}}`)
        })
      }
    }

    // Apply category filter
    if (filters.category && filters.category !== 'All') {
      query = query.eq('ai_categories', filters.category)
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

    // Apply basic sorting (search prioritization will be done in JavaScript)
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
    if (filters.limit && filters.offset !== undefined) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1)
    } else if (filters.limit) {
      query = query.limit(filters.limit)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching templates:', error)
      return { templates: [], total: 0, error: error.message }
    }

    let templates = data?.map(transformPartialTemplateForDisplay) || []

    // Apply search result prioritization if searching
    if (searchKeywords.length > 0) {
      templates = templates.sort((a, b) => {
        // Check if template titles contain ALL search keywords
        const aHasTitleMatch = searchKeywords.every(keyword => 
          a.title.toLowerCase().includes(keyword)
        )
        const bHasTitleMatch = searchKeywords.every(keyword => 
          b.title.toLowerCase().includes(keyword)
        )

        // Prioritize title matches
        if (aHasTitleMatch && !bHasTitleMatch) return -1
        if (!aHasTitleMatch && bHasTitleMatch) return 1

        // If both have title matches or both don't, maintain original order
        return 0
      })
    }

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

// Generate SEO-friendly slug from template title
export function generateTemplateSlug(template: TemplateDisplay): string {
  if (!template || !template.title) {
    console.warn('generateTemplateSlug received template with no title:', template)
    return 'untitled'
  }
  return createSlug(template.title)
}

// Get template by SEO-friendly slug  
export async function getTemplateBySlug(slug: string): Promise<{
  template: TemplateDisplay | null
  error: string | null
}> {
  try {
    console.log('Looking for template with slug:', slug)
    
    // Convert slug back to potential title patterns for more efficient search
    const titlePattern = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .replace(/\\bAnd\\b/g, '&')
    
    console.log('Searching for title pattern:', titlePattern)
    
    // First try exact title match or ai_title match
    let { data, error } = await supabase
      .from('templates')
      .select('*')
      .or('status.eq.published,status.is.null')
      .or(`title.ilike.${titlePattern},ai_title.ilike.${titlePattern}`)
      .limit(20) // Limit to first 20 potential matches
    
    if (error) {
      console.error('Error fetching templates for slug lookup:', error)
      return { template: null, error: error.message }
    }
    
    // If no exact matches, try fuzzy search with individual words
    if (!data || data.length === 0) {
      console.log('No exact title matches, trying fuzzy search...')
      const searchTerms = slug.split('-').filter(term => term.length > 2) // Skip short words
      if (searchTerms.length > 0) {
        const searchPattern = searchTerms.join('|')
        const result = await supabase
          .from('templates')
          .select('*')
          .or('status.eq.published,status.is.null')
          .or(`title.ilike.%${searchPattern}%,ai_title.ilike.%${searchPattern}%`)
          .limit(50)
          
        data = result.data
        error = result.error
      }
    }

    if (error || !data || data.length === 0) {
      console.log('No templates found matching slug')
      return { template: null, error: 'Template not found' }
    }

    console.log(`Checking ${data.length} potential matches for exact slug match...`)

    // Check each potential match for exact slug match
    for (const templateData of data) {
      const template = transformTemplateForDisplay(templateData)
      const templateSlug = generateTemplateSlug(template)
      
      if (templateSlug === slug) {
        console.log(`Found matching template: "${template.title}" -> slug: "${templateSlug}"`)
        return {
          template,
          error: null
        }
      }
    }

    console.log('No exact slug match found for:', slug)
    return { template: null, error: 'Template not found' }

  } catch (err) {
    console.error('Unexpected error fetching template by slug:', err)
    return {
      template: null,
      error: 'An unexpected error occurred'
    }
  }
}


// Get template by ID or slug (handles both UUID and slug formats)
export async function getTemplate(idOrSlug: string): Promise<{
  template: TemplateDisplay | null
  error: string | null
}> {
  // Check if it's a UUID format (contains hyphens and is 36 characters)
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug)
  
  if (isUUID) {
    // Handle as UUID
    return getTemplateById(idOrSlug)
  } else {
    // Handle as slug
    return getTemplateBySlug(idOrSlug)
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
    // Get only the fields needed for filter options (much faster)
    const { data, error } = await supabase
      .from('templates')
      .select('ai_categories, ai_industries, ai_roles, use_case, complexity_level')
      .or('status.eq.published,status.is.null') // Only published templates

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
      // Categories (ai_categories is a single string, not an array)
      if (template.ai_categories) categories.add(template.ai_categories)
      
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
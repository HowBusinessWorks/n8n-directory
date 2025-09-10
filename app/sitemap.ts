import { MetadataRoute } from 'next'
import { getFilterOptions } from '@/lib/templates'
import { createSlug } from '@/lib/utils'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://n8njson.io'
  
  try {
    // Get all filter options to generate dynamic pages
    const { categories, industries, roles } = await getFilterOptions()
    
    // Base static pages
    const staticPages: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]
    
    // Category pages
    const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
      url: `${baseUrl}/category/${createSlug(category)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    // Industry pages
    const industryPages: MetadataRoute.Sitemap = industries.map((industry) => ({
      url: `${baseUrl}/industry/${createSlug(industry)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    // Role pages
    const rolePages: MetadataRoute.Sitemap = roles.map((role) => ({
      url: `${baseUrl}/role/${createSlug(role)}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
    
    // Note: Template pages would require getting all templates, which might be expensive
    // For now, we'll include the main navigation pages
    // Template pages can be added later or discovered through crawling
    
    return [
      ...staticPages,
      ...categoryPages,
      ...industryPages,
      ...rolePages,
    ]
    
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap with just static pages
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/privacy`,
        lastModified: new Date(),
        changeFrequency: 'yearly',
        priority: 0.3,
      },
    ]
  }
}
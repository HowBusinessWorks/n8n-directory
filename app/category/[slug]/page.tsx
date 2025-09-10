import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, ChevronLeft, ChevronRight, Braces, Heart } from "lucide-react"
import Link from "next/link"
import { getTemplates, getFilterOptions, TemplateFilters } from "@/lib/templates"
import { slugToName, createSlug } from "@/lib/utils"
import { notFound } from "next/navigation"

interface CategoryPageProps {
  params: { slug: string }
  searchParams: { page?: string }
}

// Generate static parameters for all category pages
export async function generateStaticParams() {
  try {
    const { categories } = await getFilterOptions()
    return categories.map((category) => ({
      slug: createSlug(category),
    }))
  } catch (error) {
    console.error('Error generating static params for categories:', error)
    return []
  }
}

// Generate SEO metadata for each category page
export async function generateMetadata({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categoryName = slugToName(resolvedParams.slug)
  
  try {
    // Verify category exists and get template count
    const { categories } = await getFilterOptions()
    const matchingCategory = categories.find(cat => createSlug(cat) === resolvedParams.slug)
    
    if (!matchingCategory) {
      return {
        title: 'Category Not Found | n8n json',
        description: 'The requested category was not found in our template directory.',
      }
    }

    // Use approximate count for SEO metadata (faster than full query)
    const templateCount = 40 // Will be dynamically updated with actual count
    
    return {
      title: `${categoryName} Templates | n8n json`,
      description: `Discover ${templateCount} ${categoryName.toLowerCase()} automation templates for n8n workflows. Browse ready-to-use templates to streamline your ${categoryName.toLowerCase()} processes.`,
      openGraph: {
        title: `${categoryName} Templates | n8n json`,
        description: `Discover ${templateCount} ${categoryName.toLowerCase()} automation templates for n8n workflows.`,
        url: `https://n8njson.com/category/${resolvedParams.slug}`,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${categoryName} Templates | n8n json`,
        description: `Discover ${templateCount} ${categoryName.toLowerCase()} automation templates for n8n workflows.`,
      },
      alternates: {
        canonical: `https://n8njson.com/category/${resolvedParams.slug}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata for category:', error)
    return {
      title: `${categoryName} Templates | n8n json`,
      description: `Browse ${categoryName.toLowerCase()} automation templates for n8n workflows.`,
    }
  }
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams
  const categoryName = slugToName(resolvedParams.slug)
  const currentPage = parseInt(resolvedSearchParams.page || '1', 10)
  const ITEMS_PER_PAGE = 12

  // First verify category exists
  const { categories } = await getFilterOptions()
  const matchingCategory = categories.find(cat => createSlug(cat) === resolvedParams.slug)
  
  if (!matchingCategory) {
    notFound()
  }
  
  const filters: TemplateFilters = {
    category: matchingCategory,
    sortBy: 'recent',
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE
  }

  const { templates, total, error } = await getTemplates(filters)
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE)
  
  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: "#0F0B1A" }}>
        <div className="text-center py-16">
          <p className="text-red-400 mb-4">Error loading templates: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0B1A" }}>
      {/* Navigation Header */}
      <div className="bg-gradient-to-r from-[#1A1225] to-[#2D1A3F]">
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#E87C57] p-1.5 rounded-md">
                <Braces className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">n8n json</h3>
            </Link>
            
            {/* Right Side - Templates Link + Contribution Button */}
            <div className="flex items-center gap-4">
              <Link href="/" className="text-white hover:text-[#E87C57] transition-colors font-medium text-sm">
                Templates
              </Link>
              <Button 
                variant="ghost"
                asChild
                className="text-white hover:text-[#E87C57] hover:bg-transparent font-medium px-4 py-1.5 transition-colors text-sm border border-transparent hover:border-[#E87C57]"
              >
                <a href="https://tally.so/r/3qlBlY" target="_blank" rel="noopener noreferrer">
                  <Heart className="h-3 w-3 mr-1.5" />
                  Contribute Template
                </a>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      {/* Enhanced Header */}
      <div className="relative bg-gradient-to-br from-[#1A1225] via-[#2D1A3F] to-[#1A1225] px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 pt-20 pb-16">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 25% 25%, #E87C57 2px, transparent 2px), radial-gradient(circle at 75% 75%, #E87C57 1px, transparent 1px)',
            backgroundSize: '50px 50px, 30px 30px'
          }}></div>
        </div>
        
        <div className="relative mx-auto max-w-6xl">
          <div className="text-center">
            {/* Category badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#E87C57]/20 to-[#FF8D66]/20 border border-[#E87C57]/30 mb-6">
              <span className="text-[#E87C57] text-sm font-medium uppercase tracking-wider">
                Category
              </span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                {categoryName}
              </span>
              <br />
              <span className="text-2xl sm:text-3xl lg:text-4xl text-[#E87C57]">
                Templates
              </span>
            </h1>
            
            {total > 0 && (
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                Discover <span className="text-[#E87C57] font-semibold">{total}</span> automation templates designed to streamline your <span className="text-white font-medium">{categoryName.toLowerCase()}</span> processes
              </p>
            )}
            
            <Link 
              href="/" 
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#E87C57] to-[#FF8D66] text-white font-medium hover:from-[#FF8D66] hover:to-[#E87C57] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#E87C57]/25 transform hover:scale-105"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to all templates
            </Link>
          </div>
        </div>
      </div>

      {/* Templates Section */}
      <section className="px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 bg-[#0F0B1A] pt-16 pb-16">
        <div className="mx-auto max-w-6xl">

          {/* Template Grid */}
          {templates.length > 0 && (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {templates.map((template) => (
                <Link key={template.id} href={`/template/${template.slug}`} className="block">
                  <Card
                    className="backdrop-blur-sm transition-all duration-300 border hover:border-[#E87C57]/60 hover:shadow-xl hover:shadow-[#E87C57]/20 flex flex-col group cursor-pointer h-full"
                    style={{
                      backgroundColor: "#1A1225",
                      borderColor: "#2D1A3F",
                    }}
                  >
                  <CardContent className="p-6 flex flex-col flex-1">
                    {/* Header with Title and Node Count */}
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <h3 className="text-xl font-semibold leading-tight text-white group-hover:text-[#E87C57] transition-colors duration-300 flex-1">
                        {template.title}
                      </h3>
                      <span className="text-[#E87C57] group-hover:text-[#FF8D66] font-medium text-sm whitespace-nowrap transition-colors duration-300">
                        {template.nodes} nodes
                      </span>
                    </div>

                    {/* Description */}
                    <div className="mb-4 flex-1">
                      <p className="text-gray-300 group-hover:text-gray-200 text-sm leading-relaxed line-clamp-3 transition-colors duration-300">
                        {template.description}
                      </p>
                    </div>

                    {/* Industries */}
                    <div className="mb-4 min-h-[2.5rem] flex items-start">
                      <div className="flex flex-wrap gap-1.5">
                        {template.industries.slice(0, 3).map((industry, index) => (
                          <span
                            key={index}
                            className="px-2.5 py-1 bg-gradient-to-r from-[#E87C57]/20 to-[#FF8D66]/20 text-[#E87C57] text-xs rounded-full border border-[#E87C57]/30 font-medium"
                          >
                            {industry}
                          </span>
                        ))}
                        {template.industries.length > 3 && (
                          <span className="px-2.5 py-1 bg-gradient-to-r from-[#E87C57]/20 to-[#FF8D66]/20 text-[#E87C57] text-xs rounded-full border border-[#E87C57]/30 font-medium">
                            +{template.industries.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Integrations */}
                    <div className="mb-6 min-h-[2.5rem] flex items-start">
                      <div className="flex flex-wrap gap-2">
                        {template.integrations.slice(0, 3).map((integration, index) => (
                          <div
                            key={index}
                            className="px-3 py-1.5 rounded-md bg-[#2D1A3F] group-hover:bg-[#3D2A4F] border border-[#4D3A5F] group-hover:border-[#5D4A6F] transition-all duration-300"
                          >
                            <span className="text-white group-hover:text-gray-100 text-xs font-medium transition-colors duration-300">{integration.name}</span>
                          </div>
                        ))}
                        {template.integrations.length > 3 && (
                          <div className="px-3 py-1.5 rounded-md bg-[#2D1A3F] border border-[#4D3A5F]">
                            <span className="text-white text-xs font-medium">+{template.integrations.length - 3}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-auto">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium px-3 py-1 rounded-full transition-all duration-300 ${
                          template.complexity === 'Beginner' 
                            ? 'border-green-700/50 text-green-300/70 group-hover:border-green-600/70 group-hover:text-green-200/90'
                            : template.complexity === 'Intermediate'
                            ? 'border-yellow-700/50 text-yellow-300/70 group-hover:border-yellow-600/70 group-hover:text-yellow-200/90'
                            : 'border-red-700/50 text-red-300/70 group-hover:border-red-600/70 group-hover:text-red-200/90'
                        }`}
                      >
                        {template.complexity}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#E87C57] hover:text-[#FF8D66] hover:bg-[#2D1A3F] group-hover:bg-[#3D2A4F] group-hover:text-[#FF8D66] transition-all duration-300 font-medium p-2 pointer-events-none"
                      >
                        Use template
                        <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </Link>
              ))}
            </div>
          )}

          {/* Pagination Info */}
          {total > ITEMS_PER_PAGE && (
            <div className="text-center mt-12 mb-4">
              <p className="text-sm text-gray-400">
                Showing page {currentPage} of {totalPages} ({total} templates)
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              {/* Previous Button */}
              <Link href={currentPage > 1 ? `/category/${resolvedParams.slug}?page=${currentPage - 1}` : '#'}>
                <Button
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                  className="border-[#2D1A3F] bg-transparent text-white hover:bg-[#2D1A3F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              </Link>

              {/* Page Numbers */}
              <div className="flex gap-1 mx-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
                    if (page === 2 && currentPage > 4) {
                      return <span key={page} className="px-2 py-1 text-gray-400">...</span>
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 3) {
                      return <span key={page} className="px-2 py-1 text-gray-400">...</span>
                    }
                    return null
                  }

                  return (
                    <Link key={page} href={`/category/${resolvedParams.slug}?page=${page}`}>
                      <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        className={
                          page === currentPage
                            ? "bg-[#E87C57] hover:bg-[#FF8D66] text-white border-[#E87C57]"
                            : "border-[#2D1A3F] bg-transparent text-white hover:bg-[#2D1A3F] hover:text-white"
                        }
                      >
                        {page}
                      </Button>
                    </Link>
                  )
                })}
              </div>

              {/* Next Button */}
              <Link href={currentPage < totalPages ? `/category/${resolvedParams.slug}?page=${currentPage + 1}` : '#'}>
                <Button
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                  className="border-[#2D1A3F] bg-transparent text-white hover:bg-[#2D1A3F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}

          {/* No Results */}
          {templates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg mb-4">No templates found in the {categoryName} category.</p>
              <Link href="/">
                <Button className="bg-[#E87C57] hover:bg-[#FF8D66] text-white">
                  Browse All Templates
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
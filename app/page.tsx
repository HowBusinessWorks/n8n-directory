"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, ArrowRight, ChevronDown, Heart, Braces, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { getTemplates, getFilterOptions, getTemplateStats, TemplateFilters } from "@/lib/templates"
import { TemplateDisplay } from "@/lib/supabase"

export default function TemplateDirectory() {
  const [templates, setTemplates] = useState<TemplateDisplay[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)
  const [totalTemplatesCount, setTotalTemplatesCount] = useState(0)
  
  // Newsletter states
  const [email, setEmail] = useState("")
  const [newsletterLoading, setNewsletterLoading] = useState(false)
  const [newsletterMessage, setNewsletterMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  // Filter states
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRole, setSelectedRole] = useState("All")
  const [selectedIndustry, setSelectedIndustry] = useState("All")
  const [selectedComplexity, setSelectedComplexity] = useState("All")
  const [sortBy, setSortBy] = useState<"recent" | "popular" | "alphabetical" | "node_count">("recent")
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9
  
  // Filter options
  const [filterOptions, setFilterOptions] = useState({
    categories: [] as string[],
    industries: [] as string[],
    roles: [] as string[],
    complexityLevels: [] as string[]
  })
  
  // Other states (removed contribution modal)

  // Load filter options and total template count on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      const [filterOptions, templateStats] = await Promise.all([
        getFilterOptions(),
        getTemplateStats()
      ])
      
      setFilterOptions({ 
        categories: filterOptions.categories, 
        industries: filterOptions.industries, 
        roles: filterOptions.roles, 
        complexityLevels: filterOptions.complexityLevels 
      })
      
      setTotalTemplatesCount(templateStats.total)
    }
    loadInitialData()
  }, [])

  // Load templates based on current filters
  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      setError(null)
      
      const filters: TemplateFilters = {
        search: debouncedSearchTerm || undefined,
        category: selectedCategory !== "All" ? selectedCategory : undefined,
        role: selectedRole !== "All" ? selectedRole : undefined,
        industry: selectedIndustry !== "All" ? selectedIndustry : undefined,
        complexity: selectedComplexity !== "All" ? selectedComplexity : undefined,
        sortBy,
        limit: 1000 // Get more templates for pagination
      }

      const { templates: fetchedTemplates, total, error: fetchError } = await getTemplates(filters)
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setTemplates(fetchedTemplates)
        setTotalCount(total)
        setCurrentPage(1) // Reset to first page when filters change
      }
      
      setLoading(false)
    }

    loadTemplates()
  }, [debouncedSearchTerm, selectedCategory, selectedRole, selectedIndustry, selectedComplexity, sortBy])

  // Handle search with debouncing
  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }
  
  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300) // 300ms delay

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Calculate pagination
  const totalPages = Math.ceil(templates.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTemplates = templates.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of template section
    const templateSection = document.querySelector('#template-section')
    if (templateSection) {
      templateSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Newsletter subscription handler
  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email.trim()) {
      setNewsletterMessage({ type: 'error', text: 'Please enter your email address' })
      return
    }

    setNewsletterLoading(true)
    setNewsletterMessage(null)

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setNewsletterMessage({ type: 'success', text: data.message })
        setEmail('') // Clear the email input
      } else {
        setNewsletterMessage({ type: 'error', text: data.error || 'Failed to subscribe' })
      }
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      setNewsletterMessage({ type: 'error', text: 'An error occurred. Please try again later.' })
    } finally {
      setNewsletterLoading(false)
    }

    // Clear message after 5 seconds
    setTimeout(() => {
      setNewsletterMessage(null)
    }, 5000)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0F0B1A" }}>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#1A1225] to-[#2D1A3F] text-white">
        {/* Navigation Bar */}
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
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-12 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Template Count Badge */}
            <div className="flex justify-center mb-8">
              <div className="bg-[#E87C57] transition-colors py-4 px-8 rounded-full font-semibold text-3xl text-white shadow-xl">
                {totalTemplatesCount > 0 ? `${totalTemplatesCount.toLocaleString()} Templates` : 'Loading...'}
              </div>
            </div>

            {/* Heading */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mx-auto max-w-full sm:whitespace-nowrap">
                #1 FREE n8n Template Directory
              </h1>
            </div>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-10 text-gray-300">
            If you dont find it here, you wont find it angwhere else
            </p>

            {/* Email Form */}
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto mb-16">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={newsletterLoading}
                  className="flex-1 px-4 py-3 rounded-lg bg-[#2D1A3F] border border-[#4D3A5F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="submit"
                  disabled={newsletterLoading}
                  className="bg-[#E87C57] text-white hover:bg-[#FF8D66] transition-colors py-3 px-8 rounded-lg font-medium text-lg shadow-md whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[200px]"
                >
                  {newsletterLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Subscribing...
                    </>
                  ) : (
                    'Get Weekly Templates'
                  )}
                </button>
              </div>
              
              {/* Success/Error Message */}
              {newsletterMessage && (
                <div className={`mt-3 text-sm text-center transition-all duration-300 ${
                  newsletterMessage.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {newsletterMessage.text}
                </div>
              )}
              
              <p className="text-sm text-gray-400 mt-3 text-center">
                Get the best n8n templates delivered to your inbox every week
              </p>
            </form>
          </div>
        </div>
        {/* Curved bottom separator */}
        <div className="relative">
          <div className="w-full h-24 bg-[#0F0B1A] rounded-t-[50%]"></div>
        </div>
      </section>

      {/* Template Directory Section */}
      <section id="template-section" className="px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 bg-[#0F0B1A] -mt-12 pt-16 pb-16">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h2 className="mb-8 text-3xl font-bold text-white">Template Directory</h2>

            {/* Search and Filter Bar */}
            <div className="space-y-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for templates..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full px-6 py-4 pl-14 rounded-2xl bg-[#2D1A3F] border border-[#4D3A5F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] transition-colors text-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`bg-[#2D1A3F] text-white hover:bg-[#3D2A4F] transition-colors py-4 px-8 rounded-2xl font-medium text-lg shadow-md whitespace-nowrap flex items-center border border-[#4D3A5F] min-w-[140px] justify-center ${isFilterOpen ? 'bg-[#3D2A4F]' : ''}`}
                >
                  <SlidersHorizontal className="mr-3 h-5 w-5 text-[#E87C57]" />
                  Filters
                </button>
              </div>
              
              {/* Filter Section */}
              {isFilterOpen && (
                <div className="bg-[#1A1225] border border-[#2D1A3F] rounded-2xl p-6 space-y-6">
                  {/* Top Row Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Categories Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Categories</label>
                      <div className="relative">
                        <select 
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none"
                        >
                          <option value="All">All</option>
                          {filterOptions.categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Roles Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Roles</label>
                      <div className="relative">
                        <select 
                          value={selectedRole}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none"
                        >
                          <option value="All">All</option>
                          {filterOptions.roles.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Industries Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Industries</label>
                      <div className="relative">
                        <select 
                          value={selectedIndustry}
                          onChange={(e) => setSelectedIndustry(e.target.value)}
                          className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none"
                        >
                          <option value="All">All</option>
                          {filterOptions.industries.map((industry) => (
                            <option key={industry} value={industry}>
                              {industry}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Sort By Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Sort by</label>
                      <div className="relative">
                        <select 
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value as any)}
                          className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none"
                        >
                          <option value="recent">Recently Added</option>
                          <option value="popular">Most Popular</option>
                          <option value="alphabetical">Alphabetical</option>
                          <option value="node_count">Node Count</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-[#E87C57]" />
              <span className="ml-2 text-white">Loading templates...</span>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-16">
              <p className="text-red-400 mb-4">Error loading templates: {error}</p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-[#E87C57] hover:bg-[#FF8D66]"
              >
                Retry
              </Button>
            </div>
          )}

          {/* Template Grid */}
          {!loading && !error && (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
              {currentTemplates.map((template) => (
                <Link key={template.id} href={`/template/${template.id}`} className="block">
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
                            className="px-2.5 py-1 bg-gradient-to-r from-[#E87C57]/20 to-[#FF8D66]/20 group-hover:from-[#E87C57]/30 group-hover:to-[#FF8D66]/30 text-[#E87C57] group-hover:text-[#FF8D66] text-xs rounded-full border border-[#E87C57]/30 group-hover:border-[#E87C57]/50 font-medium transition-all duration-300"
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

                    {/* Integrations - Fixed position */}
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

                    {/* Footer - at bottom */}
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

          {/* Pagination */}
          {!loading && !error && templates.length > 0 && totalPages > 1 && (
            <div className="flex justify-center items-center mt-12 gap-2">
              {/* Previous Button */}
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="border-[#2D1A3F] bg-transparent text-white hover:bg-[#2D1A3F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {/* Page Numbers */}
              <div className="flex gap-1 mx-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  // Show first page, last page, current page, and pages around current page
                  const showPage = 
                    page === 1 || 
                    page === totalPages || 
                    (page >= currentPage - 1 && page <= currentPage + 1)

                  if (!showPage) {
                    // Show ellipsis if there's a gap
                    if (page === 2 && currentPage > 4) {
                      return (
                        <span key={page} className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    if (page === totalPages - 1 && currentPage < totalPages - 3) {
                      return (
                        <span key={page} className="px-2 py-1 text-gray-400">
                          ...
                        </span>
                      )
                    }
                    return null
                  }

                  return (
                    <Button
                      key={page}
                      onClick={() => handlePageChange(page)}
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
                  )
                })}
              </div>

              {/* Next Button */}
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="border-[#2D1A3F] bg-transparent text-white hover:bg-[#2D1A3F] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}

          {/* Results Info */}
          {!loading && !error && templates.length > 0 && (
            <div className="flex justify-center mt-6">
              <p className="text-gray-400 text-sm">
                Showing {startIndex + 1}-{Math.min(endIndex, templates.length)} of {templates.length} templates
                {totalCount > templates.length && ` (${totalCount.toLocaleString()} total available)`}
              </p>
            </div>
          )}

          {/* No Results */}
          {!loading && !error && templates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">No templates found matching your criteria.</p>
              <Button 
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                  setSelectedRole("All")
                  setSelectedIndustry("All")
                  setSelectedComplexity("All")
                }}
                variant="outline"
                className="mt-4 border-[#E87C57] text-[#E87C57] hover:bg-[#E87C57] hover:text-white"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2D1A3F] py-8 bg-[#1A1225]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-[#E87C57] p-1.5 rounded-md">
                <Braces className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">n8n json</h3>
            </div>
            
            {/* Center Section - Contribution Button + Copyright */}
            <div className="flex flex-col items-center gap-3">
              <Button 
                asChild
                className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <a href="https://tally.so/r/3qlBlY" target="_blank" rel="noopener noreferrer">
                  <Heart className="h-4 w-4 mr-2" />
                  Contribute Template
                </a>
              </Button>
              <div className="text-gray-500 text-xs">
                © 2025 n8n json
              </div>
            </div>
            
            {/* Links */}
            <div className="flex gap-8">
              <Link href="/terms" className="text-gray-400 hover:text-[#E87C57] transition-colors text-sm">
                Terms
              </Link>
              <Link href="/privacy" className="text-gray-400 hover:text-[#E87C57] transition-colors text-sm">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  )
}
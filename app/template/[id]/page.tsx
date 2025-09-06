import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Users, Building, Tag, CheckCircle, Layers, FolderOpen, Braces, Heart } from "lucide-react"
import Link from "next/link"
import { getTemplate } from "@/lib/templates"
import { createSlug } from "@/lib/utils"
import { notFound } from "next/navigation"
import ClientTemplateInteractions from "./ClientTemplateInteractions"

interface TemplatePageProps {
  params: { id: string }
}

// Generate SEO metadata for template page
export async function generateMetadata({ params }: TemplatePageProps) {
  const resolvedParams = await params
  const templateId = resolvedParams.id
  
  const { template } = await getTemplate(templateId)
  
  if (!template) {
    return {
      title: 'Template Not Found | n8n json',
      description: 'The requested template was not found in our directory.',
    }
  }

  return {
    title: `${template.title} | n8n Template | n8n json`,
    description: template.description,
    openGraph: {
      title: `${template.title} | n8n Template`,
      description: template.description,
      url: `https://n8njson.com/template/${createSlug(template.title)}`,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${template.title} | n8n Template`,
      description: template.description,
    },
    alternates: {
      canonical: `https://n8njson.com/template/${createSlug(template.title)}`,
    },
  }
}

export default async function TemplatePage({ params }: TemplatePageProps) {
  const resolvedParams = await params
  const templateId = resolvedParams.id
  
  // Load template data server-side
  const { template, error } = await getTemplate(templateId)
  
  if (error || !template) {
    notFound()
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity.toLowerCase()) {
      case "beginner":
        return "#10B981"
      case "intermediate":
        return "#F59E0B"
      case "advanced":
        return "#EF4444"
      default:
        return "#E87C57"
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1A1225] to-[#2D1A3F] text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white hover:bg-[#2D1A3F] hover:text-white px-3 py-2 rounded-md transition-colors text-sm">
              <ArrowLeft className="h-4 w-4" />
              Back to Templates
            </Link>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-start justify-between gap-6 mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-[#E87C57]">{template.title}</h1>
              <div className="flex items-center gap-3">
                <Badge className="text-white font-medium text-center px-3" style={{ backgroundColor: "#2D1A3F" }}>
                  <span className="whitespace-nowrap">{template.nodes} nodes</span>
                </Badge>
                <Badge
                  className="text-white font-medium"
                  style={{ backgroundColor: getComplexityColor(template.complexity) }}
                >
                  {template.complexity}
                </Badge>
              </div>
            </div>

            <p className="text-lg text-gray-300 mb-6 leading-relaxed">{template.description}</p>

            <ClientTemplateInteractions template={template} variant="template-only" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Use Cases */}
            {template.useCases && template.useCases.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white">Use Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {template.useCases.map((useCase, index) => (
                      <li key={index} className="flex items-start gap-3 text-gray-300">
                        <CheckCircle className="h-5 w-5 text-[#E87C57] mt-0.5 flex-shrink-0" />
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* How It Works */}
            {template.howWorks && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white">How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{template.howWorks}</p>
                </CardContent>
              </Card>
            )}

            {/* Setup Steps */}
            {template.setupSteps && template.setupSteps.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white">Setup Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {template.setupSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-[#E87C57] text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-300 pt-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apps Used */}
            {template.integrations && template.integrations.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Apps Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.integrations.map((app, index) => (
                      <div key={index} className="text-gray-300 text-sm">
                        {app.name}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Categories */}
            {template.categories && template.categories.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.categories.map((category, index) => (
                      <Link key={index} href={`/category/${createSlug(category)}`}>
                        <Badge variant="outline" className="border-[#E87C57] text-[#E87C57] hover:bg-[#E87C57] hover:text-white transition-colors cursor-pointer">
                          {category}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Roles */}
            {template.roles && template.roles.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Target Roles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {template.roles.map((role, index) => (
                      <Link key={index} href={`/role/${createSlug(role)}`}>
                        <div className="text-gray-300 text-sm hover:text-[#E87C57] transition-colors cursor-pointer py-1">
                          {role}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Industries */}
            {template.industries && template.industries.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Industries
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.industries.map((industry, index) => (
                      <Link key={index} href={`/industry/${createSlug(industry)}`}>
                        <Badge variant="secondary" className="bg-[#2D1A3F] text-white hover:bg-[#E87C57] hover:text-white transition-colors cursor-pointer">
                          {industry}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white text-lg flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="border-[#4D3A5F] text-gray-300 text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Source - Temporarily disabled */}
            {/* {template.source && (
              <Card className="bg-[#1A1225] border-[#2D1A3F]">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Source</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm">{template.source}</p>
                </CardContent>
              </Card>
            )} */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#2D1A3F] py-8 bg-[#1A1225] mt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-[#E87C57] p-2 rounded-lg">
                <Braces className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">n8n json</h3>
            </div>
            
            {/* Center Section - Contribution Button + Copyright */}
            <div className="flex flex-col items-center gap-3">
              <ClientTemplateInteractions template={template} variant="footer" />
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
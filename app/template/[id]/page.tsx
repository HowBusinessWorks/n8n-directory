"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Eye, Users, Building, Tag, CheckCircle, Layers, FolderOpen, Copy, Check, Braces, Heart, Loader2 } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { getTemplateById } from "@/lib/templates"
import { TemplateDisplay } from "@/lib/supabase"

export default function TemplatePage() {
  const params = useParams()
  const templateId = params.id as string
  
  // State
  const [template, setTemplate] = useState<TemplateDisplay | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isContributionOpen, setIsContributionOpen] = useState(false)

  // Load template data
  useEffect(() => {
    const loadTemplate = async () => {
      if (!templateId) return
      
      setLoading(true)
      setError(null)
      
      const { template: fetchedTemplate, error: fetchError } = await getTemplateById(templateId)
      
      if (fetchError) {
        setError(fetchError)
      } else {
        setTemplate(fetchedTemplate)
      }
      
      setLoading(false)
    }

    loadTemplate()
  }, [templateId])

  const copyToClipboard = async () => {
    if (template?.workflow_json) {
      await navigator.clipboard.writeText(JSON.stringify(template.workflow_json, null, 2))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="flex items-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#E87C57]" />
          <span className="ml-2 text-white text-lg">Loading template...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4 text-lg">Error loading template: {error}</p>
          <div className="space-x-4">
            <Button 
              onClick={() => window.location.reload()}
              className="bg-[#E87C57] hover:bg-[#FF8D66]"
            >
              Retry
            </Button>
            <Link href="/">
              <Button variant="outline" className="border-[#E87C57] text-[#E87C57] hover:bg-[#E87C57] hover:text-white">
                Back to Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Template not found
  if (!template) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-xl mb-4">Template not found</p>
          <Link href="/">
            <Button className="bg-[#E87C57] hover:bg-[#FF8D66]">
              Back to Templates
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      {/* Header */}
      <header className="bg-gradient-to-r from-[#1A1225] to-[#2D1A3F] text-white">
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
                onClick={() => setIsContributionOpen(true)}
                className="text-white hover:text-[#E87C57] hover:bg-transparent font-medium px-4 py-1.5 transition-colors text-sm border border-transparent hover:border-[#E87C57]"
              >
                <Heart className="h-3 w-3 mr-1.5" />
                Contribute Template
              </Button>
            </div>
          </div>
        </nav>
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#2D1A3F] hover:text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Templates
              </Button>
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

            <div className="flex flex-wrap gap-3">
              <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium">
                    <Eye className="h-4 w-4 mr-2" />
                    See Template
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl w-full h-[80vh] bg-[#1A1225] border-[#2D1A3F]">
                  <DialogHeader>
                    <DialogTitle className="text-white text-xl flex items-center justify-between">
                      <span>n8n Workflow Template</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyToClipboard}
                        className={`transition-all duration-300 ${
                          isCopied 
                            ? "text-green-400 border-green-400 bg-green-400/10" 
                            : "text-[#E87C57] border-[#E87C57] hover:bg-[#E87C57] hover:text-white"
                        }`}
                      >
                        {isCopied ? (
                          <>
                            <Check className="h-4 w-4 mr-2" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4 mr-2" />
                            Copy JSON
                          </>
                        )}
                      </Button>
                    </DialogTitle>
                  </DialogHeader>
                  <div className="flex-1 overflow-hidden">
                    <pre className="bg-[#0F0B1A] border border-[#2D1A3F] rounded-lg p-4 h-full overflow-auto text-sm text-gray-300 font-mono">
                      {JSON.stringify(template.workflow_json, null, 2)}
                    </pre>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
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
                      <Badge key={index} variant="outline" className="border-[#E87C57] text-[#E87C57]">
                        {category}
                      </Badge>
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
                      <div key={index} className="text-gray-300 text-sm">
                        {role}
                      </div>
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
                      <Badge key={index} variant="secondary" className="bg-[#2D1A3F] text-white">
                        {industry}
                      </Badge>
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
              <Button 
                onClick={() => setIsContributionOpen(true)}
                className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                <Heart className="h-4 w-4 mr-2" />
                Contribute Template
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

      {/* Contribution Modal */}
      {isContributionOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1225] border border-[#2D1A3F] rounded-2xl p-8 max-w-md w-full">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-[#E87C57] p-3 rounded-full">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-white">Contribute to n8n json</h3>
              
              <p className="text-gray-300 leading-relaxed">
                Help the community by sharing your amazing n8n workflows! Your templates can help thousands of users automate their processes.
              </p>
              
              <div className="space-y-3">
                <Button className="w-full bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium py-3">
                  Submit Template
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-[#2D1A3F] text-gray-300 hover:bg-[#2D1A3F]"
                  onClick={() => setIsContributionOpen(false)}
                >
                  Close
                </Button>
              </div>
              
              <p className="text-xs text-gray-500">
                By contributing, you agree to our community guidelines and terms of service.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
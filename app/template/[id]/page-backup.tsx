"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Eye, Users, Building, Tag, CheckCircle, Layers, FolderOpen, Copy, Check, LayoutTemplate, Heart } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock template data - in real app this would come from API/database
interface TemplateData {
  title: string;
  description: string;
  useCases: string[];
  howWorks: string;
  setupSteps: string[];
  nrNodes: number;
  appsUsed: Array<{ name: string; logo: string; description: string }>;
  categories: string[];
  roles: string[];
  industries: string[];
  tags: string[];
  workflow_json: any;
  source: string;
  complexity: string;
}

const templateData: { [key: string]: TemplateData } = {
  "1": {
    title: "Sales Lead Qualification Process",
    description:
      "Automatically score and qualify leads based on behavior, engagement, and demographic data. This comprehensive workflow helps sales teams prioritize high-value prospects and improve conversion rates through intelligent lead scoring algorithms.",
    useCases: [
      "Automatically score incoming leads from multiple sources",
      "Qualify leads based on predefined criteria and behaviors",
      "Route qualified leads to appropriate sales representatives",
      "Track lead progression through the sales funnel",
      "Generate reports on lead quality and conversion rates",
    ],
    howWorks:
      "The workflow starts by collecting lead data from various sources like web forms, CRM systems, and marketing campaigns. It then applies scoring algorithms based on demographic information, behavioral data, and engagement metrics. Qualified leads are automatically routed to the appropriate sales team members with detailed scoring breakdowns.",
    setupSteps: [
      "Connect your CRM system (HubSpot, Salesforce, or Pipedrive)",
      "Configure lead scoring criteria and weights",
      "Set up data sources and webhooks",
      "Define qualification thresholds and routing rules",
      "Test the workflow with sample data",
      "Deploy and monitor performance",
    ],
    nrNodes: 8,
    appsUsed: [
      { name: "HubSpot", logo: "/placeholder.svg?height=32&width=32&text=H", description: "CRM and lead management" },
      {
        name: "Salesforce",
        logo: "/placeholder.svg?height=32&width=32&text=SF",
        description: "Customer relationship management",
      },
      { name: "Clearbit", logo: "/placeholder.svg?height=32&width=32&text=C", description: "Lead enrichment and data" },
    ],
    categories: ["Sales", "Lead Management", "Automation"],
    roles: ["Sales Manager", "Marketing Manager", "Revenue Operations"],
    industries: ["SaaS", "E-commerce", "B2B Services", "Technology"],
    tags: ["lead-scoring", "crm-integration", "sales-automation", "data-enrichment"],
    workflow_json: {
      "meta": {
        "instanceId": "f5b3b3b3-3b3b-3b3b-3b3b-3b3b3b3b3b3b"
      },
      "nodes": [
        {
          "parameters": {
            "url": "https://api.hubspot.com/crm/v3/objects/contacts",
            "authentication": "predefinedCredentialType",
            "nodeCredentialType": "hubspotApi",
            "options": {}
          },
          "id": "863b79fd-5d64-4053-b85f-5ac5e8498951",
          "name": "Get HubSpot Contacts",
          "type": "n8n-nodes-base.httpRequest",
          "typeVersion": 4.1,
          "position": [440, 300],
          "credentials": {
            "hubspotApi": {
              "id": "1",
              "name": "HubSpot API"
            }
          }
        },
        {
          "parameters": {
            "jsCode": "// Lead scoring algorithm\\nconst leads = $input.all();\\nconst scoredLeads = leads.map(lead => {\\n  let score = 0;\\n  \\n  // Score based on company size\\n  if (lead.json.properties.numberofemployees > 100) score += 20;\\n  else if (lead.json.properties.numberofemployees > 50) score += 10;\\n  \\n  // Score based on industry\\n  const highValueIndustries = ['Technology', 'Healthcare', 'Finance'];\\n  if (highValueIndustries.includes(lead.json.properties.industry)) score += 15;\\n  \\n  // Score based on website activity\\n  if (lead.json.properties.hs_analytics_num_page_views > 10) score += 10;\\n  \\n  return {\\n    ...lead.json,\\n    lead_score: score,\\n    qualification_status: score >= 30 ? 'Qualified' : 'Unqualified'\\n  };\\n});\\n\\nreturn scoredLeads;"
          },
          "id": "5f9e4b2d-1a3c-4e6b-8d7a-9c2b1e5f8a4d",
          "name": "Score Leads",
          "type": "n8n-nodes-base.code",
          "typeVersion": 2,
          "position": [640, 300]
        }
      ],
      "connections": {
        "Get HubSpot Contacts": {
          "main": [
            [
              {
                "node": "Score Leads",
                "type": "main",
                "index": 0
              }
            ]
          ]
        }
      }
    },
    source: "Community Template",
    complexity: "Intermediate",
  },
}

export default function TemplatePage() {
  const params = useParams()
  const templateId = params.id as string
  const template = templateData[templateId] || templateData["1"]
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isContributionOpen, setIsContributionOpen] = useState(false)

  const copyToClipboard = async () => {
    if (template?.workflow_json) {
      await navigator.clipboard.writeText(JSON.stringify(template.workflow_json, null, 2))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000) // Reset after 2 seconds
    }
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-white text-xl">Template not found</div>
      </div>
    )
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
        {/* Navigation Bar */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-[#E87C57] p-1.5 rounded-md">
                <LayoutTemplate className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">n8n vault</h3>
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
                <Badge className="text-white font-medium" style={{ backgroundColor: "#2D1A3F" }}>
                  {template.nrNodes} nodes
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

            {/* How It Works */}
            <Card className="bg-[#1A1225] border-[#2D1A3F]">
              <CardHeader>
                <CardTitle className="text-white">How It Works</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 leading-relaxed">{template.howWorks}</p>
              </CardContent>
            </Card>

            {/* Setup Steps */}
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
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apps Used */}
            <Card className="bg-[#1A1225] border-[#2D1A3F]">
              <CardHeader>
                <CardTitle className="text-white text-lg flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Apps Used
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {template.appsUsed.map((app, index) => (
                    <div key={index} className="text-gray-300 text-sm">
                      {app.name}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
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

            {/* Roles */}
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

            {/* Industries */}
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

            {/* Tags */}
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
                <LayoutTemplate className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white">n8n vault</h3>
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
                © 2025 n8n vault
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
              
              <h3 className="text-2xl font-bold text-white">Contribute to n8n vault</h3>
              
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

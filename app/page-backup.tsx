"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, ArrowRight, Zap, ChevronDown, Heart, LayoutTemplate } from "lucide-react"
import Link from "next/link"

const templates = [
  {
    id: 1,
    title: "Sales Lead Qualification Process",
    nodes: 8,
    description: "Automatically score and qualify leads based on behavior, engagement, and...",
    complexity: "Intermediate",
    industries: ["SaaS", "B2B Services", "Technology"],
    integrations: [
      { name: "HubSpot" },
      { name: "Salesforce" },
      { name: "Clearbit" },
    ],
  },
  {
    id: 2,
    title: "Customer Onboarding Automation",
    nodes: 9,
    description: "Streamline your customer onboarding with automated welcome emails, resource...",
    complexity: "Beginner",
    industries: ["SaaS", "E-learning", "Professional Services"],
    integrations: [
      { name: "Gmail" },
      { name: "Slack" },
      { name: "Calendly" },
    ],
  },
  {
    id: 3,
    title: "GitHub Issue to Slack Notification",
    nodes: 5,
    description: "Get real-time notifications in Slack when issues are created, updated, or closed in...",
    complexity: "Beginner",
    industries: ["Technology", "Software Development", "Startups"],
    integrations: [
      { name: "GitHub" },
      { name: "Slack" },
    ],
  },
  {
    id: 4,
    title: "Website Analytics to CRM Sync",
    nodes: 10,
    description: "Connect your website analytics with your CRM to enrich customer profiles with...",
    complexity: "Advanced",
    industries: ["E-commerce", "Marketing", "SaaS"],
    integrations: [
      { name: "Google Analytics" },
      { name: "HubSpot" },
      { name: "Salesforce" },
    ],
  },
  {
    id: 5,
    title: "Social Media Content Pipeline",
    nodes: 12,
    description: "Create a seamless content creation workflow from ideation to scheduling...",
    complexity: "Intermediate",
    industries: ["Marketing", "Media", "E-commerce"],
    integrations: [
      { name: "Twitter" },
      { name: "LinkedIn" },
      { name: "Buffer" },
    ],
  },
  {
    id: 6,
    title: "E-commerce Order Processing",
    nodes: 14,
    description: "Streamline order management from initial purchase to fulfillment, inventory updates...",
    complexity: "Advanced",
    industries: ["E-commerce", "Retail", "Manufacturing"],
    integrations: [
      { name: "Shopify" },
      { name: "Stripe" },
      { name: "Mailchimp" },
    ],
  },
]

export default function TemplateDirectory() {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isContributionOpen, setIsContributionOpen] = useState(false)

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
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 pt-12 pb-24">
          <div className="max-w-4xl mx-auto text-center">
            {/* Icon Section - Hidden but maintaining spacing */}
            <div className="flex justify-center mb-4">
              <div className="bg-transparent p-3 rounded-full">
                <div className="h-8 w-8"></div>
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 whitespace-nowrap">
              #1 FREE n8n Template Directory
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl mb-10 text-gray-300">
              If you don't find it here, you won't find it anywhere else
            </p>

            {/* Email Form */}
            <form className="max-w-md mx-auto mb-16">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 rounded-lg bg-[#2D1A3F] border border-[#4D3A5F] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#E87C57] text-white hover:bg-[#FF8D66] transition-colors py-3 px-6 rounded-lg font-medium text-lg shadow-md whitespace-nowrap"
                >
                  Get Weekly Templates
                </button>
              </div>
              <p className="text-sm text-gray-400 mt-3">
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
      <section className="px-6 sm:px-12 md:px-20 lg:px-32 xl:px-40 bg-[#0F0B1A] -mt-12 pt-16 pb-16">
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
                        <select className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none">
                          <option>All</option>
                          <option>Data Integration</option>
                          <option>Automation</option>
                          <option>Communication</option>
                          <option>E-commerce</option>
                          <option>Analytics</option>
                          <option>Marketing</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Roles Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Roles</label>
                      <div className="relative">
                        <select className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none">
                          <option>All</option>
                          <option>Sales Manager</option>
                          <option>Marketing Manager</option>
                          <option>Developer</option>
                          <option>Operations</option>
                          <option>Product Manager</option>
                          <option>Data Analyst</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Industries Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Industries</label>
                      <div className="relative">
                        <select className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none">
                          <option>All</option>
                          <option>SaaS</option>
                          <option>E-commerce</option>
                          <option>Technology</option>
                          <option>Marketing</option>
                          <option>Manufacturing</option>
                          <option>Healthcare</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    
                    {/* Sort By Filter */}
                    <div>
                      <label className="block text-white font-medium mb-3">Sort by</label>
                      <div className="relative">
                        <select className="w-full bg-[#2D1A3F] border border-[#4D3A5F] text-white rounded-xl py-3 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E87C57] focus:border-[#E87C57] appearance-none">
                          <option>Recently Added</option>
                          <option>Most Popular</option>
                          <option>Alphabetical</option>
                          <option>Node Count</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" style={{ gridAutoRows: '1fr' }}>
            {templates.map((template) => (
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
                      {template.industries.map((industry, index) => (
                        <span
                          key={index}
                          className="px-2.5 py-1 bg-gradient-to-r from-[#E87C57]/20 to-[#FF8D66]/20 group-hover:from-[#E87C57]/30 group-hover:to-[#FF8D66]/30 text-[#E87C57] group-hover:text-[#FF8D66] text-xs rounded-full border border-[#E87C57]/30 group-hover:border-[#E87C57]/50 font-medium transition-all duration-300"
                        >
                          {industry}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Integrations - Fixed position */}
                  <div className="mb-6 min-h-[2.5rem] flex items-start">
                    <div className="flex flex-wrap gap-2">
                      {template.integrations.map((integration, index) => (
                        <div
                          key={index}
                          className="px-3 py-1.5 rounded-md bg-[#2D1A3F] group-hover:bg-[#3D2A4F] border border-[#4D3A5F] group-hover:border-[#5D4A6F] transition-all duration-300"
                        >
                          <span className="text-white group-hover:text-gray-100 text-xs font-medium transition-colors duration-300">{integration.name}</span>
                        </div>
                      ))}
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
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#2D1A3F] py-8 bg-[#1A1225]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="bg-[#E87C57] p-1.5 rounded-md">
                <LayoutTemplate className="h-4 w-4 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white">n8n vault</h3>
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

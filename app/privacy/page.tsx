"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, LayoutTemplate, Heart } from "lucide-react"

export default function PrivacyPage() {
  const [isContributionOpen, setIsContributionOpen] = useState(false)
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
                Back to Home
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[#E87C57]">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-invert max-w-none">
          <div className="text-gray-300 space-y-6">
            <p className="text-lg">Last updated: {new Date().toLocaleDateString()}</p>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p>
                We collect information you provide directly to us, such as when you subscribe to our newsletter or
                contact us for support.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p>
                We use the information we collect to provide, maintain, and improve our services, send you newsletters
                and updates, and respond to your comments and questions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties without your
                consent, except as described in this privacy policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized
                access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p>If you have any questions about this Privacy Policy, please contact us through our website.</p>
            </section>
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

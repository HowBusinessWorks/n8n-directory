import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Braces, Heart, Search } from "lucide-react"

export default function NotFound() {
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
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#E87C57]/20 rounded-full mb-6">
              <Search className="h-12 w-12 text-[#E87C57]" />
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            <span className="text-[#E87C57]">404</span>
            <br />
            <span className="text-2xl sm:text-3xl lg:text-4xl">Page Not Found</span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-10 leading-relaxed">
            Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or doesn't exist.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium px-8 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl hover:shadow-[#E87C57]/25">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="border-[#2D1A3F] text-white hover:bg-[#2D1A3F] hover:text-white px-8 py-3 rounded-lg font-medium">
                Browse Templates
              </Button>
            </Link>
          </div>

          {/* Additional Help */}
          <div className="mt-12 p-6 bg-[#1A1225] border border-[#2D1A3F] rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-4">Looking for something specific?</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link href="/category/automation" className="text-[#E87C57] hover:text-[#FF8D66] transition-colors">
                Automation Templates
              </Link>
              <Link href="/category/integration" className="text-[#E87C57] hover:text-[#FF8D66] transition-colors">
                Integration Templates
              </Link>
              <Link href="/industry/marketing" className="text-[#E87C57] hover:text-[#FF8D66] transition-colors">
                Marketing Templates
              </Link>
              <Link href="/role/developer" className="text-[#E87C57] hover:text-[#FF8D66] transition-colors">
                Developer Templates
              </Link>
            </div>
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
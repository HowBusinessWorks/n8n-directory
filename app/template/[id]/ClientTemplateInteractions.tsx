"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Copy, Check, Heart, Eye } from "lucide-react"
import { TemplateDisplay } from "@/lib/supabase"


interface ClientTemplateInteractionsProps {
  template: TemplateDisplay
  variant?: 'navbar' | 'header' | 'footer' | 'buttons' | 'template-only'
}

export default function ClientTemplateInteractions({ template, variant = 'buttons' }: ClientTemplateInteractionsProps) {
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isContributionOpen, setIsContributionOpen] = useState(false)

  const copyToClipboard = async () => {
    if (template?.workflow_json) {
      await navigator.clipboard.writeText(JSON.stringify(template.workflow_json, null, 2))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  // Render different components based on variant
  if (variant === 'navbar') {
    return (
      <>
        <Button 
          variant="ghost"
          onClick={() => setIsContributionOpen(true)}
          className="text-white hover:text-[#E87C57] hover:bg-transparent font-medium px-4 py-1.5 transition-colors text-sm border border-transparent hover:border-[#E87C57]"
        >
          <Heart className="h-3 w-3 mr-1.5" />
          Contribute Template
        </Button>
        
        {/* Contribution Modal */}
        <Dialog open={isContributionOpen} onOpenChange={setIsContributionOpen}>
          <DialogContent className="max-w-md w-full bg-[#1A1225] border border-[#2D1A3F]">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold mb-4">Contribute Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300">
                Help us grow the template directory! Share your own n8n workflows with the community.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://tally.so/r/3qlBlY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Submit Your Template
                </a>
                <Button
                  variant="outline"
                  onClick={() => setIsContributionOpen(false)}
                  className="border-[#2D1A3F] text-gray-300 hover:bg-[#2D1A3F] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  if (variant === 'footer') {
    return (
      <>
        <Button 
          onClick={() => setIsContributionOpen(true)}
          className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium px-6 py-3 rounded-lg transition-colors"
        >
          <Heart className="h-4 w-4 mr-2" />
          Contribute Template
        </Button>
        
        {/* Contribution Modal */}
        <Dialog open={isContributionOpen} onOpenChange={setIsContributionOpen}>
          <DialogContent className="max-w-md w-full bg-[#1A1225] border border-[#2D1A3F]">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold mb-4">Contribute to n8n json</DialogTitle>
            </DialogHeader>
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
                <a
                  href="https://tally.so/r/3qlBlY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Submit Template
                </a>
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
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // 'template-only' variant - only shows the See Template button
  if (variant === 'template-only') {
    return (
      <>
        {/* See Template Button Only */}
        <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium">
              <Eye className="h-4 w-4 mr-2" />
              See Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full max-h-[80vh] bg-[#1A1225] border border-[#2D1A3F]">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold mb-4 flex items-center justify-between">
                <span>Template JSON</span>
                <Button
                  onClick={copyToClipboard}
                  className={`${
                    isCopied 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-[#E87C57] hover:bg-[#FF8D66]'
                  } text-white transition-colors`}
                  size="sm"
                >
                  {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-auto max-h-96 p-4 bg-[#0F0B1A] rounded-lg border border-[#2D1A3F]">
                {JSON.stringify(template.workflow_json, null, 2)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  // Default 'buttons' variant
  return (
    <>
      <div className="flex flex-wrap gap-3">
        {/* See Template Button */}
        <Dialog open={isJsonModalOpen} onOpenChange={setIsJsonModalOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium">
              <Eye className="h-4 w-4 mr-2" />
              See Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full max-h-[80vh] bg-[#1A1225] border border-[#2D1A3F]">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold mb-4 flex items-center justify-between">
                <span>Template JSON</span>
                <Button
                  onClick={copyToClipboard}
                  className={`${
                    isCopied 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-[#E87C57] hover:bg-[#FF8D66]'
                  } text-white transition-colors`}
                  size="sm"
                >
                  {isCopied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                  {isCopied ? 'Copied!' : 'Copy'}
                </Button>
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden">
              <pre className="text-gray-300 text-sm whitespace-pre-wrap overflow-auto max-h-96 p-4 bg-[#0F0B1A] rounded-lg border border-[#2D1A3F]">
                {JSON.stringify(template.workflow_json, null, 2)}
              </pre>
            </div>
          </DialogContent>
        </Dialog>

        {/* Contribute Template Button */}
        <Dialog open={isContributionOpen} onOpenChange={setIsContributionOpen}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="border-[#E87C57] text-[#E87C57] hover:bg-[#E87C57] hover:text-white font-medium transition-colors"
            >
              <Heart className="mr-2 h-4 w-4" />
              Contribute Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md w-full bg-[#1A1225] border border-[#2D1A3F]">
            <DialogHeader>
              <DialogTitle className="text-white text-xl font-bold mb-4">Contribute Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-300">
                Help us grow the template directory! Share your own n8n workflows with the community.
              </p>
              <div className="flex flex-col gap-3">
                <a
                  href="https://tally.so/r/3qlBlY"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-[#E87C57] hover:bg-[#FF8D66] text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-lg"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Submit Your Template
                </a>
                <Button
                  variant="outline"
                  onClick={() => setIsContributionOpen(false)}
                  className="border-[#2D1A3F] text-gray-300 hover:bg-[#2D1A3F] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  )
}
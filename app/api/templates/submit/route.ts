import { NextResponse } from 'next/server'
import { submitTemplateForReview } from '@/lib/template-upload'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    
    // Map Tally form fields to our API
    const {
      email,                    // Email field
      'full-name': fullName,    // Full Name field  
      'contact-info': contactInfo, // Your Contact info field
      'website': website,       // Your Website field
      'automation-json': automationJson // Automation JSON text field
    } = formData
    
    // Basic validation for required fields
    if (!email?.trim()) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }
    
    if (!fullName?.trim()) {
      return NextResponse.json(
        { error: 'Full name is required' },
        { status: 400 }
      )
    }
    
    if (!automationJson?.trim()) {
      return NextResponse.json(
        { error: 'Automation JSON is required' },
        { status: 400 }
      )
    }
    
    // Parse and validate the workflow JSON
    let parsedWorkflow
    try {
      parsedWorkflow = JSON.parse(automationJson.trim())
    } catch (error) {
      return NextResponse.json(
        { 
          error: 'Invalid JSON format. Please check your n8n workflow export.',
          details: 'Make sure you copied the complete JSON from n8n export.'
        },
        { status: 400 }
      )
    }
    
    // Validate workflow structure
    if (!parsedWorkflow.nodes || !Array.isArray(parsedWorkflow.nodes)) {
      return NextResponse.json(
        { error: 'Invalid workflow: missing or invalid nodes array' },
        { status: 400 }
      )
    }
    
    if (parsedWorkflow.nodes.length === 0) {
      return NextResponse.json(
        { error: 'Workflow must contain at least one node' },
        { status: 400 }
      )
    }
    
    // Extract title from workflow or generate one
    const workflowTitle = parsedWorkflow.name || 
                         parsedWorkflow.title || 
                         `${fullName}'s n8n Template`
    
    // Generate a basic description
    const nodeCount = parsedWorkflow.nodes.length
    const nodeTypes = [...new Set(parsedWorkflow.nodes.map((node: any) => 
      node.type.replace('n8n-nodes-base.', '').replace(/([A-Z])/g, ' $1').trim()
    ))]
    
    const description = `A ${nodeCount}-node n8n workflow using ${nodeTypes.slice(0, 3).join(', ')}${nodeTypes.length > 3 ? ` and ${nodeTypes.length - 3} more` : ''}. Contributed by ${fullName}.`
    
    // Submit template for review
    const result = await submitTemplateForReview({
      title: workflowTitle,
      description: description,
      workflow_json: parsedWorkflow,
      contributor_email: email.trim(),
      contributor_name: fullName.trim(),
      // Store additional contributor info
      contributor_contact: contactInfo?.trim(),
      contributor_website: website?.trim()
    })
    
    // Return success response (no email notifications)
    const response: any = {
      success: true,
      message: 'Template submitted successfully! It will be reviewed and published if approved.',
      templateId: result.templateId,
      workflowTitle: workflowTitle,
      nodeCount: nodeCount
    }
    
    // Include similar templates warning if any found
    if (result.similarTemplates && result.similarTemplates.length > 0) {
      response.warning = 'Similar templates were found, but your submission was accepted for review'
      response.similar = result.similarTemplates.map(t => ({
        title: t.title,
        similarity: Math.round(t.similarity * 100) + '%'
      }))
    }
    
    return NextResponse.json(response, { status: 201 })
    
  } catch (error: any) {
    console.error('Template submission error:', error)
    
    // Handle known duplicate errors
    if (error.message.includes('Template already exists')) {
      return NextResponse.json(
        { 
          error: 'This exact workflow already exists in our database',
          details: 'The workflow you submitted is identical to an existing template.'
        },
        { status: 409 }
      )
    }
    
    // Handle validation errors
    if (error.message.includes('required') || error.message.includes('Invalid')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    // Generic server error
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred while processing your submission. Please try again later.',
        support: 'If this problem persists, please contact support with your template details.'
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests for CORS (if needed for Tally webhook)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
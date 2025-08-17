import { supabase } from './supabase'
import crypto from 'crypto'

export interface TemplateUploadData {
  title: string
  description: string
  workflow_json: object
  source?: string
  source_url?: string
  categories?: string[]
  use_case?: string
  contributor_email?: string
  contributor_name?: string
  contributor_contact?: string
  contributor_website?: string
}

export interface DuplicateCheckResult {
  isDuplicate: boolean
  exactMatch?: {
    id: string
    title: string
  }
  similarTemplates?: Array<{
    id: string
    title: string
    similarity: number
  }>
}

/**
 * Generate workflow hash for duplicate detection
 */
export function generateWorkflowHash(workflowJson: object): string {
  const sortedWorkflow = JSON.stringify(workflowJson, Object.keys(workflowJson).sort())
  return crypto.createHash('md5').update(sortedWorkflow).digest('hex')
}

/**
 * Extract metadata from workflow JSON
 */
export function extractWorkflowMetadata(workflowJson: any) {
  const nodes = workflowJson.nodes || []
  const nodeCount = nodes.length
  const nodesUsed: string[] = Array.from(new Set(nodes.map((node: any) => node.type as string)))
  
  const hasTriggers = nodes.some((node: any) => 
    node.type.includes('trigger') || 
    node.type.includes('Trigger') ||
    node.type.includes('webhook')
  )
  
  const hasAiNodes = nodes.some((node: any) => 
    node.type.toLowerCase().includes('ai') || 
    node.type.toLowerCase().includes('openai') ||
    node.type.toLowerCase().includes('anthropic') ||
    node.type.toLowerCase().includes('claude') ||
    node.type.toLowerCase().includes('gpt')
  )

  return {
    nodeCount,
    nodesUsed,
    hasTriggers,
    hasAiNodes
  }
}

/**
 * Determine complexity level based on node count and types
 */
export function determineComplexity(nodeCount: number, nodesUsed: string[]): string {
  const complexNodes = nodesUsed.filter(node => 
    node.includes('code') || 
    node.includes('function') || 
    node.includes('Function') ||
    node.includes('ai') || 
    node.includes('webhook') ||
    node.includes('http') ||
    node.includes('database') ||
    node.includes('sql')
  ).length

  if (nodeCount <= 3 && complexNodes === 0) return 'simple'
  if (nodeCount <= 8 && complexNodes <= 2) return 'medium'
  return 'complex'
}

/**
 * Check for duplicate templates
 */
export async function checkForDuplicates(workflowHash: string, title: string, nodeCount: number, nodesUsed: string[]): Promise<DuplicateCheckResult> {
  // Check for exact duplicate by workflow hash
  const { data: exactMatch } = await supabase
    .from('templates')
    .select('id, title, workflow_hash')
    .eq('workflow_hash', workflowHash)
    .single()

  if (exactMatch) {
    return {
      isDuplicate: true,
      exactMatch: {
        id: exactMatch.id,
        title: exactMatch.title
      }
    }
  }

  // Check for similar templates
  const titleKeywords = title.split(' ').slice(0, 3).join('%')
  const { data: candidates } = await supabase
    .from('templates')
    .select('id, title, node_count, nodes_used')
    .ilike('title', `%${titleKeywords}%`)
    .eq('node_count', nodeCount)

  const similarTemplates = candidates?.map(template => {
    const templateNodes: string[] = Array.isArray(template.nodes_used) 
      ? template.nodes_used as string[]
      : JSON.parse(template.nodes_used || '[]') as string[]
    
    const sharedNodes = nodesUsed.filter(node => templateNodes.includes(node))
    const similarity = sharedNodes.length / Math.max(nodesUsed.length, templateNodes.length)
    
    return {
      id: template.id,
      title: template.title,
      similarity
    }
  }).filter(template => template.similarity > 0.7) || []

  return {
    isDuplicate: false,
    similarTemplates
  }
}

/**
 * Developer method: Upload template directly (published status)
 */
export async function uploadTemplateDeveloper(templateData: TemplateUploadData) {
  const { workflow_json, title, description, source, source_url, categories, use_case } = templateData
  
  // Extract workflow metadata
  const { nodeCount, nodesUsed, hasTriggers, hasAiNodes } = extractWorkflowMetadata(workflow_json)
  
  // Generate workflow hash
  const workflowHash = generateWorkflowHash(workflow_json)
  
  // Check for duplicates
  const duplicateCheck = await checkForDuplicates(workflowHash, title, nodeCount, nodesUsed)
  
  if (duplicateCheck.isDuplicate) {
    throw new Error(`Template already exists: ${duplicateCheck.exactMatch?.title}`)
  }
  
  // Prepare template object
  const template = {
    title,
    description,
    workflow_json,
    node_count: nodeCount,
    nodes_used: nodesUsed,
    source: source || 'Developer Upload',
    source_url: source_url || null,
    source_path: null,
    categories: categories || [],
    use_case: use_case || 'general_automation',
    complexity_level: determineComplexity(nodeCount, nodesUsed),
    automation_pattern: null,
    has_triggers: hasTriggers,
    has_ai_nodes: hasAiNodes,
    workflow_hash: workflowHash,
    ai_title: null,
    ai_description: null,
    ai_use_cases: [],
    ai_how_works: [],
    ai_setup_steps: [],
    ai_apps_used: [],
    ai_categories: null,
    ai_roles: [],
    ai_industries: [],
    ai_tags: [],
    popularity_score: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    extracted_at: new Date().toISOString()
  }
  
  // Insert into database
  const { data, error } = await supabase
    .from('templates')
    .insert([template])
    .select()
    .single()
  
  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }
  
  return {
    success: true,
    templateId: data.id,
    similarTemplates: duplicateCheck.similarTemplates,
    message: 'Template uploaded successfully and is now live!'
  }
}

/**
 * Public method: Submit template for review
 */
export async function submitTemplateForReview(templateData: TemplateUploadData) {
  const { workflow_json, title, description, contributor_email, contributor_name, contributor_contact, contributor_website } = templateData
  
  // Validate required fields
  if (!title || !description || !workflow_json) {
    throw new Error('Title, description, and workflow JSON are required')
  }
  
  // Extract workflow metadata
  const { nodeCount, nodesUsed, hasTriggers, hasAiNodes } = extractWorkflowMetadata(workflow_json)
  
  // Generate workflow hash
  const workflowHash = generateWorkflowHash(workflow_json)
  
  // Check for duplicates
  const duplicateCheck = await checkForDuplicates(workflowHash, title, nodeCount, nodesUsed)
  
  if (duplicateCheck.isDuplicate) {
    throw new Error(`Template already exists: ${duplicateCheck.exactMatch?.title}`)
  }
  
  // Prepare template object for review
  const template = {
    title,
    description,
    workflow_json,
    node_count: nodeCount,
    nodes_used: nodesUsed,
    source: 'Community Contribution',
    source_url: null,
    source_path: null,
    categories: [],
    use_case: 'general_automation',
    complexity_level: determineComplexity(nodeCount, nodesUsed),
    automation_pattern: null,
    has_triggers: hasTriggers,
    has_ai_nodes: hasAiNodes,
    workflow_hash: workflowHash,
    ai_title: null,
    ai_description: null,
    ai_use_cases: [],
    ai_how_works: [],
    ai_setup_steps: [],
    ai_apps_used: [],
    ai_categories: null,
    ai_roles: [],
    ai_industries: [],
    ai_tags: [],
    popularity_score: 0,
    contributor_email,
    contributor_name,
    contributor_contact,
    contributor_website,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    extracted_at: new Date().toISOString()
  }
  
  // Insert into database
  const { data, error } = await supabase
    .from('templates')
    .insert([template])
    .select()
    .single()
  
  if (error) {
    throw new Error(`Database error: ${error.message}`)
  }
  
  return {
    success: true,
    templateId: data.id,
    similarTemplates: duplicateCheck.similarTemplates,
    message: 'Template submitted successfully! It will be reviewed before being published.'
  }
}

/**
 * Get pending templates for admin review
 */
export async function getPendingTemplates() {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .or('status.eq.pending_review,status.is.null')
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to fetch pending templates: ${error.message}`)
  }
  
  return data
}

/**
 * Approve template (admin function)
 */
export async function approveTemplate(templateId: string) {
  const { data, error } = await supabase
    .from('templates')
    .update({ 
      updated_at: new Date().toISOString()
    })
    .eq('id', templateId)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to approve template: ${error.message}`)
  }
  
  return data
}

/**
 * Reject template (admin function)
 */
export async function rejectTemplate(templateId: string) {
  const { data, error } = await supabase
    .from('templates')
    .delete()
    .eq('id', templateId)
  
  if (error) {
    throw new Error(`Failed to reject template: ${error.message}`)
  }
  
  return data
}
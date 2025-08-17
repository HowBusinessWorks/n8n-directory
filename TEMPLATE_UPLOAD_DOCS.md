# n8n JSON - Template Upload & Duplicate Detection System

## 📖 Overview

This document explains the template upload system for n8n JSON, including duplicate detection logic, upload methods, and contribution workflows.

## 🔍 Duplicate Detection Strategy

### Core Concept
The system uses a **two-tier detection approach** to prevent duplicate templates while allowing legitimate variations.

### Tier 1: Exact Duplicate Detection (Workflow Hash)

**How it works:**
```typescript
// 1. Generate workflow hash from JSON content
const workflowString = JSON.stringify(parsedWorkflow, Object.keys(parsedWorkflow).sort())
const workflowHash = crypto.createHash('md5').update(workflowString).digest('hex')

// 2. Check database for existing hash
const duplicate = await supabase
  .from('templates')
  .select('id, title')
  .eq('workflow_hash', workflowHash)
  .single()
```

**When it triggers:**
- Exact same workflow JSON (even with different titles/descriptions)
- Copy-paste submissions
- Re-uploads of existing templates

**Result:** Template submission is **BLOCKED**

**Example:**
```
Template A: "Send Gmail Email" 
Template B: "Gmail Email Sender"
↳ Same workflow_hash → DUPLICATE DETECTED → BLOCKED
```

### Tier 2: Similarity Detection (Fuzzy Matching)

**How it works:**
```typescript
// 1. Find templates with similar characteristics
const candidates = await supabase
  .from('templates')
  .select('id, title, node_count, nodes_used')
  .ilike('title', `%${titleKeywords}%`)  // Similar title words
  .eq('node_count', nodeCount)           // Same node count

// 2. Calculate node overlap percentage
const sharedNodes = nodesUsed.filter(node => existingNodes.includes(node))
const similarity = sharedNodes.length / Math.max(nodesUsed.length, existingNodes.length)

// 3. Flag if similarity > 70%
if (similarity > 0.7) {
  return { warning: "Similar templates found", canProceed: true }
}
```

**When it triggers:**
- 70%+ node overlap
- Similar titles with same node count
- Potential variations of existing templates

**Result:** Template submission gets **WARNING** but can proceed

**Example:**
```
Template A: "Slack Notification" - [slack, webhook, http] (3 nodes)
Template B: "Slack Alert System" - [slack, webhook, delay, http] (4 nodes)
↳ 75% node overlap → SIMILAR DETECTED → WARN + ALLOW
```

### Detection Responses

#### 1. Exact Duplicate (409 Conflict)
```json
{
  "error": "Template already exists",
  "duplicate": {
    "id": "abc123",
    "title": "Existing Template Name"
  }
}
```

#### 2. Similar Template (200 Warning)
```json
{
  "warning": "Similar templates found",
  "similar": [
    {"id": "def456", "title": "Similar Template 1"},
    {"id": "ghi789", "title": "Similar Template 2"}
  ],
  "canProceed": true
}
```

#### 3. Unique Template (201 Created)
```json
{
  "message": "Template submitted successfully!",
  "templateId": "jkl012"
}
```

## 🚀 Template Upload Methods

### Method 1: Developer Upload (Direct Database)

**Use case:** Bulk imports, verified templates, admin additions

**Process:**
1. Prepare template data with all required fields
2. Generate workflow hash
3. Run duplicate detection
4. Insert directly into Supabase
5. Set status as 'published'

**Required fields:**
```typescript
{
  title: string,
  description: string,
  workflow_json: object,
  node_count: number,
  nodes_used: string[],
  workflow_hash: string,
  complexity_level: 'simple' | 'medium' | 'complex',
  source: string,
  has_triggers: boolean,
  has_ai_nodes: boolean,
  status: 'published'
}
```

### Method 2: Public Contribution (API + Review)

**Use case:** Community submissions, user contributions

**Process:**
1. User submits via Tally form → API endpoint
2. Validate and extract workflow metadata
3. Run duplicate detection
4. Set status as 'pending_review'
5. Admin review and approval
6. Publish approved templates

**Submission flow:**
```
Tally Form → API Endpoint → Duplicate Check → Database (pending) → Admin Review → Published
```

## 🛠 Implementation Details

### Database Schema (Supabase)

**Key fields for duplicate detection:**
- `workflow_hash` (string): MD5 hash of workflow JSON
- `node_count` (integer): Number of nodes in workflow
- `nodes_used` (string[]): Array of node types used
- `title` (string): Template title for similarity matching
- `status` (string): 'pending_review', 'published', 'rejected'

### Workflow Hash Generation

```typescript
function generateWorkflowHash(workflowJson: object): string {
  // Sort keys to ensure consistent hashing
  const sortedWorkflow = JSON.stringify(workflowJson, Object.keys(workflowJson).sort())
  return crypto.createHash('md5').update(sortedWorkflow).digest('hex')
}
```

### Complexity Determination

```typescript
function determineComplexity(nodeCount: number, nodesUsed: string[]): string {
  const complexNodes = nodesUsed.filter(node => 
    node.includes('code') || 
    node.includes('function') || 
    node.includes('ai') || 
    node.includes('webhook')
  ).length

  if (nodeCount <= 3 && complexNodes === 0) return 'simple'
  if (nodeCount <= 8 && complexNodes <= 2) return 'medium'
  return 'complex'
}
```

## 📊 API Endpoints

### POST /api/templates/submit
**Purpose:** Public template submission
**Input:** Form data from Tally
**Output:** Submission confirmation or duplicate warning

### POST /api/templates/upload (Developer)
**Purpose:** Direct template upload for developers
**Input:** Complete template data
**Output:** Immediate publish confirmation

### GET /api/templates/pending (Admin)
**Purpose:** Get templates awaiting review
**Output:** List of pending templates

## 🔄 Contribution Workflow

### Public Contributors
1. Click "Contribute Template" button
2. Redirected to Tally form
3. Fill out template details + upload workflow JSON
4. Form submits to `/api/templates/submit`
5. Receive confirmation email
6. Admin reviews and approves
7. Template goes live

### Developers
1. Use direct database insertion script
2. Run duplicate detection manually
3. Set status as 'published'
4. Template immediately available

## 🚨 Edge Cases & Considerations

### False Positives
- **Similar node usage but different purposes**: Allow with warning
- **Template variations (v1, v2)**: Check title patterns

### False Negatives
- **Renamed nodes**: Update node mapping as n8n evolves
- **Workflow restructuring**: Hash won't catch these (by design)

### Performance
- **Hash lookup**: O(1) database query
- **Similarity check**: O(n) where n = templates with same node count
- **Optimization**: Index on workflow_hash, node_count, title

## 📝 Maintenance Tasks

### Regular Cleanup
- Review pending templates monthly
- Update node type mappings
- Monitor similarity threshold effectiveness

### Database Optimization
- Index workflow_hash for fast lookups
- Partition by created_at for performance
- Archive rejected templates after 6 months

## 🔒 Security Considerations

### Input Validation
- Sanitize all form inputs
- Validate JSON structure
- Limit file upload sizes

### Rate Limiting
- Max 5 submissions per IP per hour
- Email verification for contributors
- Admin approval for all public submissions

---

## 📞 Support

For technical questions about the upload system, contact the development team or refer to the source code in `/app/api/templates/`.
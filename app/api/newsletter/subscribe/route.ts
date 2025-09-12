import { NextResponse } from 'next/server'

// Add CORS headers for better browser compatibility
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: corsHeaders })
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400, headers: corsHeaders }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400, headers: corsHeaders }
      )
    }

    const apiKey = process.env.BEEHIIV_API_KEY
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv API credentials')
      return NextResponse.json(
        { error: 'Newsletter service is temporarily unavailable' },
        { status: 500, headers: corsHeaders }
      )
    }

    // Subscribe to Beehiiv newsletter
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'n8n-json',
        utm_medium: 'website',
        utm_campaign: 'newsletter-signup'
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Beehiiv API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        email: email,
        url: response.url
      })
      
      if (response.status === 400) {
        // Check if it's a duplicate subscription - Beehiiv may return different error messages
        const errorLower = errorData.toLowerCase()
        if (errorLower.includes('already subscribed') || 
            errorLower.includes('duplicate') || 
            errorLower.includes('already exists') ||
            errorLower.includes('email already') ||
            errorLower.includes('subscription exists')) {
          return NextResponse.json(
            { error: 'This email is already subscribed to our newsletter! Check your inbox for previous emails.' },
            { status: 409, headers: corsHeaders }
          )
        }
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400, headers: corsHeaders }
        )
      }
      
      // Handle 409 Conflict status (common for duplicates)
      if (response.status === 409) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter! Check your inbox for previous emails.' },
          { status: 409, headers: corsHeaders }
        )
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Newsletter service authentication failed' },
          { status: 500, headers: corsHeaders }
        )
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500, headers: corsHeaders }
      )
    }

    const data = await response.json()
    
    // Process successful Beehiiv response
    
    // Check if this is a duplicate subscription
    // Beehiiv with reactivate_existing: true will return success for duplicates
    // We need to detect duplicates by checking if the subscription was created recently
    if (data && data.subscription && data.subscription.data) {
      const subscriptionData = data.subscription.data
      const createdTimestamp = subscriptionData.created
      const currentTimestamp = Math.floor(Date.now() / 1000)
      const timeDifference = currentTimestamp - createdTimestamp
      const subscriptionStatus = subscriptionData.status
      
      // Only treat as duplicate if subscription is valid/active and was created more than 1 minute ago
      // Allow invalid subscriptions to be resubmitted
      if (timeDifference > 60 && subscriptionStatus !== 'invalid') { // 60 seconds threshold
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter! Check your inbox for previous emails.' },
          { status: 409, headers: corsHeaders }
        )
      }
      
      // Handle invalid subscriptions specially
      if (subscriptionStatus === 'invalid') {
        return NextResponse.json(
          { error: 'This email address appears to be invalid or unreachable. Please check the email address and try again.' },
          { status: 400, headers: corsHeaders }
        )
      }
    }
    
    // Also check for other possible indicators
    if (data && (
      data.message?.toLowerCase().includes('already') ||
      data.message?.toLowerCase().includes('reactivated') ||
      data.status?.toLowerCase().includes('existing') ||
      data.subscription_status === 'existing' ||
      data.subscription_status === 'reactivated' ||
      data.reactivated === true
    )) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter! Check your inbox for previous emails.' },
        { status: 409, headers: corsHeaders }
      )
    }
    
    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        subscription: data
      },
      { status: 200, headers: corsHeaders }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500, headers: corsHeaders }
    )
  }
}
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    const apiKey = process.env.BEEHIIV_API_KEY
    const publicationId = process.env.BEEHIIV_PUBLICATION_ID

    if (!apiKey || !publicationId) {
      console.error('Missing Beehiiv API credentials')
      return NextResponse.json(
        { error: 'Newsletter service is temporarily unavailable' },
        { status: 500 }
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
        reactivate_existing: false,
        send_welcome_email: true,
        utm_source: 'n8n-json',
        utm_medium: 'website',
        utm_campaign: 'newsletter-signup'
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Beehiiv API error:', response.status, errorData)
      
      if (response.status === 400) {
        // Check if it's a duplicate subscription
        if (errorData.includes('already subscribed') || errorData.includes('duplicate')) {
          return NextResponse.json(
            { error: 'This email is already subscribed to our newsletter' },
            { status: 409 }
          )
        }
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        )
      }
      
      if (response.status === 401) {
        return NextResponse.json(
          { error: 'Newsletter service authentication failed' },
          { status: 500 }
        )
      }

      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again later.' },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      { 
        message: 'Successfully subscribed to newsletter!',
        subscription: data
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again later.' },
      { status: 500 }
    )
  }
}
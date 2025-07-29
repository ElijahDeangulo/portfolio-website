import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Initialize Resend with API key from environment variable
// Only initialize if API key exists (for build time)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function POST(request: NextRequest) {
  // Check for required environment variables
  if (!process.env.RESEND_API_KEY || !resend) {
    console.error('RESEND_API_KEY is not configured')
    return NextResponse.json(
      { error: 'Email service is not configured. Please contact the administrator.' },
      { status: 500 }
    )
  }

  if (!process.env.CONTACT_EMAIL) {
    console.error('CONTACT_EMAIL is not configured')
    return NextResponse.json(
      { error: 'Contact email is not configured. Please contact the administrator.' },
      { status: 500 }
    )
  }

  try {
    const { name, email, message } = await request.json()

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (!email.includes('@')) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const data = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL!,
      subject: `New Portfolio Contact from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007acc; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">From:</h3>
            <p style="margin: 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">
              <strong>${name}</strong> (${email})
            </p>
          </div>
          
          <div style="margin: 20px 0;">
            <h3 style="color: #555; margin-bottom: 5px;">Message:</h3>
            <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #007acc; border-radius: 5px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This message was sent from your portfolio contact form at ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
    })

    return NextResponse.json(
      { message: 'Email sent successfully', data },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    )
  }
} 
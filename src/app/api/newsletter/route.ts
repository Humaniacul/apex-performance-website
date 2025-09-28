import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Validation schema for newsletter signup
const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type NewsletterData = z.infer<typeof newsletterSchema>;

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
  return `newsletter:${ip}`;
}

function isRateLimited(key: string, maxRequests: number = 3, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitStore.get(key);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= maxRequests) {
    return true;
  }

  record.count++;
  return false;
}

// Supabase integration
async function saveToSupabase(email: string) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase configuration missing');
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // First, check if email already exists
  const checkResponse = await fetch(
    `${supabaseUrl}/rest/v1/newsletter_subscribers?email=eq.${encodeURIComponent(email)}&select=email`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
      },
    }
  );

  if (checkResponse.ok) {
    const existing = await checkResponse.json();
    if (existing.length > 0) {
      throw new Error('Email already subscribed');
    }
  }

  // Insert new subscriber
  const response = await fetch(`${supabaseUrl}/rest/v1/newsletter_subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
      'apikey': supabaseKey,
      'Prefer': 'return=minimal',
    },
    body: JSON.stringify({
      email: email,
      subscribed_at: new Date().toISOString(),
      status: 'active',
      source: 'website-footer',
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Supabase error: ${response.status} - ${errorText}`);
  }
}

// Email service integration (example with SendGrid)
async function addToEmailService(email: string) {
  // Example with SendGrid (commented out - requires setup)
  /*
  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch('https://api.sendgrid.com/v3/marketing/contacts', {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contacts: [{
          email: email,
          custom_fields: {
            source: 'apex-performance-website',
            signup_date: new Date().toISOString(),
          }
        }]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`SendGrid error: ${response.status} - ${errorText}`);
    }
  }
  */
  
  // Mailchimp example (commented out - requires setup)
  /*
  if (process.env.MAILCHIMP_API_KEY && process.env.MAILCHIMP_AUDIENCE_ID) {
    const server = process.env.MAILCHIMP_API_KEY.split('-')[1];
    const response = await fetch(
      `https://${server}.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_AUDIENCE_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['apex-performance', 'website-signup'],
          merge_fields: {
            SOURCE: 'Website Footer',
            SIGNUP_DATE: new Date().toLocaleDateString(),
          }
        }),
      }
    );

    if (!response.ok && response.status !== 400) { // 400 might be duplicate
      const errorData = await response.json();
      throw new Error(`Mailchimp error: ${errorData.title}`);
    }
  }
  */

  console.log('Email service integration would add:', email);
}

// Send welcome email
async function sendWelcomeEmail(email: string) {
  // Example welcome email (commented out - requires email service setup)
  /*
  if (process.env.SENDGRID_API_KEY) {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email,
      from: process.env.EMAIL_FROM || 'noreply@apex-performance.com',
      subject: 'Welcome to Apex Performance',
      templateId: 'welcome-template-id', // Use SendGrid template
      dynamic_template_data: {
        email: email,
        company: 'Apex Performance',
        website_url: process.env.NEXT_PUBLIC_SITE_URL || 'https://apex-performance.com',
      },
    };

    await sgMail.send(msg);
  }
  */
  console.log('Welcome email would be sent to:', email);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitKey = getRateLimitKey(request);
    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const { email } = newsletterSchema.parse(body);

    // Basic email domain validation
    const disposableEmailDomains = [
      '10minutemail.com',
      'tempmail.org',
      'guerrillamail.com',
      'mailinator.com',
    ];
    
    const emailDomain = email.split('@')[1];
    if (disposableEmailDomains.includes(emailDomain)) {
      return NextResponse.json(
        { error: 'Please use a permanent email address' },
        { status: 400 }
      );
    }

    // Save to Supabase
    try {
      await saveToSupabase(email);
    } catch (supabaseError) {
      console.error('Supabase save failed:', supabaseError);
      
      // Check if it's a duplicate email error
      if (supabaseError instanceof Error && supabaseError.message.includes('already subscribed')) {
        return NextResponse.json(
          { error: 'This email is already subscribed to our newsletter' },
          { status: 409 }
        );
      }
      
      // Continue with email service even if Supabase fails
    }

    // Add to email marketing service
    try {
      await addToEmailService(email);
    } catch (emailServiceError) {
      console.error('Email service failed:', emailServiceError);
      // Don't fail the request if email service fails
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(email);
    } catch (welcomeEmailError) {
      console.error('Welcome email failed:', welcomeEmailError);
      // Don't fail the request if welcome email fails
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Successfully subscribed! Welcome to Apex Performance.' 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Newsletter signup error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid email address', 
          details: error.errors.map(e => e.message) 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

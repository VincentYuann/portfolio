// Supabase Edge Function: send-contact-email
// Handles secure portfolio contact form submissions via Resend API
// Protects against abuse via Honeypot trap and IP-based rate limiting

import { createClient } from 'npm:@supabase/supabase-js@2';

interface ContactRequestBody {
  name?: string;
  email?: string;
  topic?: string;
  message?: string;
  honeypot?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Escapes special HTML characters to prevent XSS / HTML injection in webmail clients
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Strips carriage returns and newlines to prevent email header / CRLF injection
function sanitizeHeader(text: string): string {
  return text.replace(/[\r\n\t]/g, ' ').trim();
}

/**
 * Checks and updates rate limits using the contact_rate_limits table in Supabase.
 * Enforces a maximum of 5 contact submissions per 1-hour window per client IP.
 * Fails open (allows request) if DB check encounters an unexpected error.
 */
async function checkRateLimit(clientIp: string): Promise<{ allowed: boolean; retryAfterMinutes?: number }> {
  if (!clientIp || clientIp === 'unknown' || clientIp === 'localhost' || clientIp === '127.0.0.1') {
    return { allowed: true };
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return { allowed: true };
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
  const now = new Date();
  const WINDOW_MS = 60 * 60 * 1000; // 1-hour sliding window
  const MAX_REQUESTS = 5; // Max 5 messages per hour per IP

  try {
    const { data, error } = await supabaseAdmin
      .from('contact_rate_limits')
      .select('*')
      .eq('ip', clientIp)
      .maybeSingle();

    if (error) {
      console.warn('Rate limit query warning (bypassing):', error);
      return { allowed: true };
    }

    if (!data) {
      // First request from this IP
      await supabaseAdmin.from('contact_rate_limits').insert({
        ip: clientIp,
        count: 1,
        window_start: now.toISOString(),
        last_request: now.toISOString(),
      });
      return { allowed: true };
    }

    const windowStart = new Date(data.window_start).getTime();
    const elapsed = now.getTime() - windowStart;

    if (elapsed > WINDOW_MS) {
      // Window expired; reset window and count
      await supabaseAdmin
        .from('contact_rate_limits')
        .update({
          count: 1,
          window_start: now.toISOString(),
          last_request: now.toISOString(),
        })
        .eq('ip', clientIp);
      return { allowed: true };
    }

    if (data.count >= MAX_REQUESTS) {
      const remainingMs = WINDOW_MS - elapsed;
      const retryAfterMinutes = Math.max(1, Math.ceil(remainingMs / 60000));
      return { allowed: false, retryAfterMinutes };
    }

    // Increment count
    await supabaseAdmin
      .from('contact_rate_limits')
      .update({
        count: data.count + 1,
        last_request: now.toISOString(),
      })
      .eq('ip', clientIp);

    return { allowed: true };
  } catch (err) {
    console.warn('Rate limit check encountered error (bypassing gracefully):', err);
    return { allowed: true };
  }
}

Deno.serve(async (req: Request) => {
  // 1. Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method Not Allowed' }),
      {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('RESEND_API_KEY secret is not set in Supabase');
      return new Response(
        JSON.stringify({
          error: 'Email service configuration missing. Please ensure RESEND_API_KEY is configured in Supabase Secrets.',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const body: ContactRequestBody = await req.json().catch(() => ({}));
    const { name, email, topic, message, honeypot } = body;

    // 2. Bot mitigation: Honeypot check
    // If the hidden honeypot field is filled, silently succeed without sending
    if (honeypot && honeypot.trim().length > 0) {
      console.warn('Bot detected via honeypot trap. Silently discarding.');
      return new Response(
        JSON.stringify({ success: true, message: 'Message sent successfully.' }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Strict Payload Validation
    const trimmedName = (name || '').trim();
    const trimmedEmail = (email || '').trim();
    const trimmedMessage = (message || '').trim();
    const rawTopic = (topic || 'General Inquiry').trim();

    if (!trimmedName || trimmedName.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid name (1-100 characters).' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!trimmedEmail || !emailRegex.test(trimmedEmail) || trimmedEmail.length > 255) {
      return new Response(
        JSON.stringify({ error: 'Please provide a valid email address.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!trimmedMessage || trimmedMessage.length > 5000) {
      return new Response(
        JSON.stringify({ error: 'Message must be between 1 and 5000 characters.' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 4. IP-Based Rate Limiting Check
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      req.headers.get('cf-connecting-ip') ||
      req.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = await checkRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({
          error: `Transmission rate limit reached (5 messages/hour). Please try again in ${rateLimit.retryAfterMinutes || 15} minutes.`,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // 5. Sanitize inputs
    const cleanName = sanitizeHeader(trimmedName);
    const cleanTopic = sanitizeHeader(rawTopic.slice(0, 100));
    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(trimmedEmail);
    const safeTopic = escapeHtml(cleanTopic);
    const safeMessage = escapeHtml(trimmedMessage).replace(/\n/g, '<br />');

    const formattedTime = new Date().toUTCString();

    // 6. Construct HTML and Text Email Templates
    const emailSubject = `[Portfolio] ${cleanTopic} from ${cleanName}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 24px; background-color: #f7f6f2; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5dc; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #1f2024; color: #edeae4; padding: 24px; border-bottom: 2px solid #d97706; }
    .header h1 { margin: 0; font-size: 18px; font-weight: 600; letter-spacing: 0.05em; }
    .header p { margin: 4px 0 0 0; font-size: 12px; color: #9ca3af; }
    .content { padding: 24px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
    .meta-table td { padding: 8px 0; border-bottom: 1px solid #f0f0eb; }
    .meta-label { width: 90px; color: #71717a; font-weight: 500; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
    .meta-value { color: #18181b; font-weight: 500; }
    .message-box { background: #fafaf9; border-left: 3px solid #d97706; padding: 16px; border-radius: 4px; font-size: 14px; color: #27272a; line-height: 1.7; word-break: break-word; }
    .footer { padding: 16px 24px; background: #fdfdfc; border-top: 1px solid #f0f0eb; font-size: 12px; color: #a1a1aa; text-align: center; }
    .reply-badge { display: inline-block; margin-top: 16px; background: #ea580c; color: #ffffff !important; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-size: 13px; font-weight: 500; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>New Portfolio Inquiry</h1>
      <p>Received via Vincent Yuan's Portfolio Website</p>
    </div>
    <div class="content">
      <table class="meta-table">
        <tr>
          <td class="meta-label">From:</td>
          <td class="meta-value">${safeName} &lt;<a href="mailto:${safeEmail}">${safeEmail}</a>&gt;</td>
        </tr>
        <tr>
          <td class="meta-label">Topic:</td>
          <td class="meta-value">${safeTopic}</td>
        </tr>
        <tr>
          <td class="meta-label">Date:</td>
          <td class="meta-value">${formattedTime}</td>
        </tr>
        <tr>
          <td class="meta-label">IP:</td>
          <td class="meta-value" style="font-family: monospace; font-size: 12px; color: #71717a;">${escapeHtml(clientIp)}</td>
        </tr>
      </table>

      <div style="margin-top: 12px; margin-bottom: 6px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #71717a;">
        Message Content:
      </div>
      <div class="message-box">
        ${safeMessage}
      </div>

      <div style="text-align: center; margin-top: 24px;">
        <a href="mailto:${safeEmail}?subject=Re:%20${encodeURIComponent(cleanTopic)}" class="reply-badge">
          Reply Directly to ${safeName}
        </a>
      </div>
    </div>
    <div class="footer">
      This transmission was delivered securely via Supabase Edge Runtime &amp; Resend.<br/>
      Hitting "Reply" in your email client will reply directly to <strong>${safeEmail}</strong>.
    </div>
  </div>
</body>
</html>
`;

    const emailText = `New Inquiry from Vincent Yuan's Portfolio

Sender: ${cleanName} (${trimmedEmail})
Topic: ${cleanTopic}
Time: ${formattedTime}
IP: ${clientIp}

Message:
--------------------------------------------------
${trimmedMessage}
--------------------------------------------------

Reply directly to this email to respond to ${cleanName} (${trimmedEmail}).
`;

    // 7. Send email via Resend REST API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: ['vincentyuan1020@gmail.com'],
        reply_to: trimmedEmail,
        subject: emailSubject,
        html: emailHtml,
        text: emailText,
      }),
    });

    const resendResult = await resendResponse.json().catch(() => ({}));

    if (!resendResponse.ok) {
      console.error('Resend API error:', resendResult);
      return new Response(
        JSON.stringify({
          error: resendResult?.message || 'Failed to dispatch email via Resend.',
        }),
        {
          status: resendResponse.status || 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        id: resendResult?.id,
        message: 'Message delivered directly to Vincent\'s inbox.',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Unexpected server error in send-contact-email function:', err);
    return new Response(
      JSON.stringify({ error: message || 'Internal server error occurred.' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

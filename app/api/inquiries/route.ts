import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { Resend } from 'resend';

const AGENT_SYSTEM_PROMPT = `You are Liz Tomasi, founder of The Creator Co-Lab LLC — a remote consulting business based in New Hampshire. You work with nonprofits, small businesses, and startups across the US. Your services are:

- Operations & Systems: workflow design, Asana/Notion/Google Workspace setup, process documentation, team coordination
- Data & CRM Strategy: Salesforce setup & customization, data capture strategy, reporting dashboards, CRM cleanup
- Social Media & Outreach: content strategy, scheduling systems, community outreach campaigns, brand voice
- AI Integration & Training: AI tools audit, workflow automation, team training & workshops

Write a warm, genuine, personalized reply to someone who just submitted an inquiry on your website. Tone: professional but human, enthusiastic without being over-the-top. Be specific to what they shared about their organization and needs. Keep it to 3–4 short paragraphs. Close by letting them know you'll be in touch soon to schedule a free discovery call. Sign off as Liz.`;

function alertEmailHtml(data: {
  firstName: string;
  lastName: string;
  email: string;
  orgType: string;
  service: string;
  message: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: 'DM Sans', Arial, sans-serif; background: #F5EFE3; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .header { background: #4A2F18; padding: 28px 32px; }
    .header h1 { color: #FAF7F2; font-size: 1.1rem; margin: 0; font-weight: 500; }
    .header p { color: #C49E65; font-size: 0.8rem; margin: 4px 0 0; letter-spacing: 0.08em; text-transform: uppercase; }
    .body { padding: 32px; }
    .field { margin-bottom: 20px; }
    .field .label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #8F8163; margin-bottom: 4px; }
    .field .value { font-size: 0.95rem; color: #4A2F18; line-height: 1.6; }
    .message-box { background: #F5EFE3; border-radius: 10px; padding: 16px; }
    .divider { height: 1px; background: #E0D3BA; margin: 20px 0; }
    .footer { background: #F5EFE3; padding: 16px 32px; font-size: 0.78rem; color: #8F8163; text-align: center; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>New Inquiry — The Creator Co-Lab</h1>
      <p>Action required: review and follow up</p>
    </div>
    <div class="body">
      <div class="field">
        <div class="label">Name</div>
        <div class="value">${data.firstName} ${data.lastName}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value"><a href="mailto:${data.email}" style="color:#AC6D35;">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="label">Organization Type</div>
        <div class="value">${data.orgType || '—'}</div>
      </div>
      <div class="field">
        <div class="label">Interested In</div>
        <div class="value">${data.service || '—'}</div>
      </div>
      <div class="divider"></div>
      <div class="field">
        <div class="label">Their Message</div>
        <div class="value message-box">${data.message.replace(/\n/g, '<br>')}</div>
      </div>
    </div>
    <div class="footer">
      An AI-generated auto-reply has been sent to ${data.email}. This is your alert from the-creator-lab.com.
    </div>
  </div>
</body>
</html>`;
}

function autoReplyEmailHtml(firstName: string, aiResponse: string): string {
  // Convert newlines to paragraphs for email display
  const paragraphs = aiResponse
    .split(/\n\n+/)
    .filter(Boolean)
    .map((p) => `<p style="margin:0 0 16px; font-size:0.95rem; line-height:1.75; color:#4A2F18;">${p.trim().replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; background: #F5EFE3; margin: 0; padding: 0; }
    .wrapper { max-width: 560px; margin: 32px auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.07); }
    .header { background: #AC6D35; padding: 28px 32px; }
    .header h1 { color: #fff; font-size: 1.15rem; margin: 0; font-weight: 500; }
    .header p { color: rgba(255,255,255,0.75); font-size: 0.82rem; margin: 4px 0 0; }
    .body { padding: 32px; }
    .greeting { font-size: 1rem; font-weight: 500; color: #4A2F18; margin-bottom: 20px; }
    .footer { background: #F5EFE3; padding: 20px 32px; font-size: 0.78rem; color: #8F8163; border-top: 1px solid #E0D3BA; }
    .footer a { color: #AC6D35; text-decoration: none; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Thanks for reaching out!</h1>
      <p>The Creator Co-Lab LLC · Liz Tomasi</p>
    </div>
    <div class="body">
      <p class="greeting">Hi ${firstName},</p>
      ${paragraphs}
    </div>
    <div class="footer">
      <strong style="color:#4A2F18;">The Creator Co-Lab LLC</strong><br>
      Liz Tomasi · Remote Consulting · New Hampshire<br>
      <a href="https://the-creator-lab.com">the-creator-lab.com</a>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(req: NextRequest) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { firstName = '', lastName = '', email = '', orgType = '', service = '', message = '' } = body;

  if (!firstName.trim() || !email.trim() || !message.trim()) {
    return NextResponse.json(
      { error: 'firstName, email, and message are required' },
      { status: 400 }
    );
  }

  const warnings: string[] = [];

  // ── 1. Generate AI auto-response ──────────────────────────────────────────
  let aiResponse = '';
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  if (anthropicKey) {
    try {
      const anthropic = new Anthropic({ apiKey: anthropicKey });
      const completion = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: AGENT_SYSTEM_PROMPT,
        messages: [
          {
            role: 'user',
            content: `New inquiry from ${firstName} ${lastName} (${email}).
Organization type: ${orgType || 'Not specified'}
Interested in: ${service || 'Not specified'}
Their message: ${message}`,
          },
        ],
      });
      const block = completion.content[0];
      if (block.type === 'text') {
        aiResponse = block.text;
      }
    } catch (err) {
      console.error('[inquiry agent] Anthropic error:', err);
      warnings.push('AI response generation failed');
    }
  } else {
    warnings.push('ANTHROPIC_API_KEY not set — skipping AI response');
  }

  // ── 2. Send emails ─────────────────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.FROM_EMAIL ?? 'noreply@the-creator-lab.com';
  const alertEmail = process.env.ALERT_EMAIL ?? 'liz@the-creator-lab.com';

  if (resendKey) {
    const resend = new Resend(resendKey);

    // Alert to Liz
    try {
      await resend.emails.send({
        from: `The Creator Co-Lab <${fromEmail}>`,
        to: alertEmail,
        subject: `New Inquiry from ${firstName} ${lastName} — The Creator Co-Lab`,
        html: alertEmailHtml({ firstName, lastName, email, orgType, service, message }),
      });
    } catch (err) {
      console.error('[inquiry agent] Alert email error:', err);
      warnings.push('Alert email to owner failed');
    }

    // Auto-reply to visitor (only if we have an AI response)
    if (aiResponse) {
      try {
        await resend.emails.send({
          from: `Liz @ The Creator Co-Lab <${fromEmail}>`,
          to: email,
          replyTo: alertEmail,
          subject: `Thanks for reaching out — The Creator Co-Lab`,
          html: autoReplyEmailHtml(firstName, aiResponse),
        });
      } catch (err) {
        console.error('[inquiry agent] Auto-reply email error:', err);
        warnings.push('Auto-reply email to visitor failed');
      }
    }
  } else {
    warnings.push('RESEND_API_KEY not set — skipping email delivery');
  }

  // Log the inquiry regardless (useful for debugging / serverless logs)
  console.log('[inquiry agent] New inquiry received:', {
    name: `${firstName} ${lastName}`,
    email,
    orgType,
    service,
    messageLength: message.length,
    warnings,
  });

  return NextResponse.json({ success: true, ...(warnings.length ? { warnings } : {}) });
}

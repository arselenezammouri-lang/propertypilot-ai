import { getBaseUrl } from '@/lib/env';

const APP_URL = getBaseUrl();

/**
 * Shared email wrapper — clean, white, professional
 */
function emailLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin:0; padding:0; background:#f4f4f5; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; }
    .container { max-width:560px; margin:0 auto; background:#ffffff; border-radius:12px; overflow:hidden; border:1px solid #e4e4e7; }
    .header { padding:32px 32px 24px; border-bottom:1px solid #f4f4f5; }
    .header-logo { font-size:16px; font-weight:700; color:#09090b; text-decoration:none; }
    .body { padding:32px; }
    .footer { padding:24px 32px; background:#fafafa; border-top:1px solid #f4f4f5; text-align:center; }
    .footer p { margin:0; color:#a1a1aa; font-size:12px; line-height:1.5; }
    h1 { margin:0 0 8px; font-size:22px; font-weight:700; color:#09090b; line-height:1.3; }
    h2 { margin:0 0 8px; font-size:18px; font-weight:600; color:#09090b; line-height:1.3; }
    p { margin:0 0 16px; font-size:15px; color:#52525b; line-height:1.6; }
    .btn { display:inline-block; background:#09090b; color:#ffffff !important; text-decoration:none; padding:12px 24px; border-radius:8px; font-weight:600; font-size:14px; }
    .btn:hover { background:#27272a; }
    .card { background:#fafafa; border:1px solid #e4e4e7; border-radius:8px; padding:20px; margin:0 0 20px; }
    .card h3 { margin:0 0 12px; font-size:15px; font-weight:600; color:#09090b; }
    .card ul { margin:0; padding:0 0 0 18px; }
    .card li { font-size:14px; color:#52525b; line-height:1.8; }
    .card li strong { color:#09090b; }
    .stat { text-align:center; padding:16px; }
    .stat-value { font-size:28px; font-weight:700; color:#09090b; }
    .stat-label { font-size:13px; color:#a1a1aa; margin-top:4px; }
    .muted { color:#a1a1aa; font-size:13px; }
  </style>
</head>
<body>
  <div style="padding:24px 16px;">
    <div class="container">
      <div class="header">
        <a href="${APP_URL}" class="header-logo">PropertyPilot AI</a>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} PropertyPilot AI. All rights reserved.</p>
        <p style="margin-top:8px;"><a href="${APP_URL}" style="color:#a1a1aa;text-decoration:underline;">propertypilot-ai.vercel.app</a></p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

export const emailTemplates = {
  /**
   * Welcome email — sent immediately after signup
   */
  welcome: (userName: string) => ({
    subject: "Welcome to PropertyPilot AI",
    html: emailLayout(`
      <h1>Welcome, ${userName}!</h1>
      <p>You've just joined the AI platform built for real estate professionals. Here's how to get started:</p>

      <div class="card">
        <h3>Your first 3 steps:</h3>
        <ul>
          <li><strong>Generate a listing</strong> — Enter a property and get a professional description in seconds</li>
          <li><strong>Add a lead</strong> — Start building your CRM pipeline</li>
          <li><strong>Explore AI tools</strong> — Hashtags, social posts, video scripts, and more</li>
        </ul>
      </div>

      <p><a href="${APP_URL}/dashboard" class="btn">Go to Dashboard &rarr;</a></p>

      <p class="muted" style="margin-top:24px;">Questions? Just reply to this email — we read every message.</p>
    `)
  }),

  /**
   * Activation nudge — sent 24h after signup if user hasn't generated a listing
   */
  activationNudge: (userName: string) => ({
    subject: "Your first AI listing is waiting",
    html: emailLayout(`
      <h1>Hey ${userName}, you haven't tried it yet</h1>
      <p>You signed up yesterday but haven't generated your first listing. It takes 30 seconds — just enter a property type, location, and a few features.</p>

      <div class="card">
        <h3>What you'll get instantly:</h3>
        <ul>
          <li><strong>Professional listing</strong> — ready for Idealista, Immobiliare.it, or any portal</li>
          <li><strong>5 SEO-optimized titles</strong> — A/B test for maximum clicks</li>
          <li><strong>English translation</strong> — attract international buyers</li>
          <li><strong>Short version</strong> — perfect for Subito.it or social media</li>
        </ul>
      </div>

      <p><a href="${APP_URL}/dashboard/listings" class="btn">Generate your first listing &rarr;</a></p>

      <p class="muted" style="margin-top:24px;">You have 5 free generations this month. No credit card needed.</p>
    `)
  }),

  /**
   * Upgrade nudge — sent when user reaches 50% of plan limit
   */
  upgradeNudge: (userName: string, currentUsage: number, limit: number) => ({
    subject: `You've used ${currentUsage} of ${limit} listings this month`,
    html: emailLayout(`
      <h1>You're growing fast, ${userName}</h1>
      <p>You've used <strong>${currentUsage} of ${limit}</strong> listings this month. That means PropertyPilot is working for you.</p>

      <div style="display:flex;gap:16px;margin:0 0 20px;">
        <div class="card" style="flex:1;text-align:center;">
          <div class="stat-value">${currentUsage}</div>
          <div class="stat-label">Used</div>
        </div>
        <div class="card" style="flex:1;text-align:center;">
          <div class="stat-value">${limit - currentUsage}</div>
          <div class="stat-label">Remaining</div>
        </div>
      </div>

      <div class="card">
        <h3>Why agents upgrade to Pro:</h3>
        <ul>
          <li><strong>200 listings/month</strong> — 4x your current plan</li>
          <li><strong>Full CRM</strong> — manage all leads in one place</li>
          <li><strong>AI automations</strong> — auto-respond to hot leads</li>
          <li><strong>Virtual Staging 3D</strong> — transform empty rooms</li>
        </ul>
      </div>

      <p><a href="${APP_URL}/dashboard/billing" class="btn">Upgrade to Pro — €497/mo &rarr;</a></p>
    `)
  }),

  /**
   * Usage limit warning — sent when user reaches 80% of limit
   */
  usageLimitWarning: (userName: string, currentUsage: number, limit: number) => ({
    subject: `${limit - currentUsage} listings remaining this month`,
    html: emailLayout(`
      <h1>Almost at your limit, ${userName}</h1>
      <p>You've used <strong>${currentUsage} of ${limit}</strong> listings. You have <strong>${limit - currentUsage} left</strong> until your plan resets.</p>

      <div class="card" style="text-align:center;">
        <div class="stat-value" style="color:#f59e0b;">${Math.round((currentUsage / limit) * 100)}%</div>
        <div class="stat-label">of your monthly limit used</div>
      </div>

      <p>Upgrade now to keep generating without interruption:</p>
      <p><a href="${APP_URL}/dashboard/billing" class="btn">See upgrade options &rarr;</a></p>

      <p class="muted" style="margin-top:24px;">Your limit resets on the 1st of next month.</p>
    `)
  }),

  /**
   * Success story / engagement email — sent after 7 days
   */
  successStory: (userName: string) => ({
    subject: "How top agents use PropertyPilot AI",
    html: emailLayout(`
      <h1>Tips from top performers</h1>
      <p>Hi ${userName}, here's how the best agents on PropertyPilot are getting results:</p>

      <div class="card">
        <h3>🏠 Milan — "Sold in 12 days"</h3>
        <p style="margin:0;font-size:14px;color:#52525b;">"I used the AI to create 5 title variants. The emotional version got 3x more clicks on Immobiliare.it. The apartment sold above asking price."</p>
        <p class="muted" style="margin:8px 0 0;">— Marco R., Luxury Agent</p>
      </div>

      <div class="card">
        <h3>🌍 Barcelona — "Pipeline doubled"</h3>
        <p style="margin:0;font-size:14px;color:#52525b;">"The AI follow-up emails save me 2 hours per day. My response rate went from 15% to 40%. I upgraded to Agency in the first week."</p>
        <p class="muted" style="margin:8px 0 0;">— Sofia L., Agency Owner</p>
      </div>

      <p><a href="${APP_URL}/dashboard" class="btn">Try it yourself &rarr;</a></p>
    `)
  }),

  /**
   * Weekly digest — sent every Monday morning
   */
  weeklyDigest: (userName: string, stats: {
    listingsGenerated: number;
    leadsAdded: number;
    hoursSaved: number;
    topTitle?: string;
  }) => ({
    subject: `Your week in review: ${stats.listingsGenerated} listings generated`,
    html: emailLayout(`
      <h1>Your weekly report</h1>
      <p>Hi ${userName}, here's how you used PropertyPilot this week:</p>

      <div style="display:flex;gap:12px;margin:0 0 20px;">
        <div class="card" style="flex:1;text-align:center;">
          <div class="stat-value">${stats.listingsGenerated}</div>
          <div class="stat-label">Listings</div>
        </div>
        <div class="card" style="flex:1;text-align:center;">
          <div class="stat-value">${stats.leadsAdded}</div>
          <div class="stat-label">Leads</div>
        </div>
        <div class="card" style="flex:1;text-align:center;">
          <div class="stat-value">${stats.hoursSaved}h</div>
          <div class="stat-label">Saved</div>
        </div>
      </div>

      ${stats.topTitle ? `
      <div class="card">
        <h3>Your best-performing title this week:</h3>
        <p style="margin:0;font-size:14px;font-weight:600;color:#09090b;">"${stats.topTitle}"</p>
      </div>
      ` : ''}

      <p><a href="${APP_URL}/dashboard" class="btn">View your dashboard &rarr;</a></p>

      <p class="muted" style="margin-top:24px;">Keep going — consistency is the #1 predictor of success in real estate marketing.</p>
    `)
  }),
};

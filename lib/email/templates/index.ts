/**
 * Email Templates — React Email compatible HTML generators
 * Used by Resend to send transactional and sequence emails.
 *
 * When Resend + React Email is fully configured, these can be
 * converted to proper React Email components. For now they
 * return HTML strings for the Resend API.
 */

const BRAND = {
  name: "PropertyPilot AI",
  url: "https://propertypilot-ai.vercel.app",
  color: "#6366f1", // indigo-500
  from: "PropertyPilot AI <noreply@propertypilotai.com>",
};

function layout(content: string, preheader: string = ""): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#09090b;color:#fafafa}
.container{max-width:560px;margin:0 auto;padding:40px 24px}
.card{background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px 24px}
.logo{text-align:center;margin-bottom:24px}
.logo a{color:#fafafa;text-decoration:none;font-size:18px;font-weight:700}
.logo span{background:linear-gradient(135deg,#6366f1,#8b5cf6);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
h1{font-size:22px;font-weight:700;margin:0 0 8px;color:#fafafa}
h2{font-size:18px;font-weight:600;margin:16px 0 8px;color:#fafafa}
p{font-size:14px;line-height:1.7;color:#a1a1aa;margin:0 0 16px}
.btn{display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px}
.footer{text-align:center;margin-top:32px;font-size:11px;color:#52525b}
.footer a{color:#6366f1;text-decoration:none}
.highlight{background:#6366f1;color:#fff;padding:2px 8px;border-radius:4px;font-weight:600}
ul{padding-left:20px;margin:0 0 16px}
li{font-size:14px;color:#a1a1aa;margin-bottom:6px;line-height:1.6}
</style></head><body>
${preheader ? `<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>` : ""}
<div class="container"><div class="card">
<div class="logo"><a href="${BRAND.url}">🏠 <span>${BRAND.name}</span></a></div>
${content}
</div>
<div class="footer">
<p>© 2026 ${BRAND.name} · <a href="${BRAND.url}/privacy">Privacy</a> · <a href="${BRAND.url}/terms">Terms</a></p>
<p><a href="${BRAND.url}/auth/login">Manage preferences</a></p>
</div></div></body></html>`;
}

/* ─── Welcome Email ─── */
export function welcomeEmail(name: string): { subject: string; html: string } {
  return {
    subject: `Welcome to PropertyPilot AI, ${name}! 🏠`,
    html: layout(`
      <h1>Welcome aboard, ${name}! 🎉</h1>
      <p>You've just joined 500+ agencies across Europe who are using AI to close more deals, faster.</p>
      <h2>Your first 3 steps:</h2>
      <ul>
        <li><strong>Generate your first listing</strong> — Go to AI Listings and create a portal-optimized description in 30 seconds</li>
        <li><strong>Set up your brand voice</strong> — Customize the AI to match your agency's tone and style</li>
        <li><strong>Connect a portal</strong> — Link Immobiliare.it, Idealista, or any of our 11 supported portals</li>
      </ul>
      <p style="text-align:center;margin:24px 0">
        <a href="${BRAND.url}/dashboard" class="btn">Open Your Dashboard →</a>
      </p>
      <p>Your 7-day free trial starts now. No credit card needed.</p>
      <p>Questions? Reply to this email — a real human will answer within 4 hours.</p>
      <p>— The PropertyPilot AI Team</p>
    `, "Your AI-powered real estate journey starts now"),
  };
}

/* ─── Trial Ending Email ─── */
export function trialEndingEmail(name: string, daysLeft: number): { subject: string; html: string } {
  return {
    subject: `${name}, your trial ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""} ⏰`,
    html: layout(`
      <h1>Your trial ends in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}</h1>
      <p>Hi ${name}, just a friendly reminder that your PropertyPilot AI trial expires soon.</p>
      <h2>What you'll lose access to:</h2>
      <ul>
        <li>AI listing generation (6 languages, 11 portals)</li>
        <li>Smart CRM with lead scoring</li>
        <li>Voice AI agent</li>
        <li>Portal publishing</li>
      </ul>
      <h2>Lock in the best price:</h2>
      <p>Upgrade now and save <span class="highlight">20% with annual billing</span>. That's Starter from just €158/month.</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${BRAND.url}/pricing" class="btn">See Plans & Upgrade →</a>
      </p>
      <p>The average agent saves 40+ hours/month — that's over €2,000 in time value alone.</p>
    `, `Your trial ends in ${daysLeft} days — upgrade now to keep your AI tools`),
  };
}

/* ─── Payment Success Email ─── */
export function paymentSuccessEmail(name: string, plan: string, amount: string): { subject: string; html: string } {
  return {
    subject: `Payment confirmed — you're on ${plan}! 🎉`,
    html: layout(`
      <h1>You're officially on ${plan}! 🚀</h1>
      <p>Hi ${name}, your payment of <strong>${amount}</strong> has been confirmed.</p>
      <h2>What's unlocked:</h2>
      <ul>
        <li>All ${plan} features are now active</li>
        <li>Your usage limits have been upgraded</li>
        <li>Priority support is enabled</li>
      </ul>
      <p style="text-align:center;margin:24px 0">
        <a href="${BRAND.url}/dashboard" class="btn">Start Using ${plan} →</a>
      </p>
      <p>Need help getting started? Check our <a href="${BRAND.url}/docs" style="color:#6366f1">documentation</a> or reply to this email.</p>
    `, `Payment confirmed — your ${plan} plan is active`),
  };
}

/* ─── Re-engagement Email ─── */
export function reEngagementEmail(name: string, daysSinceLastLogin: number): { subject: string; html: string } {
  return {
    subject: `${name}, we miss you! Here's what's new 🏠`,
    html: layout(`
      <h1>We noticed you've been away</h1>
      <p>Hi ${name}, it's been ${daysSinceLastLogin} days since your last visit. A lot has happened:</p>
      <h2>What's new on PropertyPilot AI:</h2>
      <ul>
        <li>🆕 <strong>AI Listings v2</strong> — Portal-optimized descriptions for 11 EU portals</li>
        <li>🆕 <strong>Portal Connections</strong> — Publish to Immobiliare.it, Idealista, SeLoger & more</li>
        <li>🆕 <strong>Brand Voice Profiles</strong> — AI writes in YOUR agency's tone</li>
        <li>🆕 <strong>Annual plans</strong> — Save 20% with yearly billing</li>
      </ul>
      <p style="text-align:center;margin:24px 0">
        <a href="${BRAND.url}/dashboard" class="btn">Come Back & Explore →</a>
      </p>
      <p>Still not sure? Try our <a href="${BRAND.url}/tools/ai-property-description" style="color:#6366f1">free AI description generator</a> — no login needed.</p>
    `, "New features are waiting for you on PropertyPilot AI"),
  };
}

/* ─── Welcome Sequence Day-Specific ─── */
export function welcomeSequenceEmail(name: string, day: number): { subject: string; html: string } | null {
  switch (day) {
    case 1:
      return welcomeEmail(name);
    case 2:
      return {
        subject: "Quick tip: Generate listings 10x faster ⚡",
        html: layout(`
          <h1>Pro tip: The AI Listings Engine</h1>
          <p>Hi ${name}, did you know you can generate professional listings for 11 European portals in under 30 seconds?</p>
          <p><strong>Here's how:</strong></p>
          <ul>
            <li>Go to Dashboard → AI Listings v2</li>
            <li>Enter your property details</li>
            <li>Select target portals (Immobiliare.it, Idealista, etc.)</li>
            <li>Choose your languages and style</li>
            <li>Click Generate — done!</li>
          </ul>
          <p style="text-align:center;margin:24px 0">
            <a href="${BRAND.url}/dashboard/ai-listings" class="btn">Try It Now →</a>
          </p>
        `, "Generate portal-optimized listings in 30 seconds"),
      };
    case 4:
      return {
        subject: "Connect your first portal today 🔗",
        html: layout(`
          <h1>Publish to portals automatically</h1>
          <p>Hi ${name}, PropertyPilot connects to 11 European portals. Here's how to get started:</p>
          <ul>
            <li><strong>Italy:</strong> Immobiliare.it (XML feed) + Idealista (API)</li>
            <li><strong>Spain:</strong> Idealista + Fotocasa</li>
            <li><strong>France:</strong> SeLoger + LeBonCoin</li>
            <li><strong>Germany:</strong> ImmoScout24 + Immowelt (EstateSync)</li>
            <li><strong>UK:</strong> Rightmove + Zoopla</li>
          </ul>
          <p style="text-align:center;margin:24px 0">
            <a href="${BRAND.url}/dashboard/portals" class="btn">Connect a Portal →</a>
          </p>
        `, "Publish to 11 EU portals from one dashboard"),
      };
    case 6:
      return trialEndingEmail(name, 1);
    default:
      return null;
  }
}

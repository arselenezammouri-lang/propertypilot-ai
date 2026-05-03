/**
 * Dunning Email Templates — Failed payment recovery
 * Sent via Resend when Stripe fires invoice.payment_failed
 */

const BRAND_URL = "https://propertypilot-ai.vercel.app";

function layout(content: string, preheader: string): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>body{margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#09090b;color:#fafafa}
.c{max-width:560px;margin:0 auto;padding:40px 24px}
.card{background:#18181b;border:1px solid #27272a;border-radius:16px;padding:32px 24px}
.logo{text-align:center;margin-bottom:24px}
.logo a{color:#fafafa;text-decoration:none;font-size:18px;font-weight:700}
h1{font-size:22px;font-weight:700;margin:0 0 8px;color:#fafafa}
p{font-size:14px;line-height:1.7;color:#a1a1aa;margin:0 0 16px}
.btn{display:inline-block;padding:12px 28px;background:#ef4444;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:14px}
.btn-secondary{background:#6366f1}
.footer{text-align:center;margin-top:32px;font-size:11px;color:#52525b}
.footer a{color:#6366f1;text-decoration:none}
.warning{background:#7f1d1d;border:1px solid #991b1b;border-radius:8px;padding:12px 16px;margin:16px 0}
.warning p{color:#fca5a5;margin:0;font-size:13px}
</style></head><body>
<div style="display:none;max-height:0;overflow:hidden">${preheader}</div>
<div class="c"><div class="card">
<div class="logo"><a href="${BRAND_URL}">🏠 PropertyPilot AI</a></div>
${content}
</div>
<div class="footer"><p>© 2026 PropertyPilot AI · <a href="${BRAND_URL}/privacy">Privacy</a></p></div></div></body></html>`;
}

/** First failure — gentle reminder */
export function dunningFirstFailure(name: string, amount: string, updateUrl: string): { subject: string; html: string } {
  return {
    subject: "⚠️ Payment failed — please update your card",
    html: layout(`
      <h1>Payment couldn't be processed</h1>
      <p>Hi ${name}, we tried to charge your card for your PropertyPilot subscription (${amount}) but the payment was declined.</p>
      <p>This can happen due to an expired card, insufficient funds, or a temporary bank issue.</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${updateUrl}" class="btn">Update Payment Method →</a>
      </p>
      <p>We'll retry automatically in 3 days. If you update your card now, the charge will process immediately.</p>
    `, "Your payment was declined — update your card to keep your subscription active"),
  };
}

/** Second failure — urgency */
export function dunningSecondFailure(name: string, amount: string, updateUrl: string): { subject: string; html: string } {
  return {
    subject: "🚨 Second payment attempt failed — account at risk",
    html: layout(`
      <h1>Your account is at risk</h1>
      <p>Hi ${name}, this is our second attempt to process your payment of ${amount}. It was declined again.</p>
      <div class="warning">
        <p>⚠️ If your payment isn't resolved within 4 days, your account will be downgraded to the Free plan and you'll lose access to:</p>
      </div>
      <ul style="color:#a1a1aa;font-size:14px;padding-left:20px">
        <li>AI listing generation</li>
        <li>CRM and lead management</li>
        <li>Voice AI and WhatsApp agent</li>
        <li>Portal connections</li>
      </ul>
      <p style="text-align:center;margin:24px 0">
        <a href="${updateUrl}" class="btn">Update Card Now →</a>
      </p>
    `, "Second payment failure — your account will be downgraded if not resolved"),
  };
}

/** Third failure — final notice + downgrade */
export function dunningFinalNotice(name: string, updateUrl: string): { subject: string; html: string } {
  return {
    subject: "❌ Account downgraded — payment failed 3 times",
    html: layout(`
      <h1>Your account has been downgraded</h1>
      <p>Hi ${name}, after 3 failed payment attempts, your PropertyPilot subscription has been paused and your account has been moved to the Free plan.</p>
      <div class="warning">
        <p>Your data is safe. You can reactivate your subscription at any time by updating your payment method.</p>
      </div>
      <p style="text-align:center;margin:24px 0">
        <a href="${updateUrl}" class="btn-secondary btn">Reactivate Subscription →</a>
      </p>
      <p>If you believe this is an error or need help, reply to this email.</p>
    `, "Your PropertyPilot subscription has been paused due to payment failure"),
  };
}

/** Upcoming invoice reminder */
export function invoiceUpcoming(name: string, amount: string, dueDate: string): { subject: string; html: string } {
  return {
    subject: `Upcoming invoice: ${amount} on ${dueDate}`,
    html: layout(`
      <h1>Upcoming Payment</h1>
      <p>Hi ${name}, your next PropertyPilot invoice of <strong>${amount}</strong> will be charged on <strong>${dueDate}</strong>.</p>
      <p>Make sure your payment method is up to date to avoid any interruption.</p>
      <p style="text-align:center;margin:24px 0">
        <a href="${BRAND_URL}/dashboard/billing" class="btn-secondary btn">Manage Billing →</a>
      </p>
    `, `Your next PropertyPilot invoice: ${amount} on ${dueDate}`),
  };
}
